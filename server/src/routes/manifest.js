import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// /manifest/101
router.get("/manifest/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    const q = `
      SELECT information
      FROM public_info
      WHERE cardid = $1
    `;
    const result = await pool.query(q, [cardId]);

    let displayName = "KHContactum";

    if (result.rows?.length) {
      const info = result.rows[0].information || {};
      displayName =
        info.company?.name?.am ||
        info.company?.name?.en ||
        info.company?.name?.ru ||
        "KHContactum";
    }

    displayName = displayName.toString().trim();

    res.json({
      name: displayName,
      short_name: displayName.slice(0, 14),
      start_url: `/${cardId}`,
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
      ]
    });
  } catch (e) {
    console.log("Manifest error:", e);
    res.json({
      name: "KHContactum",
      short_name: "KHContactum",
      start_url: "/",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
      ]
    });
  }
});

export default router;
