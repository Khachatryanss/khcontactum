// server/src/routes/superadmin.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const r = Router();

/* ============================================================
   LOGIN PROTECTION for SUPERADMIN
   3 րոպեում 7 սխալ փորձ → 30 րոպե lock ըստ IP
   + 2-րդ գաղտնի կոդ (OTP) env-ից
   ============================================================ */

const MAX_FAILS      = 7;
const WINDOW_MINUTES = 3;
const LOCK_MINUTES   = 30;
const superAttempts  = new Map(); // key: ip => { fails, first, lockUntil }

function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string" && xfwd.length > 0) {
    return xfwd.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
}

function getRecord(ip) {
  const now = Date.now();
  let rec = superAttempts.get(ip);
  if (!rec) {
    rec = { fails: 0, first: now, lockUntil: 0 };
    superAttempts.set(ip, rec);
    return rec;
  }
  if (now - rec.first > WINDOW_MINUTES * 60 * 1000) {
    rec.fails = 0;
    rec.first = now;
    rec.lockUntil = 0;
  }
  return rec;
}

function isLocked(rec) {
  return rec.lockUntil && rec.lockUntil > Date.now();
}

/* --- Superadmin Login (env-ից է, ոչ DB-ից) --- */
r.post("/login", async (req, res) => {
  const ip  = getClientIp(req);
  const rec = getRecord(ip);

  if (isLocked(rec)) {
    const leftMin = Math.ceil((rec.lockUntil - Date.now()) / 60000);
    return res.status(429).json({
      error: `Շատ սխալ մուտքի փորձեր այս IP-ից։ Փորձիր ${leftMin} րոպե հետո։`,
    });
  }

  const { username, password, otp } = req.body || {};
  const envUser = process.env.SUPERADMIN_USERNAME || "superadmin";
  const envHash = process.env.SUPERADMIN_PASS_HASH || "";
  const envOtp  = process.env.SUPERADMIN_OTP_CODE || "";

  if (!username || !password || !otp) {
    return res
      .status(400)
      .json({ error: "username, password և otp դաշտերը պարտադիր են" });
  }

  try {
    if (username !== envUser) {
      rec.fails++;
    } else {
      const okPass = await bcrypt.compare(password || "", envHash || "");
      const okOtp  = otp === envOtp;

      if (!okPass || !okOtp) {
        rec.fails++;
      } else {
        // ✅ հաջող login
        rec.fails = 0;
        rec.lockUntil = 0;

        const token = jwt.sign(
          { role: "superadmin" },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        superAttempts.set(ip, rec);
        return res.json({ token });
      }
    }

    if (rec.fails >= MAX_FAILS) {
      rec.lockUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
    }
    superAttempts.set(ip, rec);

    return res.status(401).json({ error: "Bad creds or invalid OTP" });
  } catch (e) {
    console.error("Superadmin login error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

/* --- Admins CRUD (միայն superadmin) --- */
r.get("/admins", auth("superadmin"), async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, username, card_id, is_active, created_at, updated_at FROM admins ORDER BY id DESC"
  );
  res.json(rows);
});

r.post("/admins", auth("superadmin"), async (req, res) => {
  const { username, password, card_id } = req.body || {};
  if (!username || !password || card_id === undefined)
    return res
      .status(400)
      .json({ error: "username, password, card_id required" });

  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      `INSERT INTO admins (username, password_hash, card_id)
       VALUES ($1,$2,$3)
       RETURNING id, username, card_id, is_active, created_at, updated_at`,
      [username, hash, Number(card_id)]
    );
    const admin = rows[0];

    await pool.query(
      `INSERT INTO admin_profiles (admin_id, display_name, headline, bio, contacts)
       VALUES ($1,'','','','{}'::jsonb)
       ON CONFLICT (admin_id) DO NOTHING`,
      [admin.id]
    );

    res.status(201).json(admin);
  } catch (e) {
    if (e.code === "23505")
      return res.status(409).json({ error: "username exists" });
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

r.patch("/admins/:id", auth("superadmin"), async (req, res) => {
  const id = Number(req.params.id);
  const { password, card_id, is_active, username } = req.body || {};

  const sets = [];
  const vals = [];
  let i = 1;

  if (password) {
    sets.push(`password_hash=$${i++}`);
    vals.push(await bcrypt.hash(password, 10));
  }

  if (card_id !== undefined) {
    sets.push(`card_id=$${i++}`);
    vals.push(Number(card_id));
  }

  if (is_active !== undefined) {
    sets.push(`is_active=$${i++}`);
    vals.push(Boolean(is_active));
  }

  if (username !== undefined) {
    sets.push(`username=$${i++}`);
    vals.push(username);
  }

  if (!sets.length)
    return res.status(400).json({ error: "Nothing to update" });

  vals.push(id);

  try {
    const { rows } = await pool.query(
      `UPDATE admins SET ${sets.join(", ")} WHERE id=$${i}
       RETURNING id, username, card_id, is_active, created_at, updated_at`,
      vals
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(409)
        .json({ error: "username or card_id already exists" });
    }
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

r.delete("/admins/:id", auth("superadmin"), async (req, res) => {
  const id = Number(req.params.id);
  await pool.query("DELETE FROM admins WHERE id=$1", [id]);
  res.json({ ok: true });
});

/* --- Clone card data FROM one card_id TO another (միայն superadmin) --- */
r.post("/clone-card", auth("superadmin"), async (req, res) => {
  try {
    const { from_card_id, to_card_id } = req.body || {};

    if (from_card_id === undefined || to_card_id === undefined) {
      return res
        .status(400)
        .json({ error: "from_card_id և to_card_id դաշտերը պարտադիր են" });
    }

    const fromIdNum = Number(from_card_id);
    const toIdNum   = Number(to_card_id);

    if (!Number.isFinite(fromIdNum) || !Number.isFinite(toIdNum)) {
      return res
        .status(400)
        .json({ error: "card_id-ները պետք է լինեն թվեր" });
    }

    if (fromIdNum === toIdNum) {
      return res
        .status(400)
        .json({ error: "from_card_id և to_card_id արժեքները պետք է տարբեր լինեն" });
    }

    // գտնում ենք admins աղյուսակում
    const { rows: srcRows } = await pool.query(
      "SELECT id FROM admins WHERE card_id = $1",
      [fromIdNum]
    );
    const { rows: dstRows } = await pool.query(
      "SELECT id FROM admins WHERE card_id = $1",
      [toIdNum]
    );

    if (!srcRows[0]) {
      return res.status(404).json({ error: "from_card_id-ով admin չի գտնվել" });
    }
    if (!dstRows[0]) {
      return res.status(404).json({ error: "to_card_id-ով admin չի գտնվել" });
    }

    const srcAdminId = srcRows[0].id;
    const dstAdminId = dstRows[0].id;

    // մեկ transaction-ի մեջ
    await pool.query("BEGIN");

    // 1) admin_profiles-ի clone
    await pool.query(
      `INSERT INTO admin_profiles (admin_id, display_name, headline, bio, contacts)
       SELECT $2, display_name, headline, bio, contacts
       FROM admin_profiles
       WHERE admin_id = $1
       ON CONFLICT (admin_id) DO UPDATE
       SET display_name = EXCLUDED.display_name,
           headline     = EXCLUDED.headline,
           bio          = EXCLUDED.bio,
           contacts     = EXCLUDED.contacts`,
      [srcAdminId, dstAdminId]
    );

    // 2) admin_info-ի clone (card-ի հիմնական JSON կոնտենտը)
    await pool.query(
      `INSERT INTO admin_info (admin_id, info)
       SELECT $2, info
       FROM admin_info
       WHERE admin_id = $1
       ON CONFLICT (admin_id) DO UPDATE
       SET info = EXCLUDED.info`,
      [srcAdminId, dstAdminId]
    );

    // եթե հետո icons/brands-ը հատուկ table-ներով են, կարող ես այստեղ էլ ավելացնել նման INSERT ... SELECT-եր

    await pool.query("COMMIT");

    return res.json({
      ok: true,
      message: `Card ${fromIdNum}-ի տվյալները կլոնավորվեցին card ${toIdNum}-ի վրա`,
    });
  } catch (e) {
    console.error("clone-card error:", e);
    try {
      await pool.query("ROLLBACK");
    } catch (_) {}
    return res.status(500).json({ error: "Clone server error" });
  }
});

export default r;
