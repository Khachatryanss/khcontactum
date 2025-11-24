// client/src/components/HomePage.js
import React from "react";
import { getPublicInfoByCardId, API } from "../api.js";
import "./Responcive.css";
import "./AdminResponcive.css";
import IconsPage from "./IconsPage.js";
import BrandsPage from "./BrandsPage.js";
import BrandInfoPage from "./BrandInfoPage.js";
import SharePage from "./SharePage.js";

const h = React.createElement;

/* ------------ utils ------------ */
function absSrc(u = "") {
  if (!u) return "";
  if (/^(data:|https?:\/\/|blob:)/i.test(u)) return u;
  let path = String(u).trim().replace(/^server\//i, "");
  if (!path.startsWith("/")) path = "/" + path;
  try {
    const apiUrl = new URL(API);
    return `${apiUrl.origin}${path}`;
  } catch (e) {
    console.warn("absSrc: bad API, fallback to window.origin", API, e);
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin.replace(/\/$/, "") + path;
    }
    return path;
  }
}

function isVideo(u = "") {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(u);
}

/* ===== Armenian hyphenation ===== */
function hyphenateHy(text, uiLang = "hy") {
  if (!text) return "";
  const TOKENS = /(\bhttps?:\/\/\S+|\b\S+@\S+\.\S+|\b[\d._\-]+(?:\b|$))/gi;
  const U_DIGR = "\uE000";
  const toPh = (s) => s.replace(/ու/g, U_DIGR);
  const fromPh = (s) => s.replace(new RegExp(U_DIGR, "g"), "ու");
  const VOWEL = new Set(["ա", "ե", "է", "ը", "ի", "ո", "օ", "և", U_DIGR]);

  function hyphenateWord(w) {
    if (!w) return w;
    if (w.length < 6) return w;
    let src = toPh(w);
    const chars = Array.from(src);
    const breaks = [];
    const isV = (ch) => VOWEL.has(ch);
    const isC = (ch) => !VOWEL.has(ch);
    let lastBreak = -6;

    for (let i = 0; i < chars.length - 2; i++) {
      const a = chars[i],
        b = chars[i + 1],
        c = chars[i + 2];
      let place = -1;
      if (isV(a) && isC(b) && isV(c)) place = i + 1;
      if (
        isV(a) &&
        isC(b) &&
        isC(c) &&
        i + 3 < chars.length &&
        isV(chars[i + 3])
      )
        place = i + 2;

      if (place > 1 && place < chars.length - 2) {
        if (place - lastBreak >= 6) {
          breaks.push(place);
          lastBreak = place;
        }
      }
    }

    for (let k = breaks.length - 1; k >= 0; k--) {
      const at = breaks[k];
      chars.splice(at, 0, "\u00AD");
    }
    return fromPh(chars.join(""));
  }

  const out = String(text)
    .split(TOKENS)
    .map((chunk) => {
      if (TOKENS.test(chunk)) {
        TOKENS.lastIndex = 0;
        return chunk;
      }
      TOKENS.lastIndex = 0;
      return chunk.replace(/[\p{Script=Armenian}]+/gu, hyphenateWord);
    })
    .join("");
  return out.normalize("NFC");
}

function idealColsForLang(lang) {
  switch (lang) {
    case "hy":
      return [30, 34];
    case "ru":
      return [32, 38];
    case "en":
      return [36, 42];
    case "ar":
      return [30, 34];
    case "fr":
      return [36, 42];
    case "kz":
      return [32, 38];
    case "chn":
      return [28, 34];
    case "de":
      return [36, 42];
    case "es":
      return [36, 42];
    case "it":
      return [36, 42];
    case "fa":
      return [30, 34];
    default:
      return [34, 40];
  }
}

