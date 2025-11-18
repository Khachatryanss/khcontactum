// client/src/components/BrandInfoPage.js
import React from "react";
import "./Responcive.css";
import { fileUrl } from "../utils/fileUrl.js";

const h = React.createElement;

/* ---------- helpers ---------- */
function pickLang(v, lang, fallbacks = ["am", "en", "ru", "ar", "fr"]) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const order = [lang, ...fallbacks.filter((x) => x !== lang)];
  for (const k of order) {
    const s = v?.[k];
    if (s && String(s).trim()) return String(s).trim();
  }
  return "";
}

function hasKeyword(itemKeyword, activeKeyword) {
  const kw = (activeKeyword || "").trim().toLowerCase();
  if (!kw) return false;
  const raw = (itemKeyword || "").toString();
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(kw);
}

/* ---------- rating helpers (localStorage) ---------- */
const RATING_STORAGE_KEY = "brand-worker-rating-v1";

function readRatingMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(RATING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeRatingMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      RATING_STORAGE_KEY,
      JSON.stringify(map || {})
    );
  } catch {}
}

function getWorkerRatingState(workerId) {
  if (!workerId) return { value: null };
  const map = readRatingMap();
  const v = map[workerId];
  if (!v || typeof v !== "object") return { value: null };
  if (v.value === "like") return { value: "like" };
  if (v.value === "dislike") return { value: "dislike" };
  return { value: null };
}

/* ---------- MAIN COMPONENT ---------- */
/**
 * Props:
 *   - info: public info
 *   - lang
 *   - activeKeyword
 */
