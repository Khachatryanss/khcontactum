// client/src/pages/PublicPage.js
import React from "react";
import { Helmet } from "react-helmet";
import PhoneShell from "../PhoneShell.js";
import HomePage from "../components/HomePage.js";
import { API, getPublicInfoByCardId } from "../api.js";

const h = React.createElement;

function pickBestText(values = []) {
  for (const v of values) {
    const s = (v || "").toString().trim();
    if (s) return s;
  }
  return "";
}

function pickLangText(v) {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
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
  for (const key of order) {
    const s = (v?.[key] || "").toString().trim();
    if (s) return s;
  }
  return "";
}

function buildPublicMeta(info, fallbackTitle = "KHContactum") {
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

  const title = pickBestText([
    companyName && headline ? `${companyName} ${headline}` : "",
    companyName,
    displayName && headline ? `${displayName} ${headline}` : "",
    displayName,
    headline,
    fallbackTitle,
  ]);

  const description = pickBestText([
    pickLangText(info?.description),
    pickLangText(info?.profile?.about),
    headline,
    `${title} | KHContactum`,
  ]);

  return { title, description };
}

export default function PublicPage({ cardId }) {
  const [meta, setMeta] = React.useState({
    title: "KHContactum",
    description:
      "Khachatryans Holding CJSC թվային այցեքարտ․ մեկ հարթակում՝ բոլոր կապի ուղիները, սոցիալական ցանցերն ու կայքը։",
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await getPublicInfoByCardId(cardId);
        const info = r?.data || r?.information || {};
        const next = buildPublicMeta(info, "KHContactum");
        if (!cancelled) setMeta(next);
      } catch {
        if (!cancelled) {
          setMeta((prev) => ({ ...prev, title: prev.title || "KHContactum" }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = meta.title || "KHContactum";
  }, [meta.title]);

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://your-domain.com/${cardId || ""}`;
  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}/`
      : "https://your-domain.com/";
  const manifestHref = `${API}/api/public/manifest/${encodeURIComponent(cardId)}`;
  const canonicalHref = `${siteUrl.replace(/\/$/, "")}/${cardId}`;
  const ogImage = `${siteUrl}og-card-default.jpg`;
  const touchIcon = `${siteUrl}icon-512.png`;

  const title = meta.title || "KHContactum";
  const description = meta.description || "KHContactum Digital Card";

  React.useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const manifestEl = document.getElementById("app-manifest");
    if (!manifestEl) return undefined;
    const prevHref = manifestEl.getAttribute("href") || "/manifest.json";
    const prevCross = manifestEl.getAttribute("crossorigin");
    manifestEl.setAttribute("href", manifestHref);
    manifestEl.setAttribute("crossorigin", "anonymous");
    return () => {
      manifestEl.setAttribute("href", prevHref || "/manifest.json");
      if (prevCross) manifestEl.setAttribute("crossorigin", prevCross);
      else manifestEl.removeAttribute("crossorigin");
    };
  }, [manifestHref]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const path = `/${cardId}`;
      localStorage.setItem("kh_last_public_card_path", path);
      localStorage.setItem("kh_last_public_card_ts", String(Date.now()));
    } catch {}
  }, [cardId]);

  return h(
    React.Fragment,
    null,

    h(
      Helmet,
      null,
      // հիմնական SEO
      h("title", null, title),
      h("meta", { name: "description", content: description }),
      h("meta", {
        name: "keywords",
        content:
          "Khachatryans Holding, Holding CJSC, բիզնես, շինարարություն, տեխնոլոգիա, անշարժ գույք, digital business card, թվային այցեքարտ",
      }),
      h("meta", { name: "robots", content: "index,follow" }),

      // canonical
      h("link", { rel: "canonical", href: canonicalHref || url }),
      h("link", { rel: "apple-touch-icon", href: touchIcon }),
      h("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
      h("meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }),
      h("meta", { name: "apple-mobile-web-app-title", content: title }),
      h("meta", { name: "theme-color", content: "#000000" }),

      // Open Graph
      h("meta", { property: "og:title", content: title }),
      h("meta", { property: "og:description", content: description }),
      h("meta", { property: "og:type", content: "website" }),
      h("meta", { property: "og:url", content: url }),
      h("meta", { property: "og:image", content: ogImage }),

      // Twitter Card
      h("meta", { name: "twitter:card", content: "summary_large_image" }),
      h("meta", { name: "twitter:title", content: title }),
      h("meta", { name: "twitter:description", content: description }),
      h("meta", { name: "twitter:image", content: ogImage }),

      // Structured Data (Organization)
      h(
        "script",
        { type: "application/ld+json" },
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KHACHATRYANS HOLDING CJSC",
          url: siteUrl,
          logo: `${siteUrl}logo192.png`,
        })
      )
    ),

    h(
      PhoneShell,
      {
        title: "",
        light: true,
        hideHeader: true,
      },
      h(HomePage, { cardId, inShell: true })
    )
  );
}
