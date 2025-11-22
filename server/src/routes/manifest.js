import express from "express";
import db from "../db.js";

const router = express.Router();

// /manifest/101  → կվերադարձնի տվյալ card-ի manifest
router.get("/manifest/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    // Քաշում ենք տվյալ card-ի public info-ն
    const q = `
      SELECT name, title, companyTitle, info
      FROM public_info
      WHERE cardId = ?
    `;
    const rows = await db.all(q, [cardId]);

    let displayName = "KHContactum";

    if (rows && rows.length > 0) {
      const item = rows[0];

      // ընտրում ենք այն անունը, որը երևում է մեր public էջում
      // եթե companyTitle կա — դա
      // եթե name.am կա — դա
      // եթե title կա — դա
      displayName =
        item.companyTitle ||
        (item.name?.am || item.name || "") ||
        item.title ||
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
        {
          src: "/icon-192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    });
  } catch (e) {
    console.log(e);
    res.json({
      name: "KHContactum",
      short_name: "KHContactum"
    });
  }
});

export default router;
