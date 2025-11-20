// client/src/components/SharePage.js
import React from "react";
import "./Responcive.css";

// png icon-ներ (հիմա UI-ում չենք ցույց տալիս, բայց թողնում ենք, եթե պետք գա հետագայում)
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
/**
 * v – string կամ i18n object ({am, ru, en, ar, fr, kz, chn})
 * lang – "hy","ru","en","ar","fr","kz","chn" (HomePage-ից եկող htmlLang)
 */
function pickLang(v, lang = "hy", fallbacks = ["am", "en", "ru", "ar", "fr", "kz", "chn"]) {
  if (!v) return "";
  if (typeof v === "string") return v;

  const primary = [];
  const L = (lang || "").toLowerCase();

  // Armenian mapping
  if (L === "hy" || L === "am") {
    primary.push("am", "hy");
  } else {
    primary.push(L);
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

/** normalize public link → միշտ https://khcontactum.com/... */
function ensureAbsoluteUrl(u) {
  const raw = (u || "").toString().trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.replace(/^https?:\/\/[^/]+\//i, "").replace(/^\/+/, "");
  return PUBLIC_BASE + path;
}

/* ===== i18n text (7 լեզու) ===== */
const TEXT = {
  am: {
    scanBtn: "Սկանավորել QR կոդը",
    shareTitle: "Կիսվել իմ քարտով",
    addBtn: "ԱՎԵԼԱՑՐԵՔ ԻՆՁ ԿՈՆՏԱԿՏՆԵՐԻ ՑԱՆԿՈՒՄ",
    qrOnline: "ONLINE QR-CODE",
    qrOffline: "OFFLINE QR-CODE",
    offlineNote: "Սկանելուց հետո կարող եք պահպանել կոնտակտների մեջ։",
    shareDefault: "Դիտիր իմ KHContactum.com թվային քարտը։",
    mailSubject: "KHContactum թվային քարտ",
    confirmTitle: "Ավելացնե՞լ {{name}} կոնտակտների ցանկում։",
    confirmYes: "Այո",
    confirmNo: "Ոչ",
  },
  ru: {
    scanBtn: "СКАНИРОВАТЬ QR-КОД",
    shareTitle: "ПОДЕЛИТЬСЯ МОЕЙ ВИЗИТКОЙ",
    addBtn: "ДОБАВИТЬ В КОНТАКТЫ",
    qrOnline: "ОНЛАЙН QR-КОД",
    qrOffline: "ОФЛАЙН QR-КОД",
    offlineNote: "После сканирования можно сохранить в контактах.",
    shareDefault: "Посмотри мою цифровую карточку KHContactum.com.",
    mailSubject: "Цифровая визитка KHContactum",
    confirmTitle: "Добавить {{name}} в список контактов?",
    confirmYes: "Да",
    confirmNo: "Нет",
  },
  en: {
    scanBtn: "SCAN QR CODE",
    shareTitle: "SHARE MY CARD",
    addBtn: "ADD ME TO THE CONTACT LIST",
    qrOnline: "ONLINE QR-CODE",
    qrOffline: "OFFLINE QR-CODE",
    offlineNote: "After scanning you can save it to your contacts.",
    shareDefault: "Check out my KHContactum.com digital card.",
    mailSubject: "KHContactum digital card",
    confirmTitle: "Add {{name}} to contacts list?",
    confirmYes: "Yes",
    confirmNo: "No",
  },
  ar: {
    scanBtn: "مسح رمز QR",
    shareTitle: "مشاركة بطاقتي",
    addBtn: "إضافتي إلى قائمة جهات الاتصال",
    qrOnline: "رمز QR أونلاين · الرابط",
    qrOffline: "رمز QR أوفلاين",
    offlineNote: "بعد المسح يمكنك حفظه في جهات الاتصال.",
    shareDefault: "اطّلع على بطاقتي الرقمية على KHContactum.com.",
    mailSubject: "بطاقة KHContactum الرقمية",
    confirmTitle: "إضافة {{name}} إلى قائمة جهات الاتصال؟",
    confirmYes: "نعم",
    confirmNo: "لا",
  },
  fr: {
    scanBtn: "SCANNER LE QR CODE",
    shareTitle: "PARTAGER MA CARTE",
    addBtn: "M’AJOUTER À LA LISTE DE CONTACTS",
    qrOnline: "QR-CODE EN LIGNE",
    qrOffline: "QR-CODE HORS LIGNE",
    offlineNote: "Après le scan vous pouvez l’enregistrer dans vos contacts.",
    shareDefault: "Découvrez ma carte numérique KHContactum.com.",
    mailSubject: "Carte numérique KHContactum",
    confirmTitle: "Ajouter {{name}} à la liste de contacts ?",
    confirmYes: "Oui",
    confirmNo: "Non",
  },
  kz: {
    scanBtn: "QR-КОДТЫ СКАНЕРЛЕУ",
    shareTitle: "МЕНІҢ КАРТАМДЫ БӨЛІСУ",
    addBtn: "МЕНІ БАЙЛАНЫС ТІЗІМІНЕ ҚОСУ",
    qrOnline: "ОНЛАЙН QR-КОД",
    qrOffline: "ОФФЛАЙН QR-КОД",
    offlineNote: "Сканерлегеннен кейін контактілеріңізге сақтай аласыз.",
    shareDefault: "Менің KHContactum.com цифрлық визиткамды қараңыз.",
    mailSubject: "KHContactum цифрлық визиткасы",
    confirmTitle: "«{{name}}» контактілер тізіміне қосылсын ба?",
    confirmYes: "Иә",
    confirmNo: "Жоқ",
  },
  chn: {
    scanBtn: "扫描二维码",
    shareTitle: "分享我的名片",
    addBtn: "添加到通讯录",
    qrOnline: "在线二维码",
    qrOffline: "离线二维码",
    offlineNote: "扫描后可以保存到联系人。",
    shareDefault: "查看我的 KHContactum.com 数字名片。",
    mailSubject: "KHContactum 数字名片",
    confirmTitle: "将 {{name}} 添加到联系人？",
    confirmYes: "是",
    confirmNo: "否",
  },
};

/* quick flags դեռ պահում ենք struct-ի մեջ (admin panel-ի համար) */
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
 * lang-ը կարող ես փոխանցել HomePage-ից (htmlLang → "hy","ru","en","ar","fr","kz","chn").
 * autoOpenConfirm → VisitCard հղումով մտնելու դեպքում բացի popup
 */
export default function SharePage({ info, cardId, lang, autoOpenConfirm = false }) {
  const share = normalizeShare(info && info.share);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrMode, setQrMode] = React.useState("online");
  const [confirmOpen, setConfirmOpen] = React.useState(false);   // popup state

  React.useEffect(() => {
    if (autoOpenConfirm) {
      setConfirmOpen(true);
    }
  }, [autoOpenConfirm]);

  const activeLangRaw =
    lang ||
    (typeof window !== "undefined"
      ? localStorage.getItem("lang") || "am"
      : "am");

  // Armenian htmlLang ("hy") → TEXT.am
  const textLangKey =
    activeLangRaw === "hy" ? "am" : (activeLangRaw || "am");
  const t = TEXT[textLangKey] || TEXT.am;

  const onlineUrl = ensureAbsoluteUrl(
    share.onlineUrl || defaultOnlineUrl(cardId)
  );

  // ընկերության անունը – փորձենք pickLang-ով
  const companyName =
    (info && info.company && pickLang(info.company.name, activeLangRaw)) ||
    "";

  const offlineName =
    share.offlineFullName ||
    companyName ||
    "";

  const offlinePhone = share.offlinePhone || "";

  // KHContactum Digital Card + icon links
  const contactMeta = React.useMemo(
    () => collectContactMeta(info, offlinePhone, activeLangRaw, onlineUrl),
    [info, offlinePhone, activeLangRaw, onlineUrl]
  );

  const shareText = (() => {
    const raw = share.shareText;
    if (raw && typeof raw === "object") {
      const s = pickLang(raw, activeLangRaw);
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

  // ✅ ՆՈՐ ընդհանուր share handler – navigator.share → fallback
  function onShareUniversal() {
    const url =
      onlineUrl ||
      (typeof window !== "undefined"
        ? ensureAbsoluteUrl(window.location.href)
        : "");
    if (!url) return;

    const title = offlineName || companyName || "KHContactum";

    const payload = {
      title,
      text: shareText,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(payload).catch(() => {});
      return;
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof window !== "undefined" &&
      window.isSecureContext
    ) {
      navigator.clipboard.writeText(url).catch(() => {});
      return;
    }

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
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

  const onlineLabel  = qrMode === "online"  ? `${t.qrOnline} ✅`  : t.qrOnline;
  const offlineLabel = qrMode === "offline" ? `${t.qrOffline} ✅` : t.qrOffline;

  const confirmName =
    offlineName ||
    companyName ||
    "this contact";

  const confirmText = (t.confirmTitle || "Add {{name}} to contacts list?")
    .replace("{{name}}", confirmName);

  return h(
    React.Fragment,
    null,

    h(
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

      // ======== «Կիսվել իմ քարտով» button =========
      h(
        "h3",
        { style: { margin: "0 0 10px", fontSize: 16, color: shareTitleColor } },
        t.shareTitle
      ),
      h(
        "button",
        {
          type: "button",
          className: "btn",
          style: {
            width: "80%",
            maxWidth: 360,
            margin: "0 auto 20px",
            background: btnBgColor,
            color: btnTextColor,
          },
          onClick: onShareUniversal,
        },
        t.shareTitle
      ),
      // ======== END share button =========

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

      /* ===== QR MODAL ===== */
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
    ),

    /* ===== CONTACTUM POPUP (VisitCard) – GLASS DARK ===== */
    confirmOpen &&
      h(
        "div",
        {
          className: "contactum-popup-backdrop",
          onClick: () => setConfirmOpen(false),
        },
        h(
          "div",
          {
            className: "contactum-popup",
            onClick: (e) => e.stopPropagation(),
          },
          h(
            "div",
            { className: "contactum-popup-title" },
            confirmText
          ),
          h(
            "div",
            { className: "contactum-popup-buttons" },
            h(
              "button",
              {
                type: "button",
                className: "contactum-btn contactum-btn-yes",
                onClick: async () => {
                  await downloadVCard();
                  setConfirmOpen(false);
                },
              },
              t.confirmYes
            ),
            h(
              "button",
              {
                type: "button",
                className: "contactum-btn contactum-btn-no",
                onClick: () => setConfirmOpen(false),
              },
              t.confirmNo
            )
          )
        )
      )
  );
}
