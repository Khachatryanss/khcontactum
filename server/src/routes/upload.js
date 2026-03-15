// server/src/routes/upload.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { auth } from "../middleware/auth.js";
import { pool } from "../db.js";

const r = Router();

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function getPath(obj, pathStr) {
  if (!obj || typeof obj !== "object") return undefined;
  const keys = pathStr.split(".");
  let cur = obj;
  for (const k of keys) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[k];
  }
  return cur;
}

function setPath(obj, pathStr, value) {
  const keys = pathStr.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof cur[keys[i]] !== "object" || cur[keys[i]] === null) {
      cur[keys[i]] = {};
    }
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

function safeFilePathFromUrlPath(storedValue) {
  if (!storedValue || typeof storedValue !== "string") return null;

  let v = storedValue.trim();
  if (!v) return null;

  // If a full URL was stored (e.g. https://api.khcontactum.com/file/123.jpg),
  // extract just the pathname so we can work with /file/...
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      v = u.pathname || "";
    } catch {
      // if URL parse fails, fall through and treat as plain string
    }
  }

  // Normalise known /file/ prefixes
  if (v.startsWith("/file/")) {
    v = v.slice("/file/".length);
  } else if (v.startsWith("file/")) {
    v = v.slice("file/".length);
  }

  // If it still looks like a nested path (with / or \), but not a simple filename, skip
  if (v.includes("/") || v.includes("\\")) return null;

  // Final safety checks on filename
  if (!v || v.includes("..")) return null;

  return path.join(UPLOAD_DIR, v);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safe = Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
    cb(null, safe);
  },
});

const imageMimes = [
  "image/png","image/jpeg","image/webp","image/gif","image/jpg"
];
const videoMimes = ["video/mp4","video/webm","video/ogg"];
const allowedImageExts = ["png","jpg","jpeg","webp","gif"];
const allowedVideoExts = ["mp4","webm","ogg"];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase().replace(".", "");
  const okMime = imageMimes.includes(file.mimetype) || videoMimes.includes(file.mimetype);
  const okExt = allowedImageExts.includes(ext) || allowedVideoExts.includes(ext);
  if (okMime && okExt) return cb(null, true);

  return cb(new Error(
    "Unsupported file type. Allowed images: png,jpg,jpeg,webp,gif; videos: mp4,webm,ogg"
  ));
};

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 20);
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
});

function getPublicOrigin(req) {
  if (process.env.PUBLIC_ORIGIN) {
    return process.env.PUBLIC_ORIGIN.replace(/\/+$/, "");
  }
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host");
  return `${proto}://${host}`;
}

r.post("/", auth("admin"), (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ error: `Ֆայլը մեծ է։ Առավելագույնը ${MAX_UPLOAD_MB}MB է` });
        }
        return res.status(400).json({ error: err.message || "Upload failed" });
      }
      if (!req.file) return res.status(400).json({ error: "No file" });

      const field = (req.body.field || "").trim();
      if (!field) return res.status(400).json({ error: "Missing 'field' parameter" });

      const urlPath = `/file/${req.file.filename}`;
      const origin = getPublicOrigin(req);
      const fullUrl = `${origin}${urlPath}`;

      // Fields that target arrays (brands, brandInfos) must not overwrite the whole array.
      // Only persist the file URL when the field is a simple path (e.g. avatar.imageUrl, background.imageUrl).
      const isArrayField =
        field === "brands" ||
        field.startsWith("brandInfos.");

      let info = {};
      if (!isArrayField) {
        const { rows } = await pool.query(
          "SELECT information FROM admin_info WHERE admin_id=$1",
          [req.user.admin_id]
        );
        info = rows[0]?.information || {};

        const prevUrlPath = getPath(info, field);
        if (prevUrlPath) {
          const oldFilePath = safeFilePathFromUrlPath(prevUrlPath);
          if (oldFilePath && fs.existsSync(oldFilePath)) {
            try { fs.unlinkSync(oldFilePath); } catch {}
          }
        }

        setPath(info, field, urlPath);

        await pool.query(
          `INSERT INTO admin_info (admin_id, information, updated_at)
           VALUES ($1, $2, now())
           ON CONFLICT (admin_id) DO UPDATE
           SET information = EXCLUDED.information,
               updated_at  = now()`,
          [req.user.admin_id, info]
        );
      }

      // ✅ եթե avatar upload է → ջնջում ենք card icon cache-ը
      if (/avatar/i.test(field)) {
        try {
          const iconDir = path.resolve("server/public/cardIcons");
          if (fs.existsSync(iconDir)) {
            const files = fs.readdirSync(iconDir);
            for (const f of files) {
              if (f.startsWith(req.user.card_id + "-") && f.endsWith(".png")) {
                try { fs.unlinkSync(path.join(iconDir, f)); } catch {}
              }
            }
          }
        } catch (e) {
          console.log("icon cache clear error:", e.message);
        }
      }

      return res.json({
        ok: true,
        url: fullUrl,
        path: urlPath,
        field,
        mime: req.file.mimetype,
        size: req.file.size,
        information: isArrayField ? {} : info,
      });

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Upload failed" });
    }
  });
});

export default r;
