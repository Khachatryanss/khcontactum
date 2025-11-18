// server/src/routes/public.js
import { Router } from "express";
import { pool } from "../db.js";

const r = Router();

// PUBLIC_BASE – գալիս է .env-ից, վերջի slash-երը հանում ենք, որ // չլնի
const PUBLIC_BASE = (process.env.PUBLIC_BASE || "http://localhost:5050")
  .replace(/\/+$/, "");

/* ---------- helpers ---------- */
function absUrl(u = "") {
  if (!u) return "";
  if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${PUBLIC_BASE}${path}`;
}

// info normalizer for public card data
function normalizeInformation(info = {}) {
  const rawLogo =
    info.logo_url ||
    info.logo ||
    info?.assets?.logo_url ||
    info?.profile?.avatar ||
    "";

  return {
    ...info,
    logo_url: absUrl(rawLogo || ""),
    background: {
      type    : info?.background?.type || "color",
      color   : info?.background?.color || "#ffffff",
      imageUrl: absUrl(info?.background?.imageUrl || ""),
      videoUrl: absUrl(info?.background?.videoUrl || "")
    },
    profile: {
      ...(info.profile || {}),
      avatar: absUrl(info?.profile?.avatar || rawLogo || "")
    }
  };
}

// tiny logger for this router
r.use((req, _res, next) => {
  console.log("[PUBLIC ROUTER]", req.method, req.originalUrl);
  next();
});

/* ---------- fetch helpers ---------- */

async function fetchInformationByCardId(cardId) {
  const q = `
    SELECT ai.information
    FROM admins a
    JOIN admin_info ai ON ai.admin_id = a.id
    WHERE a.card_id = $1 AND a.is_active = TRUE
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [cardId]);
  return rows[0]?.information || null;
}

// rating-ի համար պետք է նաև admin_id-ն
async function fetchAdminInfoRowByCardId(cardId) {
  const q = `
    SELECT ai.admin_id, ai.information
    FROM admins a
    JOIN admin_info ai ON ai.admin_id = a.id
    WHERE a.card_id = $1 AND a.is_active = TRUE
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [cardId]);
  if (!rows[0]) return null;
  return {
    admin_id: rows[0].admin_id,
    information: rows[0].information || {}
  };
}

/* ---------- rating helpers ---------- */

function ratingDelta(prevStatus = "none", nextStatus = "none") {
  // վերադարձնում է { dLikes, dDislikes }
  if (prevStatus === nextStatus) return { dLikes: 0, dDislikes: 0 };

  const norm = (s) =>
    s === "like" || s === "dislike" || s === "none" ? s : "none";

  const prev = norm(prevStatus);
  const next = norm(nextStatus);

  let dLikes = 0;
  let dDislikes = 0;

  if (prev === "none" && next === "like") {
    dLikes = 1;
  } else if (prev === "none" && next === "dislike") {
    dDislikes = 1;
  } else if (prev === "like" && next === "none") {
    dLikes = -1;
  } else if (prev === "dislike" && next === "none") {
    dDislikes = -1;
  } else if (prev === "like" && next === "dislike") {
    dLikes = -1;
    dDislikes = 1;
  } else if (prev === "dislike" && next === "like") {
    dDislikes = -1;
    dLikes = 1;
  }

  return { dLikes, dDislikes };
}

function applyRatingToInformation(information = {}, workerKey, prevStatus, nextStatus) {
  const { dLikes, dDislikes } = ratingDelta(prevStatus, nextStatus);
  if (!dLikes && !dDislikes) {
    return { changed: false, information };
  }

  const clone = { ...(information || {}) };
  const list = Array.isArray(clone.brandInfos) ? [...clone.brandInfos] : [];
  const keyStr = String(workerKey || "");

  let changed = false;

  const updated = list.map((item) => {
    const idKey =
      (item && item.id != null ? String(item.id) : "") ||
      (item && item.keyword != null ? String(item.keyword) : "");

    if (!idKey || idKey !== keyStr) return item;

    const likes = Math.max(0, Number(item.likes ?? 0) + dLikes);
    const dislikes = Math.max(0, Number(item.dislikes ?? 0) + dDislikes);

    changed = true;
    return {
      ...item,
      likes,
      dislikes
    };
  });

  if (!changed) {
    return { changed: false, information };
  }

  clone.brandInfos = updated;
  return { changed: true, information: clone };
}

/* ========== PUBLIC API ========== */

// Նոր ձևաչափը՝ info JSON only (normalize արած)
r.get("/card/:card_id", async (req, res) => {
  const cardId = Number(req.params.card_id);
  if (!Number.isFinite(cardId)) {
    return res.status(400).json({ error: "Bad card_id" });
  }

  try {
    const information = await fetchInformationByCardId(cardId);
    if (!information) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json({
      ok: true,
      card_id: cardId,
      data: normalizeInformation(information)
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

// Հին legacy `/c/:card_id` ֆորմատը՝ admin + profile + items
r.get("/c/:card_id", async (req, res) => {
  const cardId = Number(req.params.card_id);
  if (!Number.isFinite(cardId)) {
    return res.status(400).json({ error: "Bad card_id" });
  }

  try {
    const { rows: arows } = await pool.query(
      "SELECT id, username, card_id, is_active FROM admins WHERE card_id=$1",
      [cardId]
    );
    const admin = arows[0];
    if (!admin || !admin.is_active) {
      return res.status(404).json({ error: "Not found" });
    }

    const { rows: prows } = await pool.query(
      "SELECT display_name, headline, bio, contacts, updated_at FROM admin_profiles WHERE admin_id=$1",
      [admin.id]
    );
    const profile =
      prows[0] || {
        display_name: "",
        headline    : "",
        bio         : "",
        contacts    : {},
        updated_at  : null
      };

    const { rows: irows } = await pool.query(
      `SELECT id, title, body, link_url, created_at, updated_at
       FROM admin_items
       WHERE admin_id=$1
       ORDER BY id DESC`,
      [admin.id]
    );

    return res.json({
      admin : {
        id      : admin.id,
        username: admin.username,
        card_id : admin.card_id
      },
      profile,
      items  : irows
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ========== BRAND RATING API ========== */
/**
 * body: { cardId, workerKey, prevStatus, nextStatus }
 * prevStatus / nextStatus ∈ "none" | "like" | "dislike"
 */
r.post("/brand-rating", async (req, res) => {
  try {
    const { cardId, workerKey, prevStatus, nextStatus } = req.body || {};
    const cardNum = Number(cardId);

    if (!Number.isFinite(cardNum) || !workerKey) {
      return res.status(400).json({ error: "Bad payload" });
    }

    const row = await fetchAdminInfoRowByCardId(cardNum);
    if (!row) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { admin_id, information } = row;
    const { changed, information: nextInfo } =
      applyRatingToInformation(information, workerKey, prevStatus, nextStatus);

    if (!changed) {
      return res.json({ ok: true, changed: false });
    }

    await pool.query(
      "UPDATE admin_info SET information = $2 WHERE admin_id = $1",
      [admin_id, nextInfo]
    );

    return res.json({ ok: true, changed: true });
  } catch (e) {
    console.error("brand-rating error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default r;
