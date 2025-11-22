// client/src/components/BrandsPage.js
import React from "react";
import "./Responcive.css";
import { API } from "../api.js";

const h = React.createElement;

/* ---------- helpers ---------- */
function absLogo(u = "") {
  if (!u) return "";
  if (/^(data:|https?:\/\/|blob:)/i.test(u)) return u;
  let clean = String(u).trim().replace(/^server\//i, "");
  if (!clean.startsWith("/")) clean = "/" + clean;
  try {
    const apiUrl = new URL(API);
    return `${apiUrl.origin}${clean}`;
  } catch {
    return clean;
  }
}

/**
 * v – կարող է լինել string կամ i18n object
 * lang – գալիս է HomePage-ից որպես htmlLang: "hy","ru","en","ar","fr","kz","chn","de","es","it","fa"
 */
function pickLang(
  v,
  lang = "hy",
  fallbacks = ["am", "en", "ru", "ar", "fr", "kz", "chn", "de", "es", "it", "fa"]
) {
  if (!v) return "";
  if (typeof v === "string") return v;

  // առաջնային key-երը ըստ lang-ի
  const primary = [];
  switch (lang) {
    case "hy":
      primary.push("am", "hy");
      break;
    default:
      primary.push(lang);
      break;
  }

  const order = [
    ...primary,
    ...fallbacks.filter((x) => !primary.includes(x)),
  ];

  for (const k of order) {
    const s = v?.[k];
    if (s && String(s).trim()) return String(s).trim();
  }
  return "";
}

/* Թույլ «զում», որ սպիտակ անկյունները դուրս մնան շրջանի կտրվածքից */
const CROP_ZOOM = 1.1; // 1.08–1.12 միջակայքը OK է

/**
 * Props:
 * - brands: [{ name, href, logo, linkType, keyword }]
 * - brandsTitleColor
 * - brandsTitleText (string կամ {am,ru,en,ar,fr,kz,chn,de,es,it,fa})
 * - brandsNameColor
 * - brandsCols: 1 | 2 | 3
 * - lang: htmlLang → "hy","ru","en","ar","fr","kz","chn","de","es","it","fa"
 * - onKeywordClick(keyword) – optional
 */
export default function BrandsPage({
  brands = [],
  brandsTitleColor = "#000000",
  brandsTitleText = "ՄԵՐ ԲՐԵՆԴՆԵՐԸ",
  brandsNameColor = "#000000",
  brandsCols = 3,
  lang = "hy",
  onKeywordClick,
}) {
  if (!Array.isArray(brands) || !brands.length) return null;

  const cols = Math.max(1, Math.min(3, Number(brandsCols) || 3));
  const titleText = pickLang(brandsTitleText, lang) || "ՄԵՐ ԲՐԵՆԴՆԵՐԸ";

  /* === ONE COLUMN MODE – միայն brand-item հայլու ефեկտ === */
  if (cols === 1) {
    return h(
      "section",
      { className: "brands-public", style: { padding: "10px 12px" } },

      h(
        "h2",
        {
          className: "company-title",
          style: {
            margin: "6px 0 14px",
            color: brandsTitleColor,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 0.5,
          },
        },
        titleText
      ),

      h(
        "div",
        {
          style: {
            maxWidth: 620,
            margin: "0 auto",
          },
        },
        h(
          "div",
          {
            style: {
              display: "grid",
              gap: 10,
              maxWidth: 560,
              margin: "0 auto",
            },
          },
          ...brands.map((b, i) => {
            const name = pickLang(b?.name, lang);
            const href = (b?.href || "").trim();
            const keyword = (b?.keyword || "").trim();
            const linkType =
              b?.linkType || (keyword ? "keyword" : href ? "url" : "keyword");

            const clickable =
              (linkType === "keyword" && keyword && onKeywordClick) ||
              (linkType === "url" && href);

            const onClick = () => {
              if (linkType === "keyword" && keyword && onKeywordClick) {
                onKeywordClick(keyword);
              } else if (linkType === "url" && href) {
                window.open(href, "_blank", "noopener,noreferrer");
              }
            };

            return h(
              "div",
              {
                key: i,
                className: "brand-item",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 12px",
                  borderRadius: 16,
                  cursor: clickable ? "pointer" : "default",

                  // 👇 հայլու / glass-morphism միայն քարտի վրա
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.55)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                },
                onClick,
              },
              // ⬇️ Շրջանաձև լոգո՝ crop-ով
              h(
                "div",
                {
                  style: {
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    background: "#111",
                  },
                },
                b.logo
                  ? h("img", {
                      src: absLogo(b.logo),
                      alt: name || "brand",
                      loading: "lazy",
                      style: {
                        width: `${CROP_ZOOM * 100}%`,
                        height: `${CROP_ZOOM * 100}%`,
                        objectFit: "cover",
                        objectPosition: "50% 50%",
                        display: "block",
                      },
                    })
                  : h(
                      "span",
                      {
                        style: {
                          color: "#bbb",
                          fontWeight: 700,
                          fontSize: 16,
                        },
                      },
                      (name || "?").slice(0, 2).toUpperCase()
                    )
              ),
              h(
                "span",
                {
                  style: {
                    fontWeight: 700,
                    fontSize: 15,
                    color: brandsNameColor,
                    letterSpacing: 0.2,
                  },
                },
                name || ""
              )
            );
          })
        )
      ),

      h(
        "style",
        null,
        `.brand-item{transition:transform .15s ease, box-shadow .15s ease}
         .brand-item:hover{
           transform:translateY(-1px);
           box-shadow:0 12px 30px rgba(0,0,0,0.7);
         }`
      )
    );
  }

  /* === MULTI-COLUMN GRID === */
  return h(
    "section",
    { className: "brands-public", style: { padding: "10px 12px" } },

    h(
      "h2",
      {
        className: "company-title",
        style: {
          margin: "20px 0 40px",
          color: brandsTitleColor,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 28,
        },
      },
      titleText
    ),

    h(
      "div",
      { style: { display: "flex", justifyContent: "center" } },
      h(
        "div",
        {
          className: "brands-grid",
          style: {
            display: "grid",
            gap: 16,
            justifyContent: "center",
            gridTemplateColumns:
              cols === 2 ? "repeat(2, 120px)" : "repeat(3, 110px)",
          },
        },
        ...brands.map((b, i) => {
          const name = pickLang(b?.name, lang);
          const href = (b?.href || "").trim();
          const keyword = (b?.keyword || "").trim();
          const linkType =
            b?.linkType || (keyword ? "keyword" : href ? "url" : "keyword");

          const isKeyword =
            linkType === "keyword" && keyword && onKeywordClick;
          const isUrl = linkType === "url" && href;

          const handleClick = (e) => {
            if (isKeyword) {
              e.preventDefault();
              onKeywordClick(keyword);
            }
          };

          return h(
            "a",
            {
              key: i,
              href: isUrl ? href : "#",
              target: isUrl ? "_blank" : undefined,
              rel: isUrl ? "noopener noreferrer" : undefined,
              className: "brand-card",
              onClick: handleClick,
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                transition: "transform .18s ease",
                cursor: isKeyword || isUrl ? "pointer" : "default",
              },
            },
            h(
              "div",
              {
                style: {
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#111",
                  display: "grid",
                  placeItems: "center",
                },
              },
              b.logo
                ? h("img", {
                    src: absLogo(b.logo),
                    alt: name || "brand",
                    loading: "lazy",
                    style: {
                      width: `${CROP_ZOOM * 100}%`,
                      height: `${CROP_ZOOM * 100}%`,
                      objectFit: "cover",
                      objectPosition: "50% 50%",
                      display: "block",
                    },
                  })
                : h(
                    "span",
                    {
                      style: {
                        color: "#bbb",
                        fontWeight: 700,
                        fontSize: 18,
                      },
                    },
                    (name || "?").slice(0, 2).toUpperCase()
                  )
            ),
            h(
              "span",
              {
                style: {
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.25,
                  maxWidth: 160,
                  color: brandsNameColor,
                },
              },
              name || ""
            )
          );
        })
      )
    ),

    h(
      "style",
      null,
      `.brand-card:hover{transform:translateY(-2px)}
       @media(min-width:480px){.brands-grid{gap:18px}}`
    )
  );
}
