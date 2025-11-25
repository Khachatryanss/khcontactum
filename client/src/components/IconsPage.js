// client/src/components/IconsPage.js
import React from "react";
import "../pages/icons.layout.css";
const h = React.createElement;

/* ---------- only Font Awesome mapping (optional helpers) ---------- */
const ICON_MAP = {
  phone:"fa-solid fa-phone", sms:"fa-solid fa-comment-dots",
  whatsapp:"fa-brands fa-whatsapp", telegram:"fa-brands fa-telegram",
  viber:"fa-brands fa-viber", instagram:"fa-brands fa-instagram",
  facebook:"fa-brands fa-facebook-f", messenger:"fa-brands fa-facebook-messenger",
  email:"fa-solid fa-envelope", linkedin:"fa-brands fa-linkedin-in",
  globe:"fa-solid fa-globe", location:"fa-solid fa-location-dot",
  tiktok:"fa-brands fa-tiktok", skype:"fa-brands fa-skype",
  twitter:"fa-brands fa-twitter", x:"fa-brands fa-x-twitter",
  youtube:"fa-brands fa-youtube", snapchat:"fa-brands fa-snapchat",
  pinterest:"fa-brands fa-pinterest", reddit:"fa-brands fa-reddit-alien",
  discord:"fa-brands fa-discord", github:"fa-brands fa-github",
  spotify:"fa-brands fa-spotify", behance:"fa-brands fa-behance",
  dribbble:"fa-brands fa-dribbble", medium:"fa-brands fa-medium",
  vimeo:"fa-brands fa-vimeo-v", vk:"fa-brands fa-vk", ok:"fa-brands fa-odnoklassniki",
  wechat:"fa-brands fa-weixin", line:"fa-brands fa-line",
  signal:"fa-brands fa-signal-messenger", zoom:"fa-solid fa-video",
  wikipedia:"fa-brands fa-wikipedia-w", threads:"fa-brands fa-threads"
};

function faClassFrom(item){
  const raw = (item?.fa || item?.icon || "").trim();
  if (!raw) return "fa-solid fa-link";
  if (/\bfa-(solid|regular|brands)\b|\bfa-[a-z0-9-]+/i.test(raw)) return raw;
  const key = raw.toLowerCase();
  return ICON_MAP[key] || "fa-solid fa-link";
}

/* ---------- multi-lang label picker (11 լեզու) ---------- */
function pickLabel(label, lang = "hy"){
  if (label && typeof label === "object") {
    const primaryKeys = [];
    switch (lang) {
      case "hy":
        primaryKeys.push("am", "hy");
        break;
      case "kz":
        primaryKeys.push("kz");
        break;
      case "chn":
        primaryKeys.push("chn");
        break;

      // NEW langs — direct key usage
      case "de":
        primaryKeys.push("de");
        break;
      case "es":
        primaryKeys.push("es");
        break;
      case "it":
        primaryKeys.push("it");
        break;
      case "fa":
        primaryKeys.push("fa");
        break;

      default:
        primaryKeys.push(lang);
    }

    const fallbackOrder = [
      ...primaryKeys,
      "am", "en", "ru", "ar", "fr", "kz", "chn", "de", "es", "it", "fa"
    ];

    for (const k of fallbackOrder) {
      const v = label[k];
      if (v && String(v).trim()) {
        return String(v);
      }
    }
    return "";
  }
  return String(label || "");
}