/* ==== Lang dropdown ==== */
function LangDropdown({
  value,
  onChange,
  langs = ["am", "ru", "en", "ar", "fr", "kz", "chn", "de", "es", "it", "fa"],
}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest?.(".lang-dd")) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  return h(
    "div",
    {
      className: "lang-dd",
      style: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 2,
      },
    },
    h(
      "button",
      {
        className: "chip active",
        onClick: () => setOpen((v) => !v),
        style: { minWidth: 48 },
      },
      (value || "am").toUpperCase()
    ),
    open &&
      h(
        "div",
        {
          className: "card",
          style: {
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            padding: 6,
            display: "grid",
            gap: 6,
            zIndex: 3,
          },
        },
        ...langs.map((code) =>
          h(
            "button",
            {
              key: code,
              className: "chip" + (code === value ? " active" : ""),
              onClick: () => {
                localStorage.setItem("lang", code);
                onChange(code);
                setOpen(false);
              },
            },
            code.toUpperCase()
          )
        )
      )
  );
}

function rgbaToCss(obj) {
  if (!obj || typeof obj !== "object") return "";
  const { r = 0, g = 0, b = 0, a = 1 } = obj;
  return `rgba(${(+r | 0)}, ${(+g | 0)}, ${(+b | 0)}, ${
    isFinite(+a) ? +a : 1
  })`;
}

function pickLang(
  v,
  lang,
  fallbacks = ["hy", "en", "ru", "ar", "fr", "kz", "chn", "de", "es", "it", "fa"]
) {
  if (!v) return "";
  if (typeof v === "string") return v;
  const order = [lang].concat(fallbacks.filter((x) => x !== lang));
  for (let i = 0; i < order.length; i++) {
    const k = order[i];
    const s = v && v[k];
    if (s && String(s).trim()) return String(s).trim();
  }
  return "";
}

/* =========================
   ROBUST AUTOPLAY VIDEO LOOP
   ========================= */
function VideoLoop({ src, style }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    let killed = false;

    v.muted = true;
    v.setAttribute("muted", "");
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.autoplay = true;
    v.setAttribute("autoplay", "");
    v.loop = true;
    v.setAttribute("loop", "");
    v.controls = false;

    const tryPlay = () => {
      if (killed || !v) return;
      const p = v.play?.();
      if (p && p.catch) {
        p.catch(() => {
          if (killed) return;
          requestAnimationFrame(() => setTimeout(tryPlay, 200));
        });
      }
    };

    const onCanPlay = () => tryPlay();
    const onEnded = () => {
      if (!v) return;
      v.currentTime = 0;
      tryPlay();
    };
    const onPause = () => {
      if (killed || !v) return;
      if (document.visibilityState === "visible" && !v.ended) {
        tryPlay();
      }
    };
    const onVisibility = () => {
      if (!killed && document.visibilityState === "visible") {
        tryPlay();
      }
    };
    const onWaiting = () => {
      if (killed || !v) return;
      tryPlay();
    };
    const onStalled = () => {
      if (killed || !v) return;
      tryPlay();
    };

    const watchdog = setInterval(() => {
      if (killed || !v) return;
      if (v.readyState >= 2 && (v.paused || v.ended)) {
        tryPlay();
      }
    }, 5000);

    let io = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) tryPlay();
          });
        },
        { threshold: 0.05 }
      );
      io.observe(v);
    }

    tryPlay();

    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("ended", onEnded);
    v.addEventListener("pause", onPause);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("stalled", onStalled);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      killed = true;
      if (io) io.disconnect();
      clearInterval(watchdog);
      if (!v) return;
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("stalled", onStalled);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src]);

  if (!src) return null;

  return h("video", {
    ref: videoRef,
    src,
    muted: true,
    playsInline: true,
    autoPlay: true,
    preload: "auto",
    disableRemotePlayback: true,
    style,
  });
}

/* ===== Avatar media (image / video) ===== */
function AvatarMedia({ src, isVideo, initials }) {
  const commonStyle = {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 8px",
    display: "block",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  };
  if (!src) {
    return h(
      "div",
      {
        style: {
          ...commonStyle,
          background: "#f2f2f2",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          color: "#999",
        },
      },
      (initials || "KH").slice(0, 2).toUpperCase()
    );
  }
  if (!isVideo)
    return h("img", {
      src,
      alt: "avatar",
      style: commonStyle,
      loading: "lazy",
    });
  return h(VideoLoop, { src, style: commonStyle });
}

