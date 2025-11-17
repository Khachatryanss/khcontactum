// client/src/components/SharePage.js
import React from "react";
import "./Responcive.css";

// png icon-ներ
import fbIcon    from "../img/face.png";
import tgIcon    from "../img/tele.png";
import lnIcon    from "../img/linkdin.png";
import waIcon    from "../img/wp.png";
import mailIcon  from "../img/email.png";
import viberIcon from "../img/vb.png";
import igIcon    from "../img/insta.png";

const h = React.createElement;

/* ===== base domain for online links ===== */
const PUBLIC_BASE = "https://khcontactum.com/";

/* ===== helpers ===== */
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

/** normalize public link → միշտ https://khcontactum.com/... */
function ensureAbsoluteUrl(u) {
  const raw = (u || "").toString().trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.replace(/^https?:\/\/[^/]+\//i, "").replace(/^\/+/, "");
  return PUBLIC_BASE + path;
}

/* ===== i18n text ===== */
const TEXT = {
  am: {
    qrTitle: "Share / QR",
    qrDesc: "QR կոդով և share հղումով կարող եք կիսվել ձեր քարտով։",

    scanBtn: "Սկանավորել QR կոդը",
    shareTitle: "Կիսվել իմ քարտով",
    addBtn: "ԱՎԵԼԱՑՐԵՔ ԻՆՁ ԿՈՆՏԱԿՏՆԵՐԻ ՑԱՆԿՈՒՄ",
    qrOnline: "ONLINE QR-CODE",
    qrOffline: "OFFLINE QR-CODE",
    offlineNote: "Սկանելուց հետո կարող եք պահպանել կոնտակտների մեջ։",
    shareDefault: "Դիտիր իմ KHContactum.com թվային քարտը։",
    mailSubject: "KHContactum թվային քարտ",
  },
  ru: {
    qrTitle: "Share / QR",
    qrDesc:
      "Вы можете делиться своей карточкой через QR-код и ссылку для шаринга.",

    scanBtn: "СКАНИРОВАТЬ QR-КОД",
    shareTitle: "ПОДЕЛИТЬСЯ МОЕЙ ВИЗИТКОЙ",
    addBtn: "ДОБАВИТЬ В КОНТАКТЫ",
    qrOnline: "ОНЛАЙН QR-КОД",
    qrOffline: "ОФЛАЙН QR-КОД",
    offlineNote: "После сканирования можно сохранить в контактах.",
    shareDefault: "Посмотри мою цифровую карточку KHContactum.com.",
    mailSubject: "Цифровая визитка KHContactum",
  },
  en: {
    qrTitle: "Share / QR",
    qrDesc: "You can share your card via QR code and a share link.",

    scanBtn: "SCAN QR CODE",
    shareTitle: "SHARE MY CARD",
    addBtn: "ADD ME TO THE CONTACT LIST",
    qrOnline: "ONLINE QR-CODE",
    qrOffline: "OFFLINE QR-CODE",
    offlineNote: "After scanning you can save it to your contacts.",
    shareDefault: "Check out my KHContactum.com digital card.",
    mailSubject: "KHContactum digital card",
  },
  ar: {
    qrTitle: "Share / QR",
    qrDesc: "يمكنك مشاركة بطاقتك عبر رمز QR ورابط المشاركة.",

    scanBtn: "مسح رمز QR",
    shareTitle: "مشاركة بطاقتي",
    addBtn: "إضافتي إلى قائمة جهات الاتصال",
    qrOnline: "رمز QR أونلاين · الرابط",
    qrOffline: "رمز QR أوفلاين",
    offlineNote: "بعد المسح يمكنك حفظه في جهات الاتصال.",
    shareDefault: "اطّلع على بطاقتي الرقمية على KHContactum.com.",
    mailSubject: "بطاقة KHContactum الرقمية",
  },
  fr: {
    qrTitle: "Share / QR",
    qrDesc:
      "Vous pouvez partager votre carte via un code QR et un lien de partage.",

    scanBtn: "SCANNER LE QR CODE",
    shareTitle: "PARTAGER MA CARTE",
    addBtn: "M’AJOUTER À LA LISTE DE CONTACTS",
    qrOnline: "QR-CODE EN LIGNE",
    qrOffline: "QR-CODE HORS LIGNE",
    offlineNote: "Après le scan vous pouvez l’enregistrer dans vos contacts.",
    shareDefault: "Découvrez ma carte numérique KHContactum.com.",
    mailSubject: "Carte numérique KHContactum",
  },
};

const DEFAULT_QUICK = {
  fb: true,
  tg: true,
  ln: true,
  wa: true,
  mail: false,
  viber: false,
  ig: false,
};

function normalizeShare(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const normalizedOnlineUrl = ensureAbsoluteUrl(s.onlineUrl || "");

  return {
    onlineUrl: normalizedOnlineUrl,
    offlineFullName: (s.offlineFullName || "").toString().trim(),
    offlinePhone: (s.offlinePhone || "").toString().trim(),
    quick: Object.assign({}, DEFAULT_QUICK, s.quick || {}),
    shareText: s.shareText || "",
    styles: {
      btnTextColor: (s.styles && s.styles.btnTextColor) || "#ffffff",
      btnBgColor:   (s.styles && s.styles.btnBgColor)   || "#000000",
      shareTitleColor:
        (s.styles && s.styles.shareTitleColor) || "#000000",
    },
  };
}

/* default link – fallback */
function defaultOnlineUrl(cardId) {
  if (typeof window !== "undefined" && window.location?.href) {
    return ensureAbsoluteUrl(window.location.href);
  }
  return ensureAbsoluteUrl((cardId && String(cardId)) || "");
}

/* ---------- contact meta helpers ---------- */

function normalizePhone(p) {
  return (p || "").toString().replace(/[^\d+]/g, "");
}

/** kind → գեղեցիկ label կոնտակտի մեջ */
const ICON_KIND_LABELS = {
  telegram: "Telegram",
  tg: "Telegram",
  whatsapp: "WhatsApp",
  wa: "WhatsApp",
  viber: "Viber",
  fb: "Facebook",
  facebook: "Facebook",
  insta: "Instagram",
  instagram: "Instagram",
  ig: "Instagram",
  linkedin: "LinkedIn",
  ln: "LinkedIn",
  site: "Website",
  website: "Website",
  web: "Website",
  globe: "Website",
  mail: "Mail",
  email: "Mail",
  messenger: "Messenger",
  location: "Location",
  maps: "Location",
  digital: "Digital profile",
  profile: "Profile",
};

/** URL-ից label գուշակող helper՝ fallback-ի համար */
function guessLabelFromUrl(u) {
  const s = (u || "").toString().toLowerCase();
  if (!s) return "";
  if (s.includes("t.me")) return "Telegram";
  if (s.includes("wa.me") || s.includes("whatsapp")) return "WhatsApp";
  if (s.includes("viber")) return "Viber";
  if (s.includes("linkedin.")) return "LinkedIn";
  if (s.includes("instagram.")) return "Instagram";
  if (s.includes("facebook.") || s.includes("fb.")) return "Facebook";
  if (s.includes("maps.google.") || s.includes("goo.gl/maps"))
    return "Location";
  if (s.includes("youtube.") || s.includes("youtu.be")) return "YouTube";
  if (s.includes("tiktok.")) return "TikTok";
  if (s.includes("khcontactum.com")) return "KHContactum Digital Card";
  return "";
}

/**
 * Կոնտակտի meta՝
 *   urls   → միայն
 *     - KHContactum Digital Card (onlineUrl)
 *     - icon-ներից եկած linker (միայն օգտագործված icon-ներ, առանց email)
 */
function collectContactMeta(info, offlinePhone, lang, onlineUrl) {
  const meta = { urls: [] };
  const seenUrls = new Set();
  if (!info && !onlineUrl) return meta;

  const normOffline = normalizePhone(offlinePhone);

  function normalizeUrl(u) {
    let s = (u || "").toString().trim();
    if (!s) return "";
    if (
      !/^https?:\/\//i.test(s) &&
      !/^(tel|sms|viber|whatsapp|wa):/i.test(s)
    ) {
      s = "https://" + s.replace(/^https?:\/\/[^/]+\//i, "");
    }
    return s;
  }

  function addUrl(url, label) {
    const norm = normalizeUrl(url);
    if (!norm) return;
    if (seenUrls.has(norm)) return;
    seenUrls.add(norm);

    const lab = (label || "link").toString().trim() || "link";
    meta.urls.push({ label: lab, url: norm });
  }

  // 0) KHContactum Digital Card՝ առաջին URL-ը
  if (onlineUrl) {
    addUrl(onlineUrl, "KHContactum Digital Card");
  }

  /* ---- 1) icons / iconRows → միայն դրանցից URL-ներ ---- */

  let icons = [];
  if (info) {
    if (Array.isArray(info.icons)) {
      icons = info.icons;
    } else if (Array.isArray(info.iconRows)) {
      icons = info.iconRows.flatMap((row) =>
        Array.isArray(row?.items) ? row.items : row ? [row] : []
      );
    }
  }

  for (const item of icons) {
    if (!item) continue;
    if (item.enabled === false || item.hidden === true) continue;

    const kindRaw =
      (item.kind || item.type || item.icon || "").toString();
    const kind = kindRaw.toLowerCase();

    let value =
      item.href ||
      item.url ||
      item.link ||
      item.value ||
      item.phone ||
      item.text ||
      "";
    if (!value) continue;
    value = String(value).trim();

    // phone icon – skip, եթե նույնն է offline phone-ի հետ
    if (kind === "phone" || kind === "tel") {
      const vNorm = normalizePhone(value.replace(/^tel:/i, ""));
      if (normOffline && vNorm === normOffline) continue;
    }

    // email icon – լիովին skip, որ vCard-ի մեջ չընկնի
    if (
      kind === "email" ||
      /^mailto:/i.test(value) ||
      (!value.startsWith("http") && value.includes("@"))
    ) {
      continue;
    }

    let label =
      pickLang(item.label, lang) ||
      item.name ||
      item.title ||
      ICON_KIND_LABELS[kind] ||
      ICON_KIND_LABELS[kindRaw.toLowerCase()] ||
      "";

    if (!label || label.toLowerCase() === "link") {
      const g = guessLabelFromUrl(value);
      if (g) label = g;
    }
    if (!label) label = "link";

    addUrl(value, label);
  }

  return meta;
}

/* CRLF պահանջված է iOS/Outlook-ի համար */
function buildVCard(name, phone, contactMeta) {
  const safeName = (name || "").trim() || "KHContactum";
  const safePhone = (phone || "").trim();
  const meta = contactMeta || {};
  const urls = Array.isArray(meta.urls) ? meta.urls : [];

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:" + safeName + ";;;;",
    "FN:" + safeName,
  ];

  if (safePhone) {
    lines.push(
      "TEL;TYPE=CELL,VOICE;TYPE=pref:" +
        safePhone.replace(/\s+/g, "")
    );
  }

  // միայն URL-ներ՝ KHContactum Digital Card + icon-ների linker
  let idx = 1;
  for (const u of urls) {
    if (!u || !u.url) continue;
    const url = String(u.url).trim();
    if (!url) continue;
    const label = (u.label || "link").toString().trim() || "link";

    lines.push(`item${idx}.URL;type=pref:${url}`);
    lines.push(`item${idx}.X-ABLabel:${label}`);
    idx++;
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/** icon meta՝ png-ներով */
const SHARE_ICON_META = {
  fb:   { label: "Facebook",  img: fbIcon },
  tg:   { label: "Telegram",  img: tgIcon },
  ln:   { label: "LinkedIn",  img: lnIcon },
  wa:   { label: "WhatsApp",  img: waIcon },
  mail: { label: "Email",     img: mailIcon },
  viber:{ label: "Viber",     img: viberIcon },
  ig:   { label: "Instagram", img: igIcon },
};

function buildShareUrl(kind, url, text, mailSubject) {
  const msg = (text ? text + " " : "") + url;
  const encUrl  = encodeURIComponent(url);
  const encText = encodeURIComponent(text || "");
  const encBoth = encodeURIComponent(msg);

  switch (kind) {
    case "fb":
      return "https://www.facebook.com/sharer/sharer.php?u=" + encUrl;
    case "tg":
      return "https://t.me/share/url?url=" + encUrl + "&text=" + encText;
    case "ln":
      return "https://www.linkedin.com/sharing/share-offsite/?url=" + encUrl;
    case "wa":
      return "https://wa.me/?text=" + encBoth;
    case "mail":
      return (
        "mailto:?subject=" +
        encodeURIComponent(mailSubject || "KHContactum digital card") +
        "&body=" +
        encBoth
      );
    case "viber":
      return "viber://forward?text=" + encBoth;
    case "ig":
      return url;
    default:
      return url;
  }
}

/** icon button (png) */
function ShareIcon({ kind, onClick }) {
  const meta = SHARE_ICON_META[kind];
  if (!meta) return null;

  return h(
    "button",
    {
      type: "button",
      className: "share-icon-btn share-icon-" + kind,
      onClick,
      title: meta.label,
      style: {
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
      },
    },
    h("img", {
      src: meta.img,
      alt: meta.label,
      loading: "lazy",
      style: { width: 36, height: 36, display: "block" },
    })
  );
}

/* ========= vCard saver ========= */
async function saveVCardUniversal({
  name,
  phone,
  contactMeta,
  fileName = "contact.vcf",
}) {
  const vcard = buildVCard(name, phone, contactMeta);
  const blob = new Blob([vcard], { type: "text/x-vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
    return;
  } catch (_) {
    try {
      const encoded = encodeURIComponent(vcard);
      const dataUrl = "data:text/x-vcard;charset=utf-8," + encoded;
      window.open(dataUrl, "_blank", "noopener,noreferrer");
    } catch (_) {}
  }
}

/**
 * lang-ը կարող ես փոխանցել HomePage-ից.
 */
export default function SharePage({ info, cardId, lang }) {
  const share = normalizeShare(info && info.share);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrMode, setQrMode] = React.useState("online");

  const activeLang =
    lang ||
    (typeof window !== "undefined"
      ? localStorage.getItem("lang") || "am"
      : "am");

  const t = TEXT[activeLang] || TEXT.am;

  const onlineUrl = ensureAbsoluteUrl(
    share.onlineUrl || defaultOnlineUrl(cardId)
  );

  const offlineName = share.offlineFullName || info?.company?.name?.en || "";
  const offlinePhone = share.offlinePhone || "";

  // KHContactum Digital Card + icon links
  const contactMeta = React.useMemo(
    () => collectContactMeta(info, offlinePhone, activeLang, onlineUrl),
    [info, offlinePhone, activeLang, onlineUrl]
  );

  const shareText = (() => {
    const raw = share.shareText;
    if (raw && typeof raw === "object") {
      const s = pickLang(raw, activeLang);
      if (s) return s;
    } else {
      const s = String(raw || "").trim();
      if (s) return s;
    }
    return t.shareDefault;
  })();

  const btnTextColor    = share.styles.btnTextColor    || "#ffffff";
  const btnBgColor      = share.styles.btnBgColor      || "#000000";
  const shareTitleColor = share.styles.shareTitleColor || "#000000";

  const quick = share.quick || DEFAULT_QUICK;
  const enabledKinds = Object.keys(quick).filter((k) => quick[k]);

  function onShare(kind) {
    const url =
      onlineUrl ||
      (typeof window !== "undefined"
        ? ensureAbsoluteUrl(window.location.href)
        : "");
    if (!url) return;

    if (kind === "ig" && typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: "KHContactum", text: shareText, url })
        .catch(() => {});
      return;
    }

    const href = buildShareUrl(kind, url, shareText, t.mailSubject);

    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function currentQrValue() {
    if (qrMode === "offline")
      return buildVCard(offlineName, offlinePhone, contactMeta);
    return onlineUrl;
  }

  async function downloadVCard() {
    await saveVCardUniversal({
      name: offlineName,
      phone: offlinePhone,
      contactMeta,
      fileName:
        (offlineName || "contact").replace(/[^\w\-]+/g, "_") + ".vcf",
    });
  }

  const qrValue   = currentQrValue();
  const encodedQr = encodeURIComponent(qrValue);
  const qrImgSrc  =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodedQr;

  // ✅ label – ակտիվի վերջում checkmark
  const onlineLabel  = qrMode === "online"  ? `${t.qrOnline} ✅`  : t.qrOnline;
  const offlineLabel = qrMode === "offline" ? `${t.qrOffline} ✅` : t.qrOffline;

  return h(
    "section",
    { style: { marginTop: 24, marginBottom: 44, textAlign: "center" } },

    h("h2", { style: { marginBottom: 4 } }, t.qrTitle),
    h(
      "p",
      {
        className: "small",
        style: { marginBottom: 16, maxWidth: 360, marginInline: "auto" },
      },
      t.qrDesc
    ),

    h(
      "button",
      {
        type: "button",
        className: "btn",
        style: {
          width: "80%",
          maxWidth: 360,
          margin: "0 auto 18px",
          background: btnBgColor,
          color: btnTextColor,
        },
        onClick: () => setQrOpen(true),
      },
      t.scanBtn
    ),

    h(
      "h3",
      { style: { margin: "0 0 10px", fontSize: 16, color: shareTitleColor } },
      t.shareTitle
    ),

    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "center",
          gap: 14,
          marginBottom: 20,
          flexWrap: "wrap",
        },
      },
      enabledKinds.map((kind) =>
        h(ShareIcon, { key: kind, kind, onClick: () => onShare(kind) })
      )
    ),

    h(
      "button",
      {
        type: "button",
        className: "btn",
        style: {
          width: "80%",
          maxWidth: 360,
          margin: "0 auto",
          background: btnBgColor,
          color: btnTextColor,
        },
        onClick: downloadVCard,
      },
      t.addBtn
    ),

    qrOpen &&
      h(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
            display: "grid",
            placeItems: "center",
          },
          onClick: () => setQrOpen(false),
        },
        h(
          "div",
          {
            className: "card",
            style: {
              position: "relative",
              maxWidth: 360,
              width: "90%",
              padding: 16,
              textAlign: "center",
            },
            onClick: (e) => e.stopPropagation(),
          },

          h(
            "button",
            {
              type: "button",
              onClick: () => setQrOpen(false),
              style: {
                position: "absolute",
                right: 8,
                top: 6,
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
              },
            },
            "×"
          ),

          // ONLINE / OFFLINE toggle buttons
          h(
            "div",
            { style: { display: "flex", gap: 8, marginBottom: 12 } },
            h(
              "button",
              {
                type: "button",
                className: "btn",
                style: {
                  flex: 1,
                  // Active → white bg, black text; Inactive → black bg, white text
                  background: qrMode === "online" ? "#ffffff" : "#000000",
                  color: qrMode === "online" ? "#000000" : "#ffffff",
                },
                onClick: () => setQrMode("online"),
              },
              onlineLabel
            ),
            h(
              "button",
              {
                type: "button",
                className: "btn",
                style: {
                  flex: 1,
                  background: qrMode === "offline" ? "#ffffff" : "#000000",
                  color: qrMode === "offline" ? "#000000" : "#ffffff",
                },
                onClick: () => setQrMode("offline"),
              },
              offlineLabel
            )
          ),

          h("img", {
            src: qrImgSrc,
            alt: "QR code ",
            loading: "lazy",
            style: { width: 260, height: 260, margin: "0 auto 8px" },
          }),

          qrMode === "offline" &&
            h(
              "div",
              { className: "small", style: { marginTop: 4 } },
              t.offlineNote
            )
        )
      )
  );
}
