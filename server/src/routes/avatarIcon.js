import express from "express";
import sharp from "sharp";
import { pool } from "../db.js";
import path from "path";
import fs from "fs";

const router = express.Router();
const ICON_DIR = path.resolve("server/public/cardIcons");

// fallback եթե avatar չունի
const FALLBACK_ICON = path.resolve("server/public/icon-512.png");

if (!fs.existsSync(ICON_DIR)) {
  fs.mkdirSync(ICON_DIR, { recursive: true });
}

function isVideoUrl(u = "") {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(u);
}

// avatar-ը բերում ենք ANY ձևով (string / object / video / image)
function pickAvatarImage(info = {}) {
  const a = info?.avatar;
  const p = info?.profile?.avatar;
  const logo = info?.company?.logoUrl || info?.company?.logo_url;

  // avatar object
  if (a && typeof a === "object") {
    if (a.type === "image" && a.imageUrl) return a.imageUrl;

    if (a.type === "video") {
      if (a.previewUrl) return a.previewUrl;
      if (a.posterUrl) return a.posterUrl;
      if (a.imageUrl && !isVideoUrl(a.imageUrl)) return a.imageUrl;
      return ""; 
    }

    if (a.imageUrl && !isVideoUrl(a.imageUrl)) return a.imageUrl;
    if (a.previewUrl) return a.previewUrl;
    if (a.posterUrl) return a.posterUrl;
  }

  // avatar string
  if (typeof a === "string" && a.trim() && !isVideoUrl(a)) return a;

  // profile avatar
  if (p && typeof p === "object") {
    if (p.imageUrl && !isVideoUrl(p.imageUrl)) return p.imageUrl;
    if (p.previewUrl) return p.previewUrl;
    if (p.posterUrl) return p.posterUrl;
  }
  if (typeof p === "string" && p.trim() && !isVideoUrl(p)) return p;

  // fallback logo
  if (logo && !isVideoUrl(logo)) return logo;

  return "";
}

// /avatar-icon/101/192
router.get("/avatar-icon/:cardId/:size", async (req, res) => {
  try {
    const { cardId, size } = req.params;

    const sz = Math.max(64, Math.min(1024, Number(size) || 192));
    const iconPath = path.join(ICON_DIR, `${cardId}-${sz}.png`);

    // եթե արդեն ստեղծված է՝ ուղարկում ենք
    if (fs.existsSync(iconPath)) {
      return res.sendFile(iconPath);
    }

    // բերում ենք public info
    const q = `SELECT information FROM public_info WHERE cardid = $1`;
    const r = await pool.query(q, [cardId]);
    const info = r.rows?.[0]?.information || {};

    // ընտրում ենք avatar preview image-ը
    const imgUrl = pickAvatarImage(info);

    if (!imgUrl) {
      return res.sendFile(FALLBACK_ICON);
    }

    // ներբեռնում ենք real avatar-ը
    const resp = await fetch(imgUrl);
    if (!resp.ok) throw new Error("failed to fetch avatar");

    const buf = Buffer.from(await resp.arrayBuffer());

    // resize PNG
    await sharp(buf)
      .resize(sz, sz, { fit: "cover" })
      .png()
      .toFile(iconPath);

    return res.sendFile(iconPath);

  } catch (e) {
    console.log("avatar icon error:", e);
    return res.sendFile(FALLBACK_ICON);
  }
});

export default router;
