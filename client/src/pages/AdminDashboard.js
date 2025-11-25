// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { adminMe, adminGetInfo, adminSaveInfo, uploadFile } from "../api.js";
import "./tabs/AdminResponcive.css";
import { fileUrl } from "../utils/fileUrl.js";
import IconsTab from "./tabs/IconsTab.js";
import BrandsTab from "./tabs/BrandsTab.js";
import PasswordTab from "./tabs/PasswordTab.js";
import BrandInfoTab from "./tabs/BrandInfoTab.js";
import ShareTab from "./tabs/ShareTab.js";

const h = React.createElement;

/* ---------- UI TEXT BY LANGUAGE ---------- */
const ADMIN_UI_TEXT = {
  /* ... ԱՄԲՈՂՋ T օբյեկտը նույնն եմ թողնում, ինչ ուղարկել էիր ... */
  am: {
    tabs: {
      home: "Գլխավոր էջ",
      icons: "Իկոնների էջ",
      brands: "Բրենդների էջ",
      brandinfo: "Բրենդ ինֆո",
      share: "Կիսվել / QR",
      password: "Փոխել Գաղտնաբառը",
    },
    logout: "ԵԼՔ",
    headerAdminPrefix: "ADMIN",

    langsTitle: "ԼԵԶՈՒՆԵՐ",
    langsDescription:
      "Ընտրիր ակտիվ լեզուները և փոխիր կարգը․ առաջինը կլինի public էջի հիմնական լեզուն։",

    avatarTitle: "AVATAR",
    typeLabel: "Տեսակ",
    avatarTypeImage: "Նկար",
    avatarTypeVideo: "Վիդեո",
    avatarImageUrlLabel: "Avatar նկարի հղում",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "Avatar վիդեոյի հղում",
    avatarVideoHint: "Մաքս. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "ԿԱԶՄԱԿԵՐՊՈՒԹՅԱՆ ԱՆՎԱՆՈՒՄ",
    nameColorLabel: "Անվան գույնը",

    descriptionTitle: "ՆԿԱՐԱԳՐՈՒԹՅՈՒՆ",
    descriptionColorLabel: "Նկարագրության գույնը",

    backgroundTitle: "ՖՈՆ",
    backgroundTypeColor: "Գույն",
    backgroundTypeImage: "Նկար",
    backgroundTypeVideo: "Վիդեո",
    backgroundColorLabel: "Ֆոնի գույնը",
    backgroundImageUrlLabel: "Ֆոնի նկարի հղում",
    backgroundVideoUrlLabel: "Ֆոնի վիդեոյի հղում",
    backgroundVideoHint: "Մաքս. 20 MB (mp4, webm, ogg)",

    saveButton: "Պահել",
    savingButton: "Պահվում է...",
    saveOk: "Պահվեց ✅",
    saveError: "Սխալ պահելիս",

    needLoginTitle: "Մուտք անհրաժեշտ է",
    needLoginBody: "Մուտք գործիր / էջում։",
    loading: "Բեռնվում է…",

    chooseFileLabel: "Ընտրել ֆայլ",
  },

  /* ... ru, en, ar, fr, kz, chn, de, es, it, fa — ինչպես արդեն ունես ... */
  ru: { /* ... */ },
  en: { /* ... */ },
  ar: { /* ... */ },
  fr: { /* ... */ },
  kz: { /* ... */ },
  chn: { /* ... */ },
  de: { /* ... */ },
  es: { /* ... */ },
  it: { /* ... */ },
  fa: { /* ... */ },
};

const DEFAULT_INFO = {
  logo_url: "",
  avatar: { type: "image", imageUrl: "", videoUrl: "" },

  company: {
    name: {
      am: "",
      ru: "",
      en: "",
      ar: "",
      fr: "",
      kz: "",
      chn: "",
      de: "",
      es: "",
      it: "",
      fa: "",
    },
    nameColor: "#000000",
  },

  description: {
    am: "",
    ru: "",
    en: "",
    ar: "",
    fr: "",
    kz: "",
    chn: "",
    de: "",
    es: "",
    it: "",
    fa: "",
    color: "#000000",
  },

  background: {
    type: "color",
    color: "#ffffff",
    imageUrl: "",
    videoUrl: "",
  },
};

