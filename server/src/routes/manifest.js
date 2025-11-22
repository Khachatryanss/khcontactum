import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// /manifest/101 → տվյալ card-ի manifest.json
router.get("/manifest/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    const q = `
      SELECT information
      FROM public_info
      WHERE cardid = $1
    `;

    const result = await pool.query(q, [cardId]);
    const info = result.rows?.[0]?.information || {};

    // նույն անունը՝ ինչ avatar-ի տակ Home-ում
    const displayName =
      info.company?.name?.am ||
      info.company?.name?.en ||
      info.company?.name?.ru ||
      info.companyTitle ||
      "KHContactum";

    const cleanName = displayName.toString().trim();

    res.json({
      name: cleanName,
      short_name: cleanName.slice(0, 14),
      start_url: `/${cardId}`,          // ✅ հենց card-ի էջը բացի
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        { src: `/avatar-icon/${cardId}/192`, sizes: "192x192", type: "image/png" },
        { src: `/avatar-icon/${cardId}/512`, sizes: "512x512", type: "image/png" },
        { src: `/avatar-icon/${cardId}/1024`, sizes: "1024x1024", type: "image/png" }
      ]
    });
  } catch (e) {
    console.log("Manifest error:", e);
    res.json({
      name: "KHContactum",
      short_name: "KHContactum"
    });
  }
});

export default router;