/* ================================
   NEW: Language Manager (DnD + Switch)
   ================================ */
const ALL_LANGS = ["am", "ru", "en", "ar", "fr", "kz", "chn", "de", "es", "it", "fa"];

const LANG_LABELS = {
  am: "Հայերեն (AM)",
  ru: "Русский (RU)",
  en: "English (EN)",
  ar: "العربية (AR)",
  fr: "Français (FR)",
  kz: "Қазақша (KZ)",
  chn: "中文 (CHN)",
  de: "Deutsch (DE)",
  es: "Español (ES)",
  it: "Italiano (IT)",
  fa: "فارسی (FA)",
};

function Switch({ checked, onChange, disabled }) {
  return h(
    "button",
    {
      type: "button",
      onClick: disabled ? undefined : () => onChange(!checked),
      "aria-pressed": checked,
      style: {
        width: 46,
        height: 26,
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.15)",
        background: checked ? "#111" : "#d1d1d1",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "0.2s",
      },
    },
    h("span", {
      style: {
        position: "absolute",
        top: 2,
        left: checked ? 22 : 2,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,.25)",
        transition: "0.2s",
      },
    })
  );
}

function LanguageManager({ initialActive = [], onChange }) {
  const [items, setItems] = React.useState(() => {
    const activeSet = new Set(initialActive);
    const activeOrdered = initialActive.filter((c) => ALL_LANGS.includes(c));
    const inactive = ALL_LANGS.filter((c) => !activeSet.has(c));
    return [
      ...activeOrdered.map((code) => ({ code, active: true })),
      ...inactive.map((code) => ({ code, active: false })),
    ];
  });

  // drag state
  const dragIndexRef = React.useRef(null);

  const activeItems = items.filter((x) => x.active);
  const inactiveItems = items.filter((x) => !x.active);

  const emit = React.useCallback(
    (nextItems) => {
      const activeOrder = nextItems.filter((x) => x.active).map((x) => x.code);
      const def = activeOrder[0] || "am";
      onChange && onChange(activeOrder, def, nextItems);
    },
    [onChange]
  );

  const reorderActive = (from, to) => {
    setItems((prev) => {
      const act = prev.filter((x) => x.active);
      const inact = prev.filter((x) => !x.active);

      const moved = act.splice(from, 1)[0];
      act.splice(to, 0, moved);

      const next = [...act, ...inact];
      emit(next);
      return next;
    });
  };

  const toggleActive = (code, nextVal) => {
    setItems((prev) => {
      let next = prev.map((x) =>
        x.code === code ? { ...x, active: nextVal } : x
      );

      // keep actives first, preserving their order as much as possible
      const act = next.filter((x) => x.active);
      const inact = next.filter((x) => !x.active);
      next = [...act, ...inact];

      emit(next);
      return next;
    });
  };

  const renderRow = (item, index, isActiveList) => {
    const isDefault = isActiveList && index === 0;

    return h(
      "div",
      {
        key: item.code,
        draggable: isActiveList, // only active list can be reordered
        onDragStart: () => (dragIndexRef.current = index),
        onDragOver: (e) => {
          if (!isActiveList) return;
          e.preventDefault();
        },
        onDrop: (e) => {
          if (!isActiveList) return;
          e.preventDefault();
          const from = dragIndexRef.current;
          const to = index;
          if (from == null || to == null || from === to) return;
          reorderActive(from, to);
          dragIndexRef.current = null;
        },
        style: {
          display: "grid",
          gridTemplateColumns: "64px 1fr auto auto",
          alignItems: "center",
          gap: 10,
          padding: "10px 8px",
          borderRadius: 12,
          background: isActiveList ? "#fff" : "#f3f3f3",
          opacity: isActiveList ? 1 : 0.6,
          border: "1px solid rgba(0,0,0,0.06)",
          cursor: isActiveList ? "grab" : "default",
        },
      },
      // code chip
      h(
        "div",
        {
          style: {
            height: 30,
            minWidth: 44,
            padding: "0 12px",
            borderRadius: 999,
            background: isActiveList ? "#111" : "#9a9a9a",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            letterSpacing: 0.5,
            fontSize: 12,
          },
        },
        item.code.toUpperCase()
      ),

      // label
      h(
        "div",
        { style: { fontSize: 14, fontWeight: 600 } },
        LANG_LABELS[item.code] || item.code.toUpperCase()
      ),

      // default badge or order number
      h(
        "div",
        {
          style: {
            fontSize: 12,
            color: "#666",
            fontWeight: 700,
          },
        },
        isDefault ? "Default" : isActiveList ? `#${index + 1}` : ""
      ),

      // switch
      h(Switch, {
        checked: item.active,
        onChange: (v) => toggleActive(item.code, v),
      })
    );
  };

  return h(
    "section",
    {
      className: "card",
      style: {
        marginBottom: 12,
        padding: 12,
      },
    },
    h(
      "div",
      {
        style: {
          fontWeight: 800,
          marginBottom: 8,
          fontSize: 16,
        },
      },
      "Languages"
    ),
    h(
      "div",
      {
        style: {
          fontSize: 12,
          color: "#666",
          marginBottom: 10,
          lineHeight: 1.4,
        },
      },
      "Select active languages and reorder them by drag & drop. First active language becomes default."
    ),

    // Active list
    h(
      "div",
      { style: { display: "grid", gap: 8, marginBottom: 10 } },
      ...activeItems.map((it, i) => renderRow(it, i, true))
    ),

    // Inactive list
    inactiveItems.length
      ? h(
          "div",
          { style: { display: "grid", gap: 8 } },
          ...inactiveItems.map((it, i) => renderRow(it, i, false))
        )
      : null
  );
}

