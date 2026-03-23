import express from "express";
import { pool } from "../db.js";

const router = express.Router();

function pickBestText(values = []) {
  for (const v of values) {
    const s = (v || "").toString().trim();
    if (s) return s;
  }
  return "";
}

function pickLangText(v) {
  if (!v) return "";
  if (typeof v === "string") return v.toString().trim();
  const order = [
    "am",
    "en",
    "ru",
    "ar",
    "fr",
    "kz",
    "chn",
    "de",
    "es",
    "it",
    "fa",
    "geo",
    "tr",
  ];
  for (const k of order) {
    const s = (v?.[k] || "").toString().trim();
    if (s) return s;
  }
  return "";
}

function buildCardTitle(info = {}) {
  const companyName = pickLangText(info?.company?.name);
  const displayName = pickBestText([
    info?.profile?.display_name,
    info?.profile?.name,
    info?.display_name,
    info?.name,
  ]);
  const headline = pickBestText([
    info?.profile?.headline,
    info?.headline,
    pickLangText(info?.description),
    pickLangText(info?.profile?.about),
  ]);
  return pickBestText([
    companyName && headline ? `${companyName} ${headline}` : "",
    companyName,
    displayName && headline ? `${displayName} ${headline}` : "",
    displayName,
    headline,
    "KHContactum",
  ]);
}

function defaultManifest() {
  return {
    name: "KHContactum",
    short_name: "KHContactum",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

function sendManifest(res, payload) {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.type("application/manifest+json");
  return res.send(JSON.stringify(payload));
}

async function handleCardManifest(req, res) {
  try {
    const cardId = Number(req.params.cardId);
    if (!Number.isFinite(cardId)) {
      return sendManifest(res, defaultManifest());
    }

    const q = `
      SELECT ai.information
      FROM admins a
      JOIN admin_info ai ON ai.admin_id = a.id
      WHERE a.card_id = $1 AND a.is_active = TRUE
      LIMIT 1
    `;
    const result = await pool.query(q, [cardId]);

    const info = result.rows?.[0]?.information || {};
    const displayName = buildCardTitle(info);
    const shortName = displayName.slice(0, 18) || "KHContactum";
    const cardPath = `/${cardId}`;

    return sendManifest(res, {
      name: displayName,
      short_name: shortName,
      start_url: cardPath,
      scope: "/",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  } catch (e) {
    console.log("Manifest error:", e);
    return sendManifest(res, defaultManifest());
  }
}

router.get("/manifest.json", (_req, res) => sendManifest(res, defaultManifest()));
router.get("/api/public/manifest.json", (_req, res) =>
  sendManifest(res, defaultManifest())
);

// Keep top-level route for setups that proxy it correctly.
router.get("/manifest/:cardId", handleCardManifest);
// Guaranteed API route for frontend deployments that only proxy /api to backend.
router.get("/api/public/manifest/:cardId", handleCardManifest);

export default router;
