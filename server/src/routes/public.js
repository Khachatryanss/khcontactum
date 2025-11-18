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

/* ---------- fetch information by card_id ---------- */
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

/* ---------- save information by card_id (rating-ի համար) ---------- */
async function saveInformationByCardId(cardId, information) {
  const q = `
    UPDATE admin_info AS ai
    SET information = $2
    FROM admins AS a
    WHERE ai.admin_id = a.id
      AND a.card_id   = $1
      AND a.is_active = TRUE
  `;
  await pool.query(q, [cardId, information]);
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

/* ========== BRAND RATING (Like / Dislike) ========== */
/**
 * POST /api/public/brand-rating
 * body: { cardId, workerKey, prevStatus, nextStatus }
 * prevStatus / nextStatus: "none" | "like" | "dislike"
 *
 * Վերադարձնում է թարմացված { likes, dislikes }
 */
r.post("/brand-rating", async (req, res) => {
  try {
    const { cardId, workerKey, prevStatus, nextStatus } = req.body || {};

    const numericCardId = Number(cardId);
    if (!Number.isFinite(numericCardId) || !workerKey) {
      return res.status(400).json({ error: "Bad cardId or workerKey" });
    }

    const information = await fetchInformationByCardId(numericCardId);
    if (!information) {
      return res.status(404).json({ error: "Card not found" });
    }

    const list = Array.isArray(information.brandInfos)
      ? information.brandInfos
      : [];

    const idx = list.findIndex((x) =>
      String(x.id || x.keyword || "")
        .toLowerCase()
        .trim() === String(workerKey).toLowerCase().trim()
    );

    if (idx === -1) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const w = { ...(list[idx] || {}) };
    w.likes = Number(w.likes || 0) || 0;
    w.dislikes = Number(w.dislikes || 0) || 0;

    const apply = (from, to) => {
      if (from === to) return;
      if (from === "like") w.likes = Math.max(0, w.likes - 1);
      if (from === "dislike") w.dislikes = Math.max(0, w.dislikes - 1);
      if (to === "like") w.likes += 1;
      if (to === "dislike") w.dislikes += 1;
    };

    apply(prevStatus || "none", nextStatus || "none");

    list[idx] = w;
    information.brandInfos = list;

    await saveInformationByCardId(numericCardId, information);

    return res.json({ likes: w.likes, dislikes: w.dislikes });
  } catch (e) {
    console.error("brand-rating error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default r;
