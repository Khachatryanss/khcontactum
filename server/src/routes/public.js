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
      type: info?.background?.type || "color",
      color: info?.background?.color || "#ffffff",
      imageUrl: absUrl(info?.background?.imageUrl || ""),
      videoUrl: absUrl(info?.background?.videoUrl || ""),
    },
    profile: {
      ...(info.profile || {}),
      avatar: absUrl(info?.profile?.avatar || rawLogo || ""),
    },
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
      data: normalizeInformation(information),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ========= LIKE / DISLIKE RATING (BrandInfo) =========
   URL: POST /api/public/card/:card_id/brandinfo/:workerKey/rating
   Body: { likes: number, dislikes: number }
   Պահում ենք admin_info.information.brandInfos մեջ։
*/
r.post("/card/:card_id/brandinfo/:workerKey/rating", async (req, res) => {
  const cardId = Number(req.params.card_id);
  const workerKey = String(req.params.workerKey || "").trim();
  if (!Number.isFinite(cardId) || !workerKey) {
    return res.status(400).json({ error: "Bad params" });
  }

  let { likes, dislikes } = req.body || {};
  likes = Number(likes);
  dislikes = Number(dislikes);
  if (!Number.isFinite(likes) || likes < 0) likes = 0;
  if (!Number.isFinite(dislikes) || dislikes < 0) dislikes = 0;

  try {
    // վերցնում ենք admin_id + information
    const q = `
      SELECT a.id AS admin_id, ai.information
      FROM admins a
      JOIN admin_info ai ON ai.admin_id = a.id
      WHERE a.card_id = $1 AND a.is_active = TRUE
      LIMIT 1
    `;
    const { rows } = await pool.query(q, [cardId]);
    if (!rows.length) {
      return res.status(404).json({ error: "Not found" });
    }
    const adminId = rows[0].admin_id;
    const info = rows[0].information || {};

    let brandInfos = Array.isArray(info.brandInfos)
      ? info.brandInfos
      : Array.isArray(info.brandWorkers)
      ? info.brandWorkers
      : [];

    let changed = false;
    brandInfos = brandInfos.map((w) => {
      const k =
        (w.id && String(w.id)) ||
        (w.keyword && String(w.keyword)) ||
        "";
      if (k === workerKey) {
        changed = true;
        return {
          ...w,
          likes,
          dislikes,
        };
      }
      return w;
    });

    if (!changed) {
      // եթե workerKey չգտնվեց, ուղղակի չենք փոխում
      return res.json({ ok: true, updated: false });
    }

    const nextInfo = {
      ...info,
      brandInfos,
    };

    await pool.query(
      "UPDATE admin_info SET information = $1 WHERE admin_id = $2",
      [nextInfo, adminId]
    );

    return res.json({ ok: true, updated: true });
  } catch (e) {
    console.error("rating update error", e);
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
        headline: "",
        bio: "",
        contacts: {},
        updated_at: null,
      };

    const { rows: irows } = await pool.query(
      `SELECT id, title, body, link_url, created_at, updated_at
       FROM admin_items
       WHERE admin_id=$1
       ORDER BY id DESC`,
      [admin.id]
    );

    return res.json({
      admin: {
        id: admin.id,
        username: admin.username,
        card_id: admin.card_id,
      },
      profile,
      items: irows,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default r;