export default function BrandInfoPage({ info, lang = "am", activeKeyword }) {
  // 🔍 Փորձում ենք workers array գտնել տարբեր field-ներից
  const workers = React.useMemo(() => {
    if (!info) return [];

    const candidates = [
      info.brandInfos,
      info.brandWorkers,
      info.workers,
      info.workerList,
      info.brandInfo, // եթե մի օր singular լինի, բայց array
    ];

    for (const c of candidates) {
      if (Array.isArray(c) && c.length) return c;
    }
    return [];
  }, [info]);

  if (!workers.length) return null;

  // keyword-ով ընտրում ենք worker, եթե չկա՝ վերցնում առաջինը
  const selected =
    workers.find((w) => hasKeyword(w.keyword, activeKeyword)) || workers[0];

  if (!selected) return null;

  const workerId = selected.id || selected.keyword || "worker";

  // ---- i18n դաշտեր ----
  const workerName =
    pickLang(selected.name, lang) ||
    pickLang(selected.title, lang) ||
    "";
  const workerBio =
    pickLang(selected.bio, lang) ||
    pickLang(selected.description, lang) ||
    "";

  // ---- avatar + gallery ----
  const avatarSrc = selected.avatar ? fileUrl(selected.avatar) : "";
  const gallery = Array.isArray(selected.gallery)
    ? selected.gallery.filter(Boolean)
    : [];

  // 🎨 գույներ admin-ից
  const nameColor  = selected.nameColor  || "#ffffff";
  const bioColor   = selected.bioColor   || "#ffffff";
  const bioBgColor = selected.bioBgColor || "rgba(0,0,0,0.75)";

  // ---- rating state ----
  const [ratingValue, setRatingValue] = React.useState(
    getWorkerRatingState(workerId).value
  );

  React.useEffect(() => {
    const st = getWorkerRatingState(workerId);
    setRatingValue(st.value);
  }, [workerId]);

  const baseLikes =
    Number(selected.likeCount || selected.likes || 0) || 0;
  const baseDislikes =
    Number(selected.dislikeCount || selected.dislikes || 0) || 0;

  const likes = baseLikes + (ratingValue === "like" ? 1 : 0);
  const dislikes = baseDislikes + (ratingValue === "dislike" ? 1 : 0);

  function handleRate(next) {
    if (!workerId) return;
    if (ratingValue === next) {
      // reset
      setRatingValue(null);
      const map = readRatingMap();
      delete map[workerId];
      writeRatingMap(map);
      return;
    }
    setRatingValue(next);
    const map = readRatingMap();
    map[workerId] = { value: next };
    writeRatingMap(map);
  }

  // ---- slider ----
  const [slideIndex, setSlideIndex] = React.useState(0);

  React.useEffect(() => {
    setSlideIndex(0);
  }, [workerId]);

  const hasSlider = gallery.length > 0;
  const currentSlide = hasSlider
    ? fileUrl(gallery[Math.min(slideIndex, gallery.length - 1)])
    : "";

  function nextSlide(dir) {
    if (!hasSlider) return;
    setSlideIndex((idx) => {
      const len = gallery.length;
      if (!len) return 0;
      return (idx + dir + len) % len;
    });
  }

  // ---- UI ----
  return h(
    "section",
    {
      className: "brand-info-public",
      style: {
        marginTop: 18,
        marginBottom: 18,
        textAlign: "center",
      },
    },

    /* avatar */
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
        },
      },
      h(
        "div",
        {
          style: {
            width: 88,
            height: 88,
            borderRadius: "50%",
            padding: 4,
            background:
              "radial-gradient(circle at 30% 0,#ffffff55,#000000aa)",
            boxShadow: "0 10px 26px rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
          },
        },
        h(
          "div",
          {
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              background: "#111",
              display: "grid",
              placeItems: "center",
            },
          },
          avatarSrc
            ? h("img", {
                src: avatarSrc,
                alt: workerName || "worker",
                loading: "lazy",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              })
            : h(
                "span",
                {
                  style: {
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 28,
                  },
                },
                (workerName || "?").slice(0, 2).toUpperCase()
              )
        )
      )
    ),

    /* name pill (գույնը admin-ից) */
    workerName &&
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          },
        },
        h(
          "div",
          {
            style: {
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.45)",
              fontWeight: 600,
              fontSize: 14,
              maxWidth: 260,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              color: nameColor,
            },
          },
          workerName
        )
      ),

    /* slider */
    hasSlider &&
      h(
        "div",
        {
          style: {
            margin: "8px auto 10px",
            maxWidth: 280,
            borderRadius: 22,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 14px 30px rgba(0,0,0,0.75)",
          },
        },
        h("img", {
          src: currentSlide,
          alt: "slide",
          loading: "lazy",
          style: {
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          },
        }),
        gallery.length > 1 &&
          h(
            "button",
            {
              type: "button",
              style: {
                position: "absolute",
                left: 6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: "26px",
              },
              onClick: () => nextSlide(-1),
            },
            "<"
          ),
        gallery.length > 1 &&
          h(
            "button",
            {
              type: "button",
              style: {
                position: "absolute",
                right: 6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: "26px",
              },
              onClick: () => nextSlide(1),
            },
            ">"
          )
      ),

    /* bio block (background + text color admin-ից) */
    workerBio &&
      h(
        "div",
        {
          style: {
            marginTop: 12,
            marginInline: "auto",
            maxWidth: 280,
            borderRadius: 18,
            padding: "10px 14px",
            background: bioBgColor,
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
          },
        },
        h(
          "p",
          {
            style: {
              margin: 0,
              fontSize: 13,
              lineHeight: 1.45,
              color: bioColor,
            },
          },
          workerBio
        )
      ),

    /* rating row */
    selected.ratingEnabled !== false &&
      h(
        "div",
        {
          style: {
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          },
        },
        h(
          "span",
          {
            style: {
              fontSize: 11,
              opacity: 0.8,
            },
          },
          lang === "am"
            ? "Վարկանիշ․"
            : lang === "ru"
            ? "Рейтинг:"
            : lang === "fr"
            ? "Note :"
            : lang === "ar"
            ? "التقييم:"
            : "Rating:"
        ),
        h(
          "button",
          {
            type: "button",
            onClick: () => handleRate("like"),
            style: {
              minWidth: 64,
              padding: "4px 10px",
              borderRadius: 999,
              border:
                ratingValue === "like"
                  ? "1px solid #00c853"
                  : "1px solid rgba(255,255,255,0.25)",
              background:
                ratingValue === "like"
                  ? "rgba(0,200,83,0.18)"
                  : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            },
          },
          "👍",
          h("span", { style: { fontWeight: 600 } }, String(likes))
        ),
        h(
          "button",
          {
            type: "button",
            onClick: () => handleRate("dislike"),
            style: {
              minWidth: 64,
              padding: "4px 10px",
              borderRadius: 999,
              border:
                ratingValue === "dislike"
                  ? "1px solid #ff5252"
                  : "1px solid rgba(255,255,255,0.25)",
              background:
                ratingValue === "dislike"
                  ? "rgba(255,82,82,0.18)"
                  : "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            },
          },
          "👎",
          h("span", { style: { fontWeight: 600 } }, String(dislikes))
        )
      )
  );
}