// լեզուների ամբողջ ցանկ
const ALL_LANGS = [
  { code: "am", label: "Հայերեն (AM)" },
  { code: "ru", label: "Русский (RU)" },
  { code: "en", label: "English (EN)" },
  { code: "ar", label: "العربية (AR)" },
  { code: "fr", label: "Français (FR)" },
  { code: "kz", label: "Қазақша (KZ)" },
  { code: "chn", label: "中文 (CHN)" },
  { code: "de", label: "Deutsch (DE)" },
  { code: "es", label: "Español (ES)" },
  { code: "it", label: "Italiano (IT)" },
  { code: "fa", label: "فارسی (FA)" },
];
const ALL_CODES = ALL_LANGS.map((x) => x.code);

// always return full shape + back-compat mapping
function normalizeInfo(partial) {
  const i = partial || {};
  const avatar = {
    type: i.avatar?.type || (i.logo_url ? "image" : "image"),
    imageUrl: i.avatar?.imageUrl || i.logo_url || "",
    videoUrl: i.avatar?.videoUrl || "",
  };
  return {
    logo_url: i.logo_url || avatar.imageUrl || "",
    avatar,

    company: {
      nameColor: (i.company && i.company.nameColor) || "#000000",
      name: {
        am: i.company?.name?.am || "",
        ru: i.company?.name?.ru || "",
        en: i.company?.name?.en || "",
        ar: i.company?.name?.ar || "",
        fr: i.company?.name?.fr || "",
        kz: i.company?.name?.kz || "",
        chn: i.company?.name?.chn || "",
        de: i.company?.name?.de || "",
        es: i.company?.name?.es || "",
        it: i.company?.name?.it || "",
        fa: i.company?.name?.fa || "",
      },
    },

    description: {
      am: i.description?.am || "",
      ru: i.description?.ru || "",
      en: i.description?.en || "",
      ar: i.description?.ar || "",
      fr: i.description?.fr || "",
      kz: i.description?.kz || "",
      chn: i.description?.chn || "",
      de: i.description?.de || "",
      es: i.description?.es || "",
      it: i.description?.it || "",
      fa: i.description?.fa || "",
      color: i.description?.color || "#000000",
    },

    background: {
      type: i.background?.type || "color",
      color: i.background?.color || "#ffffff",
      imageUrl: i.background?.imageUrl || "",
      videoUrl: i.background?.videoUrl || "",
    },

    // share դաշտը թողնում ենք ինչ կա՝ ShareTab–ը ինքը կխումբագրի
    share: i.share || undefined,
  };
}

/* ---------- Reusable file button (translated) ---------- */
function FileButton({ label, accept, onChange }) {
  const inputRef = React.useRef(null);
  return h(
    React.Fragment,
    null,
    h(
      "button",
      {
        type: "button",
        className: "btn",
        onClick: () => inputRef.current && inputRef.current.click(),
      },
      label
    ),
    h("input", {
      ref: inputRef,
      type: "file",
      style: { display: "none" },
      accept,
      onChange,
    })
  );
}