export default function IconsPage({
  links = [],
  labelColor,
  chipColor,
  rowCardColor,
  iconColor,
  layoutStyle = "dzev1",
  cols = 4,
  glowEnabled = false,
  glowColor,
  lang = "hy"
}) {
  /* ===== dzev4 — ձեռքով պտտվող շրջան (ոչ ավտոմատ) ===== */
  const [orbitAngle, setOrbitAngle] = React.useState(0); // градусовով
  const draggingRef = React.useRef(false);
  const lastXRef = React.useRef(0);

  const getClientX = (e) => {
    if (e.touches && e.touches[0]) return e.touches[0].clientX;
    return e.clientX;
  };

  const startDrag = (e) => {
    if (layoutStyle !== "dzev4") return;
    draggingRef.current = true;
    lastXRef.current = getClientX(e);
  };

  const moveDrag = (e) => {
    if (layoutStyle !== "dzev4" || !draggingRef.current) return;
    const x = getClientX(e);
    const dx = x - lastXRef.current;
    lastXRef.current = x;
    setOrbitAngle((a) => a + dx * 0.6);
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  // rtl for ar + fa
  const rtlLangs = new Set(["ar", "fa"]);
  const labelDir   = rtlLangs.has(lang) ? "rtl" : "ltr";
  const labelAlign = rtlLangs.has(lang) ? "right" : "left";

  /* ===== ONE-COLUMN MODE ===== */
  const isOneColumnRow = layoutStyle !== "dzev4" && Number(cols) === 1;

  if (isOneColumnRow) {
    const textColor = labelColor || "#ffffff";
    const icColor   = iconColor || "#ffffff";

    return h(
      "section",
      {
        className: "icons-public-1col",
        style: { padding: "10px 12px" }
      },

      ...links.map((l = {}, i) => {
        const label = pickLabel(l.label, lang);
        const href  = l.href || "#";
        const faCls = faClassFrom(l);
        const isExternal = /^https?:\/\/|^mailto:/i.test(href);

        return h(
          "a",
          {
            key: i,
            href,
            target: isExternal ? "_blank" : undefined,
            rel:    isExternal ? "noreferrer" : undefined,
            className: "icon-row-card",
            "aria-label": label
          },
          h(
            "div",
            { className: "icon-row-circle", style:{ color: icColor } },
            h("i", { className: faCls, "aria-hidden": "true" })
          ),
          h(
            "span",
            {
              className: "icon-row-label",
              dir: labelDir,
              style: { color: textColor, textAlign: labelAlign }
            },
            label
          )
        );
      }),

      h(
        "style",
        null,
        `
        .icon-row-card{
          display:flex;
          align-items:center;
          gap:14px;
          padding:10px 12px;
          border-radius:16px;
          margin:4px 0;
          text-decoration:none;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.35);
          box-shadow:0 10px 26px rgba(0,0,0,0.55);
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
          transition:transform .15s ease, box-shadow .15s ease;
          cursor:pointer;
        }
        .icon-row-card:hover{
          transform:translateY(-1px);
          box-shadow:0 12px 30px rgba(0,0,0,0.7);
        }
        .icon-row-circle{
          width:60px;
          height:60px;
          border-radius:50%;
          overflow:hidden;
          display:grid;
          place-items:center;
          flex-shrink:0;
          background:#111;
        }
        .icon-row-circle i{
          font-size:22px;
        }
        .icon-row-label{
          font-weight:700;
          font-size:15px;
          letter-spacing:.2px;
        }
      `
      )
    );
  }

  /* ===== container class/style (մնացած layout-ների համար) ===== */
  let containerClass =
    layoutStyle === "dzev2" ? "icons-dzev2" :
    layoutStyle === "dzev3" ? "icons-dzev3" :
    layoutStyle === "dzev4" ? "icons-dzev4" :
                              "grid";

  containerClass += " icons-nowrap";
  if (layoutStyle !== "dzev4" && Number(cols) === 1) containerClass += " icons-cols-1";
  if (glowEnabled) containerClass += " icons-glow-on";

  const containerStyle = {};
  if (layoutStyle !== "dzev4") {
    containerStyle["--icons-cols"] = String(cols);
  }
  if (glowColor)  containerStyle["--icons-glow-color"]  = glowColor;
  if (chipColor)  containerStyle["--icons-chip-bg"]     = chipColor;
  if (labelColor) containerStyle["--icons-label-color"] = labelColor;
  if (iconColor)  containerStyle["--icons-icon-color"]  = iconColor;

  if (layoutStyle !== "dzev4" && Number(cols) === 1) {
    const cardBg = rowCardColor || chipColor;
    if (cardBg) containerStyle["--icons-card-bg"] = cardBg;
    containerStyle["--icons-card-border"] =
      "color-mix(in oklab, var(--icons-card-bg, #fff), #000 8%)";
  }

  if (layoutStyle === "dzev4") {
    containerStyle.touchAction = "pan-y";
    containerStyle.cursor = "grab";
  }

  const total = links.length || 1;

  const sectionProps = {
    className: containerClass,
    style: containerStyle
  };

  if (layoutStyle === "dzev4") {
    sectionProps.onMouseDown  = startDrag;
    sectionProps.onMouseMove  = moveDrag;
    sectionProps.onMouseUp    = endDrag;
    sectionProps.onMouseLeave = endDrag;
    sectionProps.onTouchStart = startDrag;
    sectionProps.onTouchMove  = moveDrag;
    sectionProps.onTouchEnd   = endDrag;
  }

  return h(
    "section",
    sectionProps,
    ...links.map((l = {}, i) => {
      const label = pickLabel(l.label, lang);
      const href  = l.href || "#";
      const faCls = faClassFrom(l);
      const isExternal = /^https?:\/\/|^mailto:/i.test(href);

      const aClass = [];
      if (layoutStyle === "dzev1") aClass.push("grid-item");
      if (layoutStyle === "dzev4") aClass.push("icon-wrap");

      const aProps = {
        key: i,
        className: aClass.join(" ") || undefined,
        href,
        "aria-label": label,
        target: isExternal ? "_blank" : undefined,
        rel:    isExternal ? "noreferrer" : undefined
      };

      if (layoutStyle === "dzev4") {
        const base   = (360 / total) * i;
        const angle  = orbitAngle + base;
        aProps.style = { "--angle": `${angle}deg` };
      }

      const inner =
        layoutStyle === "dzev3"
          ? [
              h("span", { key: "diamond",   className: "diamond" }),
              h("span", { key: "tint",      className: "tint" }),
              h("span", { key: "tintMul",   className: "tint-multiply" }),
              h("span", { key: "shine",     className: "shine" }),
              h("i",    { key: "icon",      className: faCls, "aria-hidden": "true" })
            ]
          : h("i", { className: faCls, "aria-hidden": "true" });

      return h(
        "a",
        aProps,
        h("div", { className: "icon-btn" }, inner),
        layoutStyle !== "dzev4" &&
          h(
            "span",
            {
              className: "label",
              dir: labelDir,
              style: { textAlign: labelAlign }
            },
            label
          )
      );
    }),

    h(
      "style",
      null,
      `
      .icon-btn i{
        color: var(--icons-icon-color, #fff);
      }
      `
    )
  );
}