export default function HomePage({ cardId = "101" }) {
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");
  const [info, setInfo] = React.useState(null);
  const [lang, setLang] = React.useState(
    (typeof window !== "undefined" ? localStorage.getItem("lang") : "am") || "am"
  );
  const [activeBrandKeyword, setActiveBrandKeyword] = React.useState("");

  const htmlLang = lang === "am" ? "hy" : lang;

  React.useEffect(() => {
    try {
      document.documentElement.lang = htmlLang;
    } catch {}
  }, [htmlLang]);

  React.useEffect(() => {
    let killed = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const resp = await getPublicInfoByCardId(cardId);
        const data = resp?.data ?? resp ?? {};
        const root = data?.information || data || {};
        if (!killed) {
          setInfo(root);
          if (!localStorage.getItem("lang")) {
            const def =
              root &&
              root.default_lang &&
              Array.isArray(root.available_langs)
                ? root.available_langs.includes(root.default_lang)
                  ? root.default_lang
                  : undefined
                : undefined;
            if (def) setLang(def);
          }
        }
      } catch (e) {
        if (!killed) setErr(e.message || "Error");
      } finally {
        if (!killed) setLoading(false);
      }
    })();
    return () => {
      killed = true;
    };
  }, [cardId]);

  if (loading) return h("div", { className: "pad" }, "Բեռնվում է…");
  if (err) return h("div", { className: "pad" }, "Սխալ: " + err);
  if (!info) return h("div", { className: "pad" }, "Տվյալ չկա");

  try {
    const initialServerLangs =
      Array.isArray(info?.available_langs) && info.available_langs.length
        ? info.available_langs.slice(0, 11)
        : ALL_LANGS.slice();

    // NEW: local state for languages ordering/active
    const [availableLangs, setAvailableLangs] = React.useState(initialServerLangs);
    const [defaultLang, setDefaultLang] = React.useState(
      info?.default_lang && initialServerLangs.includes(info.default_lang)
        ? info.default_lang
        : initialServerLangs[0] || "am"
    );

    const serverLangs = availableLangs.length ? availableLangs : initialServerLangs;

    const nameByLang = {
      hy: info?.company?.name?.am || "",
      ru: info?.company?.name?.ru || "",
      en: info?.company?.name?.en || "",
      ar: info?.company?.name?.ar || "",
      fr: info?.company?.name?.fr || "",
      kz: info?.company?.name?.kz || "",
      chn: info?.company?.name?.chn || "",
      de: info?.company?.name?.de || "",
      es: info?.company?.name?.es || "",
      it: info?.company?.name?.it || "",
      fa: info?.company?.name?.fa || "",
    };

    const desc = info?.description || {};
    const about = info?.profile?.about || {};
    const textByLang = {
      hy: (desc?.am ?? about?.am) || "",
      ru: (desc?.ru ?? about?.ru) || "",
      en: (desc?.en ?? about?.en) || "",
      ar: (desc?.ar ?? about?.ar) || "",
      fr: (desc?.fr ?? about?.fr) || "",
      kz: (desc?.kz ?? about?.kz) || "",
      chn: (desc?.chn ?? about?.chn) || "",
      de: (desc?.de ?? about?.de) || "",
      es: (desc?.es ?? about?.es) || "",
      it: (desc?.it ?? about?.it) || "",
      fa: (desc?.fa ?? about?.fa) || "",
    };

    const nameColor = info?.company?.nameColor || "#111";
    const descColor =
      info?.description?.color || info?.profile?.aboutColor || "#666";

    const avTop = info?.avatar;
    const avProf = info?.profile?.avatar;

    const companyLogo =
      info?.company?.logoUrl ||
      info?.company?.logo_url ||
      (typeof info?.company?.logo === "string"
        ? info.company.logo
        : info?.company?.logo?.imageUrl || "");

    const fallbackLogo =
      info?.assets?.logo_url || info?.logo_url || companyLogo || "";

    let avatarUrl = "";
    let avatarType = "";

    if (typeof avTop === "string") avatarUrl = avTop;
    else if (avTop && typeof avTop === "object") {
      avatarType = avTop.type || "";
      if (avatarType === "image") avatarUrl = avTop.imageUrl || avTop.videoUrl || "";
      else if (avatarType === "video") avatarUrl = avTop.videoUrl || avTop.imageUrl || "";
      else avatarUrl = avTop.imageUrl || avTop.videoUrl || "";
    }

    if (!avatarUrl && avProf) {
      if (typeof avProf === "string") avatarUrl = avProf;
      else if (typeof avProf === "object")
        avatarUrl = avProf.imageUrl || avProf.videoUrl || "";
    }
    if (!avatarUrl && fallbackLogo) avatarUrl = fallbackLogo;

    const avatarAbs = absSrc(avatarUrl);
    const avatarIsVideo =
      avatarType === "video" ? true : avatarType === "image" ? false : isVideo(avatarAbs);

    const bg =
      info?.background || {
        type: "color",
        color: "#ffffff",
        imageUrl: "",
        videoUrl: "",
      };

    const name =
      nameByLang[htmlLang] ||
      nameByLang.hy ||
      nameByLang.en ||
      "—";

    const descriptionRaw = textByLang[htmlLang] || "";
    const description =
      htmlLang === "hy"
        ? hyphenateHy(descriptionRaw, "hy")
        : hyphenateHy(descriptionRaw, htmlLang);

    const [minCh, maxCh] = idealColsForLang(htmlLang);

    const descStyle = {
      color: descColor,
      margin: "15px auto 0",
      lineHeight: 1.6,
      maxWidth: `clamp(${minCh}ch, 90%, ${maxCh}ch)`,
      textAlign: "justify",
      textJustify: "inter-word",
      overflowWrap: "break-word",
      wordBreak: "break-word",
    };

    const icons = info?.icons || {};
    const links = Array.isArray(icons.links) ? icons.links : [];
    const styles = icons?.styles || {};

    const labelColor = styles.labelCss || styles.labelHEX || "";
    const chipColor = styles.chipCss || rgbaToCss(styles.chipRGBA) || "";
    const rowCardColor = styles.rowCardCss || rgbaToCss(styles.rowCardRGBA) || "";
    const layoutStyle = styles.layoutStyle || "dzev1";
    const cols = Number(styles.cols || 4);
    const glowEnabled = !!styles.glowEnabled;
    const glowColor = styles.glowColor || "#7dd3fc";

    const brandsArray = Array.isArray(info?.brands) ? info.brands : [];
    const brandsCols = Number(info?.brandsCols || 3);
    const brandsTitleColor = info?.brandsTitleColor || "#000000";
    const brandsTitleText = info?.brandsTitleText || "ՄԵՐ ԲՐԵՆԴՆԵՐԸ";
    const brandsBgColor = info?.brandsBgColor || "#ffffff";
    const brandsNameColor = info?.brandsNameColor || "#000000";

    const brandInfos = Array.isArray(info?.brandInfos) ? info.brandInfos : [];
    const showBrandInfo = !!activeBrandKeyword;

    return h(
      "div",
      {
        className: "public-home",
        style: {
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "100%",
          overflow: "hidden",
        },
      },
      /* BACKGROUND LAYER */
      h(
        "div",
        {
          className: "public-bg-layer",
          style: {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
            background:
              bg.type === "color"
                ? bg.color || "#ffffff"
                : bg.type === "image"
                ? `url(${absSrc(bg.imageUrl)}) center/cover no-repeat`
                : "transparent",
          },
        },
        bg.type === "video" && bg.videoUrl
          ? h(VideoLoop, {
              src: absSrc(bg.videoUrl),
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
          : null
      ),

      /* SCROLL LAYER */
      h(
        "div",
        {
          className: "public-scroll-layer",
          id: "publicScroll",
          style: {
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            padding: "12px",
          },
        },

        // NEW: Language reorder + switches section
        h(LanguageManager, {
          initialActive: initialServerLangs,
          onChange: (activeOrder, def) => {
            setAvailableLangs(activeOrder);
            setDefaultLang(def);

            // keep current lang valid
            if (!activeOrder.includes(lang)) {
              const nextLang = def || activeOrder[0] || "am";
              localStorage.setItem("lang", nextLang);
              setLang(nextLang);
            }
          },
        }),

        h(LangDropdown, {
          value: lang,
          onChange: setLang,
          langs: serverLangs,
        }),

        showBrandInfo
          ? h(BrandInfoPage, {
              brandInfos,
              keyword: activeBrandKeyword,
              lang: htmlLang,
              onBack: () => setActiveBrandKeyword(""),
            })
          : h(
              "div",
              { style: { position: "relative" } },
              /* HERO CARD */
              h(
                "section",
                {
                  className: "card",
                  style: { textAlign: "center", paddingTop: 10, paddingBottom: 18 },
                },
                h(AvatarMedia, {
                  src: avatarAbs,
                  isVideo: avatarIsVideo,
                  initials: (name || "KH").slice(0, 2).toUpperCase(),
                }),
                h(
                  "h1",
                  {
                    className: "hero-title",
                    style: { color: nameColor, margin: "15px 0 4px", fontSize: 35 },
                  },
                  name
                ),
                h(
                  "p",
                  {
                    className: "hero-desc",
                    style: descStyle,
                    lang: htmlLang,
                    dir: htmlLang === "ar" || htmlLang === "fa" ? "rtl" : "ltr",
                  },
                  description
                )
              ),

              /* ICONS */
              links.length
                ? h(IconsPage, {
                    links,
                    labelColor,
                    chipColor,
                    rowCardColor,
                    layoutStyle,
                    cols,
                    glowEnabled,
                    glowColor,
                    lang: htmlLang,
                  })
                : null,

              /* BRANDS */
              brandsArray.length
                ? h(BrandsPage, {
                    brands: brandsArray,
                    brandsTitleColor,
                    brandsTitleText,
                    brandsCols,
                    brandsBgColor,
                    brandsNameColor,
                    lang: htmlLang,
                    onKeywordClick: (kw) => setActiveBrandKeyword(kw),
                  })
                : null,

              /* SHARE */
              h(SharePage, {
                cardId,
                info,
                lang: htmlLang,
              })
            )
      )
    );
  } catch (e) {
    return h("div", { className: "pad" }, "Render error: " + (e.message || String(e)));
  }
}