export default function AdminDashboard({
  token: propToken,
  onLogout,
  uiLang = "en",
  onLangChange,
}) {
  const token =
    propToken ||
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const T = ADMIN_UI_TEXT[uiLang] || ADMIN_UI_TEXT.en;

  // UI լեզուների selector
  const UI_LANGS = ["en", "am", "fr", "ar", "ru", "kz", "chn", "de", "es", "it", "fa"];

  function handleUiLangChange(next) {
    if (!next || next === uiLang) return;
    if (onLangChange) {
      onLangChange(next);
    }
  }

  const [tab, setTab] = useState("home");
  const [showMenu, setShowMenu] = useState(false);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [me, setMe] = useState(null);

  const [cardId, setCardId] = useState(null);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  // ակտիվ լեզուների հերթականություն (payload-ի համար)
  const [langs, setLangs] = useState(["am", "ru", "en", "ar", "fr"]);

  // սլայդերի արժեքները՝ code → position
  const [langOrder, setLangOrder] = useState(() => {
    const o = {};
    ALL_LANGS.forEach((l, i) => {
      o[l.code] = i + 1;
    });
    return o;
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState("");
  const [bgVideoPreview, setBgVideoPreview] = useState("");

  useEffect(() => {
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminMe(token);
        setMe(data?.admin || null);

        const inf = await adminGetInfo(token);
        setCardId(inf?.card_id || null);

        const root = inf?.information || inf || {};
        const normalized = normalizeInfo(root);
        setInfo(normalized);

        const rawAvail = Array.isArray(root.available_langs)
          ? root.available_langs
          : null;

        let langsArr =
          rawAvail && rawAvail.length
            ? rawAvail.filter((code) => ALL_CODES.includes(code))
            : ALL_CODES.slice();

        const def =
          root.default_lang && ALL_CODES.includes(root.default_lang)
            ? root.default_lang
            : langsArr[0] || "am";

        if (def) {
          if (!langsArr.includes(def)) {
            langsArr = [def].concat(langsArr);
          } else {
            langsArr = [def].concat(langsArr.filter((c) => c !== def));
          }
        }

        const seen = new Set();
        langsArr = langsArr.filter((c) => {
          if (seen.has(c)) return false;
          seen.add(c);
          return true;
        });

        if (!langsArr.length) langsArr = ["am"];
        setLangs(langsArr);

        // սինքրոնացնենք սլայդերի արժեքները ակտիվ լեզուների հերթականությամբ
        setLangOrder((prev) => {
          const next = { ...prev };
          langsArr.forEach((code, idx) => {
            next[code] = idx + 1; // #1՝ default, #2՝ երկրորդ, ...
          });
          return next;
        });
      } catch (e) {
        setMsg(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  function doLogout() {
    try {
      sessionStorage.removeItem("adminToken");
      localStorage.removeItem("adminToken");
    } catch {}
    onLogout && onLogout();
  }

  function setInfoPath(path, value) {
    setInfo((prev) => {
      const next = normalizeInfo(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]] || typeof cur[keys[i]] !== "object") {
          cur[keys[i]] = {};
        }
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return normalizeInfo(next);
    });
  }

  async function saveInfo() {
    setSavingInfo(true);
    setInfoMsg("");
    try {
      const payload = normalizeInfo(info);
      payload.available_langs = langs;
      payload.default_lang = langs[0] || "am";

      await adminSaveInfo(token, payload);
      setInfoMsg(T.saveOk);
    } catch (e) {
      setInfoMsg(e.message || T.saveError);
    } finally {
      setSavingInfo(false);
      setTimeout(() => setInfoMsg(""), 1500);
    }
  }

  function input(label, value, onChange, props) {
    return h(
      "label",
      { className: "block mb-3", id: "nkariMecbajin" },
      h("div", { className: "text-sm mb-1", id: "nkariBajin" }, label),
      h(
        "input",
        Object.assign(
          {
            className: "input",
            id: "nkarInput",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
          },
          props || {}
        )
      )
    );
  }

  function textarea(label, value, onChange, props) {
    return h(
      "label",
      { className: "block mb-3" },
      h("div", { className: "text-sm mb-1" }, label),
      h(
        "textarea",
        Object.assign(
          {
            className: "input h-28",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
          },
          props || {}
        )
      )
    );
  }

  function bytesMB(n) {
    return (n / (1024 * 1024)).toFixed(1);
  }

  function CirclePreview(src, kind) {
    return h(
      "div",
      {
        style: {
          width: "64px",
          height: "64px",
          borderRadius: "9999px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,.15)",
          background: "#fff",
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
        },
      },
      src
        ? kind === "video"
          ? h("video", {
              src,
              muted: true,
              loop: true,
              playsInline: true,
              autoPlay: true,
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
          : h("img", {
              src,
              alt: "preview",
              style: { width: "100%", height: "100%", objectFit: "cover" },
            })
        : h("div", {
            style: {
              width: "60%",
              height: "60%",
              borderRadius: "9999px",
              background: "#e5e7eb",
            },
          })
    );
  }

  async function handleAvatarUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVid = info?.avatar?.type === "video";

    if (isVid) {
      if (!f.type.startsWith("video/")) {
        setInfoMsg("Ընդունվում են միայն վիդեոներ");
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        setInfoMsg(`Վիդեոն մեծ է (${bytesMB(f.size)} MB) — մաքս. 20 MB`);
        return;
      }
    } else {
      if (!f.type.startsWith("image/")) {
        setInfoMsg("Ընդունվում են միայն նկարներ");
        return;
      }
    }

    setAvatarPreview(URL.createObjectURL(f));

    try {
      const field = isVid ? "avatar.videoUrl" : "avatar.imageUrl";
      const res = await uploadFile(token, f, field);

      if (res?.information) {
        if (!isVid) {
          res.information.logo_url = res.url;
        }
        setInfo(normalizeInfo(res.information));
      } else {
        if (isVid) {
          setInfoPath("avatar.videoUrl", res.url);
        } else {
          setInfoPath("avatar.imageUrl", res.url);
          setInfoPath("logo_url", res.url);
        }
      }

      setInfoMsg(isVid ? "Avatar video ✔" : "Avatar image ✔");
    } catch (err) {
      setInfoMsg(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handleBgImageUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setInfoMsg("Ընդունվում են միայն նկարներ");
      return;
    }
    setBgImagePreview(URL.createObjectURL(f));
    try {
      const res = await uploadFile(token, f, "background.imageUrl");
      if (res?.information) {
        setInfo(normalizeInfo(res.information));
      } else {
        setInfoPath("background.imageUrl", res.url);
      }
      setInfoPath("background.type", "image");
      setInfoMsg("Background image ✔");
    } catch (err) {
      setInfoMsg(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handleBgVideoUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setInfoMsg("Ընդունվում են միայն վիդեոներ");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setInfoMsg(`Վիդեոն մեծ է (${bytesMB(f.size)} MB) — մաքս. 20 MB`);
      return;
    }
    setBgVideoPreview(URL.createObjectURL(f));
    try {
      const res = await uploadFile(token, f, "background.videoUrl");
      if (res?.information) {
        setInfo(normalizeInfo(res.information));
      } else {
        setInfoPath("background.videoUrl", res.url);
      }
      setInfoPath("background.type", "video");
      setInfoMsg("Background video ✔");
    } catch (err) {
      setInfoMsg(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  function handleAvatarTypeChange(val) {
    setInfo((prev) => {
      const next = normalizeInfo(prev);
      next.avatar.type = val;
      setAvatarPreview("");
      return next;
    });
  }

  function handleBgTypeChange(val) {
    setInfoPath("background.type", val);
    if (val === "color") {
      setBgImagePreview("");
      setBgVideoPreview("");
      setInfoPath("background.imageUrl", "");
      setInfoPath("background.videoUrl", "");
    } else if (val === "image") {
      setBgVideoPreview("");
      setInfoPath("background.videoUrl", "");
    } else {
      setBgImagePreview("");
      setInfoPath("background.imageUrl", "");
    }
  }

  // on/off toggle
  function toggleLang(code) {
    setLangs((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        if (prev.length === 1) return prev; // գոնե 1 լեզու թող մնա
        return prev.filter((c) => c !== code);
      } else {
        // նոր միացված լեզուն դնենք վերջում՝ order=max+1
        setLangOrder((prevOrder) => {
          const maxOrder = Object.values(prevOrder).reduce(
            (max, n) =>
              typeof n === "number" && n > max ? n : max,
            0
          );
          return { ...prevOrder, [code]: maxOrder + 1 };
        });
        return [...prev, code];
      }
    });
  }

  // սլայդերի փոփոխություն — փոխում է langs-ի հերթականությունը
  function handleLangOrderChange(code, newPos) {
    setLangOrder((prev) => {
      const next = { ...prev, [code]: newPos };
      setLangs((prevLangs) => {
        const arr = prevLangs.slice();
        arr.sort(
          (a, b) => (next[a] || 999) - (next[b] || 999)
        );
        return arr;
      });
      return next;
    });
  }

  function TabMenuItem(id, label) {
    const active = tab === id;
    return h(
      "button",
      {
        key: id,
        type: "button",
        className: "list-menu-item" + (active ? " active" : ""),
        onClick: () => {
          setTab(id);
          setShowMenu(false);
        },
      },
      label
    );
  }

  function TabsAnchor() {
    if (!token || loading) return null;
    return h(
      "div",
      { className: "menu-anchor" },
      h(
        "button",
        {
          type: "button",
          className: "btn-ghost",
          onClick: () => setShowMenu((v) => !v),
        },
        "⋮"
      ),
      showMenu &&
        h(
          "div",
          { className: "popup-menu" },
          TabMenuItem("home", T.tabs.home),
          TabMenuItem("icons", T.tabs.icons),
          TabMenuItem("brands", T.tabs.brands),
          TabMenuItem("brandinfo", T.tabs.brandinfo),
          TabMenuItem("share", T.tabs.share),
          TabMenuItem("password", T.tabs.password),
          h(
            "button",
            {
              type: "button",
              className: "list-menu-item",
              onClick: () => {
                setShowMenu(false);
                doLogout();
              },
            },
            T.logout
          )
        )
    );
  }

  function LangSelector() {
    if (!token || loading) return null;

    return h(
      "select",
      {
        className: "admin-login-lang-select",
        value: uiLang,
        onChange: (e) => handleUiLangChange(e.target.value),
        style: {
          minWidth: 72,
          fontSize: 13,
        },
      },
      UI_LANGS.map((code) =>
        h("option", { key: code, value: code }, code.toUpperCase())
      )
    );
  }

  const Card = (title, children) =>
    h(
      "div",
      { className: "card" },
      (title || (token && !loading)) &&
        h(
          "div",
          {
            className: "row",
            style: {
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: title ? 8 : 0,
            },
          },
          title && h("h2", { style: { margin: 0 } }, title),
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
              },
            },
            LangSelector(),
            TabsAnchor()
          )
        ),
      children || null
    );

  const PageHome = Card(
    T.tabs.home,
    h(
      React.Fragment,
      null,
      /* ---------- LANGS BLOCK ---------- */
      h("h3", { className: "title mb-2" }, T.langsTitle),
      h(
        "div",
        { className: "mb-4" },
        h(
          "div",
          {
            className: "text-sm mb-2",
            style: { opacity: 0.75, width: 280 },
          },
          T.langsDescription
        ),

        ALL_LANGS.map(({ code, label }, staticIndex) => {
          const active = langs.includes(code);
          const orderValue =
            typeof langOrder[code] === "number"
              ? langOrder[code]
              : staticIndex + 1;

          return h(
            "div",
            {
              key: code,
              className: "row mb-1",
              style: {
                display: "flex",
                marginLeft: "5px",
                alignItems: "center",
                opacity: active ? 1 : 0.4,
                background: "transparent",
                borderRadius: 8,
                padding: "2px 4px",
              },
            },
            // left badge (AM / RU / ...)
            h(
              "button",
              {
                type: "button",
                className: "btn",
                onClick: () => toggleLang(code),
                style: {
                  padding: "2px 5px",
                  width: 60,
                },
              },
              code.toUpperCase()
            ),

            // label
            h(
              "span",
              {
                style: {
                  flex: 1,
                  fontSize: "14px",
                  fontFamily: "revert-layer",
                  width: 100,
                },
              },
              label
            ),

            // 🔢 հաստատուն համար (#1,#2,...) ըստ ALL_LANGS կարգի — չի փոխվում
            h(
              "span",
              {
                className: "small",
                style: {
                  minWidth: 32,
                  fontSize: "13px",
                  opacity: 0.8,
                  textAlign: "right",
                  marginRight: 4,
                },
              },
              `#${staticIndex + 1}`
            ),

            // 🌡 սլայդեր՝ լեզվի իսկական հերթականությունը փոխելու համար
            h("input", {
              type: "range",
              min: 1,
              max: ALL_LANGS.length,
              value: orderValue,
              disabled: !active, // միայն ակտիվների համար իմաստ ունի
              onChange: (e) =>
                handleLangOrderChange(code, Number(e.target.value)),
              style: {
                width: 80,
                marginRight: 6,
                cursor: active ? "pointer" : "not-allowed",
              },
            }),

            // 🟢/⚪ switch (active / inactive)
            h(
              "button",
              {
                type: "button",
                onClick: () => toggleLang(code),
                style: {
                  width: 42,
                  height: 22,
                  borderRadius: 999,
                  border: "none",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: active ? "flex-end" : "flex-start",
                  background: active ? "#111" : "#d4d4d4",
                  transition: "background 0.15s, justify-content 0.15s",
                  marginRight: 6,
                },
              },
              h("div", {
                style: {
                  width: 18,
                  height: 18,
                  borderRadius: "999px",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                },
              })
            )
          );
        })
      ),

      /* ---------- ԱՎԱՏԱՐ, ԿՈՄՓԱՆԻԱ, DESCRIPTION, BACKGROUND — նույնը ինչ ունեիր ---------- */

      h("h3", { className: "title mb-2" }, T.avatarTitle),
      h(
        "label",
        { className: "block mb-3" },
        h("div", { className: "text-sm mb-1" }, T.typeLabel),
        h(
          "select",
          {
            className: "input",
            value: info?.avatar?.type || "image",
            onChange: (e) => handleAvatarTypeChange(e.target.value),
          },
          h("option", { value: "image" }, T.avatarTypeImage),
          h("option", { value: "video" }, T.avatarTypeVideo)
        )
      ),

      info?.avatar?.type === "image" &&
        h(
          "div",
          {
            className: "mb-4",
            style: { display: "flex", alignItems: "center", gap: "10px" },
          },
          CirclePreview(
            fileUrl(avatarPreview || info?.avatar?.imageUrl || info.logo_url),
            "image"
          ),
          input(
            T.avatarImageUrlLabel,
            info?.avatar?.imageUrl || info.logo_url || "",
            (v) => {
              setInfoPath("avatar.imageUrl", v);
              setInfoPath("logo_url", v);
            },
            { placeholder: "https://..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept:
              "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
            onChange: handleAvatarUpload,
          }),
          h("div", { className: "small" }, T.avatarImageHint)
        ),

      info?.avatar?.type === "video" &&
        h(
          "div",
          {
            className: "mb-4",
            id: "uploadImg",
            style: { display: "flex", alignItems: "center", gap: "12px" },
          },
          CirclePreview(
            fileUrl(avatarPreview || info?.avatar?.videoUrl || ""),
            "video"
          ),
          input(
            T.avatarVideoUrlLabel,
            info?.avatar?.videoUrl || "",
            (v) => setInfoPath("avatar.videoUrl", v),
            { placeholder: "/file/..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept: "video/*,.mp4,.webm,.ogg",
            onChange: handleAvatarUpload,
          }),
          h("div", { className: "small" }, T.avatarVideoHint)
        ),

      /* COMPANY */
      h("h3", { className: "title mb-2" }, T.companyNameTitle),

      langs.map((code) => {
        const meta = ALL_LANGS.find((x) => x.code === code);
        const label = meta ? meta.label : code.toUpperCase();
        const placeholder =
          code === "am"
            ? "Անուն (AM)"
            : code === "ru"
            ? "Название (RU)"
            : code === "en"
            ? "Company Name (EN)"
            : code === "ar"
            ? "الاسم (AR)"
            : code === "fr"
            ? "Nom de l'entreprise (FR)"
            : code === "kz"
            ? "Компания атауы (KZ)"
            : code === "chn"
            ? "公司名称 (CHN)"
            : code === "de"
            ? "Firmenname (DE)"
            : code === "es"
            ? "Nombre de la empresa (ES)"
            : code === "it"
            ? "Nome dell'azienda (IT)"
            : "نام شرکت (FA)";

        const extraProps =
          code === "ar" || code === "fa"
            ? { dir: "rtl", placeholder }
            : { placeholder };

        return h(
          React.Fragment,
          { key: code },
          input(
            label,
            info?.company?.name?.[code] || "",
            (v) => setInfoPath(`company.name.${code}`, v),
            extraProps
          )
        );
      }),

      /* COMPANY NAME COLOR */
      h(
        "div",
        { className: "block mb-4", id: "companyNameColor" },
        h(
          "div",
          { className: "text-sm mb-1", id: "nkariBajin" },
          T.nameColorLabel
        ),
        h(
          "div",
          { className: "color-row" },
          h("input", {
            className: "input color-hex-input",
            id: "nkarInput",
            value: info?.company?.nameColor || "#000000",
            onChange: (e) =>
              setInfoPath("company.nameColor", e.target.value),
            style: { maxWidth: 200 },
            placeholder: "#000000",
          }),
          h("input", {
            type: "color",
            className: "color-picker",
            value: info?.company?.nameColor || "#000000",
            onChange: (e) =>
              setInfoPath("company.nameColor", e.target.value),
          })
        )
      ),

      /* DESCRIPTION */
      h("h3", { className: "title mb-2" }, T.descriptionTitle),

      langs.map((code) => {
        const meta = ALL_LANGS.find((x) => x.code === code);
        const label = meta ? meta.label : code.toUpperCase();
        const placeholder =
          code === "am"
            ? "Նկարագրություն (AM)"
            : code === "ru"
            ? "Описание (RU)"
            : code === "en"
            ? "Description (EN)"
            : code === "ar"
            ? "الوصف (AR)"
            : code === "fr"
            ? "Description (FR)"
            : code === "kz"
            ? "Сипаттама (KZ)"
            : code === "chn"
            ? "描述 (CHN)"
            : code === "de"
            ? "Beschreibung (DE)"
            : code === "es"
            ? "Descripción (ES)"
            : code === "it"
            ? "Descrizione (IT)"
            : "توضیحات (FA)";

        const extraProps =
          code === "ar" || code === "fa"
            ? { dir: "rtl", placeholder }
            : { placeholder };

        return h(
          React.Fragment,
          { key: code },
          textarea(
            label,
            info?.description?.[code] || "",
            (v) => setInfoPath(`description.${code}`, v),
            extraProps
          )
        );
      }),

      /* DESCRIPTION COLOR */
      h(
        "div",
        { className: "block mb-4", id: "descriptionColor" },
        h(
          "div",
          { className: "text-sm mb-1", id: "nkariBajin" },
          T.descriptionColorLabel
        ),
        h(
          "div",
          { className: "color-row" },
          h("input", {
            className: "input color-hex-input",
            id: "nkarInput",
            value: info?.description?.color || "#000000",
            onChange: (e) =>
              setInfoPath("description.color", e.target.value),
            style: { maxWidth: 180 },
            placeholder: "#000000",
          }),
          h("input", {
            type: "color",
            className: "color-picker",
            value: info?.description?.color || "#000000",
            onChange: (e) =>
              setInfoPath("description.color", e.target.value),
          })
        )
      ),

      /* BACKGROUND */
      h("h3", { className: "title mb-2" }, T.backgroundTitle),
      h(
        "label",
        { className: "block mb-3", id: "selectOurBackground" },
        h("div", { className: "text-sm mb-1" }, T.typeLabel),
        h(
          "select",
          {
            className: "input",
            value: info?.background?.type || "color",
            onChange: (e) => handleBgTypeChange(e.target.value),
          },
          h("option", { value: "color" }, T.backgroundTypeColor),
          h("option", { value: "image" }, T.backgroundTypeImage),
          h("option", { value: "video" }, T.backgroundTypeVideo)
        )
      ),

      info?.background?.type === "color" &&
        h(
          "div",
          { className: "block mb-4" },
          h(
            "div",
            { className: "text-sm mb-1", id: "nkariBajin" },
            T.backgroundColorLabel
          ),
          h(
            "div",
            { className: "color-row" },
            h("input", {
              className: "input color-hex-input",
              id: "nkarInput",
              value: info?.background?.color || "#ffffff",
              onChange: (e) =>
                setInfoPath("background.color", e.target.value),
              style: { maxWidth: 180 },
              placeholder: "#ffffff",
            }),
            h("input", {
              type: "color",
              className: "color-picker",
              value: info?.background?.color || "#ffffff",
              onChange: (e) =>
                setInfoPath("background.color", e.target.value),
            })
          )
        ),

      info?.background?.type === "image" &&
        h(
          "div",
          {
            className: "row mb-3",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            },
          },
          CirclePreview(
            fileUrl(bgImagePreview || info?.background?.imageUrl || ""),
            "image"
          ),
          input(
            T.backgroundImageUrlLabel,
            info?.background?.imageUrl || "",
            (v) => setInfoPath("background.imageUrl", v),
            { placeholder: "https://..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept:
              "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
            onChange: handleBgImageUpload,
          })
        ),

      info?.background?.type === "video" &&
        h(
          "div",
          {
            className: "row mb-3",
            style: { display: "flex", alignItems: "center", gap: "12px" },
          },
          CirclePreview(
            fileUrl(bgVideoPreview || info?.background?.videoUrl || ""),
            "video"
          ),
          input(
            T.backgroundVideoUrlLabel,
            info?.background?.videoUrl || "",
            (v) => setInfoPath("background.videoUrl", v),
            { placeholder: "/file/..." }
          ),
          h(FileButton, {
            label: T.chooseFileLabel,
            accept: "video/*,.mp4,.webm,.ogg",
            onChange: handleBgVideoUpload,
          }),
          h("div", { className: "small" }, T.backgroundVideoHint)
        ),

      h(
        "div",
        { className: "row mt-4" },
        h(
          "button",
          {
            className: "btn",
            disabled: savingInfo,
            onClick: saveInfo,
          },
          savingInfo ? T.savingButton : T.saveButton
        ),

        (infoMsg || msg) && h("div", { className: "small" }, infoMsg || msg)
      )
    )
  );

  const PageIcons = Card(T.tabs.icons, h(IconsTab, { langs, uiLang }));
  const PageBrands = Card(T.tabs.brands, h(BrandsTab, { langs, uiLang }));
  const PageBrandInfo = Card(
    T.tabs.brandinfo,
    h(BrandInfoTab, { langs, uiLang })
  );
  const PageShare = Card(
    T.tabs.share,
    h(ShareTab, { cardId, info, uiLang })
  );
  const PagePassword = Card(
    T.tabs.password,
    h(PasswordTab, { token, uiLang })
  );

  const pages = {
    home: PageHome,
    icons: PageIcons,
    brands: PageBrands,
    brandinfo: PageBrandInfo,
    share: PageShare,
    password: PagePassword,
  };

  const TITLE_MAP = {
    home: T.tabs.home,
    icons: T.tabs.icons,
    brands: T.tabs.brands,
    brandinfo: T.tabs.brandinfo,
    share: T.tabs.share,
    password: T.tabs.password,
  };
  const headerTitle = `${T.headerAdminPrefix} • ${
    TITLE_MAP[tab] || T.tabs.home
  }`;

  const bodyContent = !token
    ? Card(T.needLoginTitle, T.needLoginBody)
    : loading
    ? Card(T.loading)
    : pages[tab] || PageHome;

  return h(
    PhoneShell,
    { title: headerTitle, light: true },
    showMenu &&
      h("div", {
        className: "menu-backdrop",
        onClick: () => setShowMenu(false),
      }),
    bodyContent
  );
}
