// client/src/pages/tabs/ShareTab.js
import React from "react";
import { adminSaveInfo } from "../../api.js";
const h = React.createElement;

/* ---------- CONSTANTS ---------- */
// ՄԻՇՏ լիարժեք https domain, վերջում մի հատ "/"-ով
const ONLINE_BASE = "https://khcontactum.com/"; // fixed, non-editable

/* ---------- UI TEXT BY LANGUAGE ---------- */
const SHARE_UI_TEXT = {
  am: {
    onlineTitle: "Online QR · Հղում",
    onlineLabel: "Քարտի public link-ը",
    onlineHelp: "Հիմքը անփոփոխ է, մուտքագրեք միայն card_id / path-ը։",

    offlineTitle: "Offline QR & Կոնտակտներ",
    offlineIntro:
      "Այս տվյալները կօգտագործվեն offline QR կոդի և “Ավելացրեք ինձ կոնտակտների ցանկում” կոճակի համար։",

    fullNameLabel: "Անուն, ազգանուն",
    phoneLabel: "Հեռախոս",
    phonePlaceholder: "+374...",

    quickTitle: "Արագ կիսվելու ձևեր",
    quickIntro: "Ընտրիր՝ որ icon-ները երևան կիսվելու հատվածում։",

    colorsTitle: "Գույներ",
    colorBtnText: "Կոճակի տեքստի գույնը",
    colorBtnBg: "Կոճակի ֆոնի գույնը",
    colorShareTitle: "“Կիսվել իմ քարտով” տեքստի գույնը",

    saveButton: "Պահել",
    savingButton: "Պահվում է...",
    msgNoToken: "Token չկա, նորից login արեք",
    msgSaveOk: "Պահվեց ✅",
    msgSaveError: "Սխալ պահելիս",
    pathReset: "Վերակայել card_id-ով",
    pathInvalid: "Սխալ path․ միայն թվեր/սիմվոլներ, բացակայեն բացատները։",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  ru: {
    onlineTitle: "Online QR · Ссылка",
    onlineLabel: "Публичная ссылка на карточку",
    onlineHelp:
      "База фиксирована, введите только card_id / путь.",

    offlineTitle: "Offline QR и контакты",
    offlineIntro:
      "Эти данные будут использованы для офлайн QR-кода и кнопки «Добавьте меня в список контактов».",

    fullNameLabel: "Имя, фамилия",
    phoneLabel: "Телефон",
    phonePlaceholder: "+7...",

    quickTitle: "Способы быстрого шаринга",
    quickIntro:
      "Выберите, какие иконки будут отображаться в блоке шаринга.",

    colorsTitle: "Цвета",
    colorBtnText: "Цвет текста кнопки",
    colorBtnBg: "Цвет фона кнопки",
    colorShareTitle: "Цвет текста «Поделиться моей карточкой»",

    saveButton: "Сохранить",
    savingButton: "Сохранение...",
    msgNoToken: "Нет токена, войдите заново",
    msgSaveOk: "Сохранено ✅",
    msgSaveError: "Ошибка при сохранении",
    pathReset: "Сбросить на card_id",
    pathInvalid:
      "Неверный путь: только символы/цифры, без пробелов.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  en: {
    onlineTitle: "Online QR · Link",
    onlineLabel: "Public link of the card",
    onlineHelp:
      "Base is fixed. Enter only your card_id / path.",

    offlineTitle: "Offline QR & Contacts",
    offlineIntro:
      "These details will be used for the offline QR code and the “Add me to the contact list” button.",

    fullNameLabel: "Full name",
    phoneLabel: "Phone",
    phonePlaceholder: "+1...",

    quickTitle: "Quick share options",
    quickIntro: "Choose which icons will appear in the share section.",

    colorsTitle: "Colors",
    colorBtnText: "Button text color",
    colorBtnBg: "Button background color",
    colorShareTitle: "“Share my card” text color",

    saveButton: "Save",
    savingButton: "Saving...",
    msgNoToken: "No token, please log in again",
    msgSaveOk: "Saved ✅",
    msgSaveError: "Error while saving",
    pathReset: "Reset to card_id",
    pathInvalid:
      "Invalid path: letters/numbers/-/_ only, no spaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  ar: {
    onlineTitle: "رمز QR أونلاين · الرابط",
    onlineLabel: "الرابط العلني للبطاقة",
    onlineHelp:
      "الأساس ثابت. أدخِل فقط card_id / المسار.",

    offlineTitle: "رمز QR أوفلاين وجهات الاتصال",
    offlineIntro:
      "سيتم استخدام هذه البيانات لرمز QR الأوفلاين وزر «أضِفني إلى قائمة جهات الاتصال».",

    fullNameLabel: "الاسم الكامل",
    phoneLabel: "رقم الهاتف",
    phonePlaceholder: "+971...",

    quickTitle: "طرق المشاركة السريعة",
    quickIntro: "اختر الأيقونات التي ستظهر في قسم المشاركة.",

    colorsTitle: "الألوان",
    colorBtnText: "لون نص الزر",
    colorBtnBg: "لون خلفية الزر",
    colorShareTitle: "لون نص «مشاركة بطاقتي»",

    saveButton: "حفظ",
    savingButton: "جارٍ الحفظ...",
    msgNoToken: "لا يوجد رمز (token)، يرجى تسجيل الدخول مرة أخرى",
    msgSaveOk: "تم الحفظ ✅",
    msgSaveError: "حدث خطأ أثناء الحفظ",
    pathReset: "إعادة إلى card_id",
    pathInvalid:
      "مسار غير صالح: أحرف/أرقام/-/_ فقط، بلا مسافات.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  fr: {
    onlineTitle: "QR en ligne · Lien",
    onlineLabel: "Lien public de la carte",
    onlineHelp:
      "La base est fixe. Saisissez uniquement votre card_id / chemin.",

    offlineTitle: "QR hors ligne & Contacts",
    offlineIntro:
      "Ces informations seront utilisées pour le QR hors ligne et le bouton « Ajoutez-moi à la liste de contacts ».",

    fullNameLabel: "Nom et prénom",
    phoneLabel: "Téléphone",
    phonePlaceholder: "+33...",

    quickTitle: "Modes de partage rapide",
    quickIntro:
      "Choisissez quelles icônes apparaîtront dans la section de partage.",

    colorsTitle: "Couleurs",
    colorBtnText: "Couleur du texte du bouton",
    colorBtnBg: "Couleur de fond du bouton",
    colorShareTitle:
      "Couleur du texte « Partager ma carte »",

    saveButton: "Enregistrer",
    savingButton: "Enregistrement...",
    msgNoToken: "Pas de jeton, veuillez vous reconnecter",
    msgSaveOk: "Enregistré ✅",
    msgSaveError: "Erreur lors de l’enregistrement",
    pathReset: "Réinitialiser avec card_id",
    pathInvalid:
      "Chemin invalide : lettres/chiffres/-/_ uniquement, pas d’espaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },

  kz: {
    onlineTitle: "Online QR · Сілтеме",
    onlineLabel: "Картаңыздың public сілтемесі",
    onlineHelp:
      "Базалық бөлігі өзгермейді. Тек card_id / path енгізіңіз.",

    offlineTitle: "Offline QR және контакттер",
    offlineIntro:
      "Бұл деректер офлайн QR-код және «Контакт тізіміне қосыңыз» батырмасы үшін қолданылады.",

    fullNameLabel: "Аты-жөні",
    phoneLabel: "Телефон",
    phonePlaceholder: "+7...",

    quickTitle: "Жылдам бөлісу тәсілдері",
    quickIntro:
      "Шеринг блоктарында қай иконкалар көрінетінін таңдаңыз.",

    colorsTitle: "Түстер",
    colorBtnText: "Батырма мәтінінің түсі",
    colorBtnBg: "Батырма фонының түсі",
    colorShareTitle: "«Менің картаммен бөлісу» мәтінінің түсі",

    saveButton: "Сақтау",
    savingButton: "Сақталуда...",
    msgNoToken: "Token жоқ, қайтадан кіріңіз",
    msgSaveOk: "Сақталды ✅",
    msgSaveError: "Сақтау кезінде қате кетті",
    pathReset: "card_id арқылы қалпына келтіру",
    pathInvalid:
      "Қате path: тек әріп/сан/-/_ рұқсат, бос орынсыз.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },

  chn: {
    onlineTitle: "在线 QR · 链接",
    onlineLabel: "名片的公开链接",
    onlineHelp:
      "前缀是固定的，只需输入 card_id / 自定义路径即可。",

    offlineTitle: "离线 QR 与联系人",
    offlineIntro:
      "这些信息将用于离线二维码以及“添加到联系人”按钮。",

    fullNameLabel: "姓名",
    phoneLabel: "电话",
    phonePlaceholder: "+86...",

    quickTitle: "快速分享方式",
    quickIntro: "选择在分享区域显示哪些图标。",

    colorsTitle: "颜色",
    colorBtnText: "按钮文字颜色",
    colorBtnBg: "按钮背景颜色",
    colorShareTitle: "“分享我的名片”文字颜色",

    saveButton: "保存",
    savingButton: "正在保存...",
    msgNoToken: "没有 token，请重新登录",
    msgSaveOk: "已保存 ✅",
    msgSaveError: "保存时出错",
    pathReset: "重置为 card_id",
    pathInvalid:
      "路径无效：仅限字母/数字/-/_，不能包含空格。",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },

  de: {
    onlineTitle: "Online QR · Link",
    onlineLabel: "Public link of the card",
    onlineHelp:
      "Base is fixed. Enter only your card_id / path.",

    offlineTitle: "Offline QR & Contacts",
    offlineIntro:
      "These details will be used for the offline QR code and the “Add me to the contact list” button.",

    fullNameLabel: "Full name",
    phoneLabel: "Phone",
    phonePlaceholder: "+1...",

    quickTitle: "Quick share options",
    quickIntro: "Choose which icons will appear in the share section.",

    colorsTitle: "Colors",
    colorBtnText: "Button text color",
    colorBtnBg: "Button background color",
    colorShareTitle: "“Share my card” text color",

    saveButton: "Save",
    savingButton: "Saving...",
    msgNoToken: "No token, please log in again",
    msgSaveOk: "Saved ✅",
    msgSaveError: "Error while saving",
    pathReset: "Reset to card_id",
    pathInvalid:
      "Invalid path: letters/numbers/-/_ only, no spaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },

  es: {
    onlineTitle: "Online QR · Link",
    onlineLabel: "Public link of the card",
    onlineHelp:
      "Base is fixed. Enter only your card_id / path.",

    offlineTitle: "Offline QR & Contacts",
    offlineIntro:
      "These details will be used for the offline QR code and the “Add me to the contact list” button.",

    fullNameLabel: "Full name",
    phoneLabel: "Phone",
    phonePlaceholder: "+1...",

    quickTitle: "Quick share options",
    quickIntro: "Choose which icons will appear in the share section.",

    colorsTitle: "Colors",
    colorBtnText: "Button text color",
    colorBtnBg: "Button background color",
    colorShareTitle: "“Share my card” text color",

    saveButton: "Save",
    savingButton: "Saving...",
    msgNoToken: "No token, please log in again",
    msgSaveOk: "Saved ✅",
    msgSaveError: "Error while saving",
    pathReset: "Reset to card_id",
    pathInvalid:
      "Invalid path: letters/numbers/-/_ only, no spaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },

  it: {
    onlineTitle: "Online QR · Link",
    onlineLabel: "Public link of the card",
    onlineHelp:
      "Base is fixed. Enter only your card_id / path.",

    offlineTitle: "Offline QR & Contacts",
    offlineIntro:
      "These details will be used for the offline QR code and the “Add me to the contact list” button.",

    fullNameLabel: "Full name",
    phoneLabel: "Phone",
    phonePlaceholder: "+1...",

    quickTitle: "Quick share options",
    quickIntro: "Choose which icons will appear in the share section.",

    colorsTitle: "Colors",
    colorBtnText: "Button text color",
    colorBtnBg: "Button background color",
    colorShareTitle: "“Share my card” text color",

    saveButton: "Save",
    savingButton: "Saving...",
    msgNoToken: "No token, please log in again",
    msgSaveOk: "Saved ✅",
    msgSaveError: "Error while saving",
    pathReset: "Reset to card_id",
    pathInvalid:
      "Invalid path: letters/numbers/-/_ only, no spaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },

  fa: {
    onlineTitle: "Online QR · Link",
    onlineLabel: "Public link of the card",
    onlineHelp:
      "Base is fixed. Enter only your card_id / path.",

    offlineTitle: "Offline QR & Contacts",
    offlineIntro:
      "These details will be used for the offline QR code and the “Add me to the contact list” button.",

    fullNameLabel: "Full name",
    phoneLabel: "Phone",
    phonePlaceholder: "+1...",

    quickTitle: "Quick share options",
    quickIntro: "Choose which icons will appear in the share section.",

    colorsTitle: "Colors",
    colorBtnText: "Button text color",
    colorBtnBg: "Button background color",
    colorShareTitle: "“Share my card” text color",

    saveButton: "Save",
    savingButton: "Saving...",
    msgNoToken: "No token, please log in again",
    msgSaveOk: "Saved ✅",
    msgSaveError: "Error while saving",
    pathReset: "Reset to card_id",
    pathInvalid:
      "Invalid path: letters/numbers/-/_ only, no spaces.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
  },
  geo: {
  onlineTitle: "ონლაინ QR · ბმული",
  onlineLabel: "ბარათის საჯარო ბმული",
  onlineHelp:
    "ბაზა ფიქსირებულია. შეიყვანეთ მხოლოდ თქვენი card_id / path.",

  offlineTitle: "ოფლაინ QR და კონტაქტები",
  offlineIntro:
    "ეს მონაცემები გამოყენებული იქნება ოფლაინ QR კოდის და ღილაკის «კონტაქტებში დამატება»თვის.",

  fullNameLabel: "სრული სახელი",
  phoneLabel: "ტელეფონი",
  phonePlaceholder: "+995...",

  quickTitle: "სწრაფი გაზიარების პარამეტრები",
  quickIntro: "აირჩიეთ, რომელი 아이კონები გამოჩნდება გაზიარების განყოფილებაში.",

  colorsTitle: "ფერები",
  colorBtnText: "ღილაკის ტექსტის ფერი",
  colorBtnBg: "ღილაკის ფონის ფერი",
  colorShareTitle: "„ჩემი ბარათის გაზიარება“ ტექსტის ფერი",

  saveButton: "შენახვა",
  savingButton: "ინახება...",
  msgNoToken: "ტოკენი ვერ მოიძებნა, გთხოვთ ხელახლა შეხვიდეთ",
  msgSaveOk: "შენახულია ✅",
  msgSaveError: "შენახვის შეცდომა",
  pathReset: "card_id-ზე დაბრუნება",
  pathInvalid:
    "არასწორი path: ნებადართულია მხოლოდ ასოები / ციფრები / - / _, გარეშე სივრცეების.",

    channelLabels: {
      fb: "Facebook",
      tg: "Telegram",
      ln: "LinkedIn",
      wa: "WhatsApp",
      mail: "Email",
      viber: "Viber",
      ig: "Instagram",
    },
},
tr: {
  onlineTitle: "Çevrimiçi QR · Bağlantı",
  onlineLabel: "Kartın herkese açık bağlantısı",
  onlineHelp:
    "Temel bağlantı sabittir. Yalnızca card_id / yol kısmını girin.",

  offlineTitle: "Çevrimdışı QR ve Kişiler",
  offlineIntro:
    "Bu bilgiler, çevrimdışı QR kodu ve “Beni kişi listesine ekle” butonu için kullanılacaktır.",

  fullNameLabel: "Ad Soyad",
  phoneLabel: "Telefon",
  phonePlaceholder: "+90...",

  quickTitle: "Hızlı paylaşım seçenekleri",
  quickIntro: "Paylaşım bölümünde görünecek simgeleri seçin.",

  colorsTitle: "Renkler",
  colorBtnText: "Buton yazı rengi",
  colorBtnBg: "Buton arka plan rengi",
  colorShareTitle: "“Kartımı paylaş” yazı rengi",

  saveButton: "Kaydet",
  savingButton: "Kaydediliyor...",
  msgNoToken: "Token yok, lütfen tekrar giriş yapın",
  msgSaveOk: "Kaydedildi ✅",
  msgSaveError: "Kaydetme sırasında hata",
  pathReset: "card_id'ye sıfırla",
  pathInvalid:
    "Geçersiz yol: yalnızca harfler/rakamlar/-/_, boşluk yok.",

  channelLabels: {
    fb: "Facebook",
    tg: "Telegram",
    ln: "LinkedIn",
    wa: "WhatsApp",
    mail: "Email",
    viber: "Viber",
    ig: "Instagram",
  },
},


};

/* ---------- defaults & helpers ---------- */
const DEFAULT_QUICK = {
  fb: true,
  tg: true,
  ln: true,
  wa: true,
  mail: false,
  viber: false,
  ig: false,
};

function normalizeShare(raw, cardId) {
  const s = raw && typeof raw === "object" ? raw : {};
  const rawUrl = (s.onlineUrl || "").toString().trim();

  let path = "";
  if (rawUrl.startsWith(ONLINE_BASE)) {
    path = rawUrl.slice(ONLINE_BASE.length);
  } else if (rawUrl) {
    path = rawUrl.replace(/^https?:\/\/[^/]+\//i, "");
  }

  if (!path && cardId) path = String(cardId);

  const existingStyles = s.styles && typeof s.styles === "object" ? s.styles : {};
  const has = (key) =>
    existingStyles[key] != null && String(existingStyles[key]).trim() !== "";

  return {
    onlineUrl: rawUrl || (cardId ? ONLINE_BASE + cardId : ""),
    onlinePath: (s.onlinePath || path || "").toString().trim(),

    offlineFullName: (s.offlineFullName || "").toString().trim(),
    offlinePhone: (s.offlinePhone || "").toString().trim(),
    shareText: (s.shareText || "").toString().trim(),
    quick: Object.assign({}, DEFAULT_QUICK, s.quick || {}),
    styles: {
      ...existingStyles,
      btnTextColor: has("btnTextColor") ? String(existingStyles.btnTextColor).trim() : "#ffffff",
      btnBgColor: has("btnBgColor") ? String(existingStyles.btnBgColor).trim() : "#000000",
      shareTitleColor: has("shareTitleColor") ? String(existingStyles.shareTitleColor).trim() : "#000000",
    },
  };
}

function isValidPath(p) {
  if (!p) return false;
  if (/^https?:\/\//i.test(p)) return false;
  if (p.includes(" ")) return false;
  return /^[A-Za-z0-9\-_]+$/.test(p);
}

/* ---------- component ---------- */
const STYLE_DEFAULTS = { btnTextColor: "#ffffff", btnBgColor: "#000000", shareTitleColor: "#000000" };

export default function ShareTab({ cardId, info, uiLang = "am", onSaveSuccess }) {
  const T = SHARE_UI_TEXT[uiLang] || SHARE_UI_TEXT.am;

  const [share, setShare] = React.useState(
    () => normalizeShare(info && info.share, cardId)
  );
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    setShare(normalizeShare(info && info.share, cardId));
  }, [info, cardId]);

  function setField(key, value) {
    setShare((prev) => ({ ...prev, [key]: value }));
  }

  function setStyleColor(key, value) {
    setShare((prev) => ({
      ...prev,
      styles: { ...(prev.styles || {}), [key]: value },
    }));
  }

  function composeOnlineUrl(path) {
    const clean = String(path || "").replace(/^\/+/, "");
    return ONLINE_BASE + clean;
  }

  async function save() {
    const token =
      (typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("adminToken")) ||
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("adminToken")) ||
      "";
    if (!token) {
      setMsg(T.msgNoToken);
      return;
    }

    const path = share.onlinePath || "";
    if (!isValidPath(path)) {
      setMsg(T.pathInvalid);
      setTimeout(() => setMsg(""), 2000);
      return;
    }

    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...(info || {}),
        share: {
          ...share,
          onlineUrl: composeOnlineUrl(path),
        },
      };
      await adminSaveInfo(token, payload);
      setMsg(T.msgSaveOk);
      if (typeof onSaveSuccess === "function") {
        onSaveSuccess(payload);
      }
    } catch (e) {
      setMsg(e.message || T.msgSaveError);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  }

  function colorRow(label, key) {
    const fallback = STYLE_DEFAULTS[key] != null ? STYLE_DEFAULTS[key] : "#000000";
    const val = (share.styles && share.styles[key] != null && String(share.styles[key]).trim() !== "")
      ? String(share.styles[key]).trim()
      : fallback;
    const onChange = (v) => setStyleColor(key, (v != null && String(v).trim() !== "") ? String(v).trim() : fallback);

    return h(
      "label",
      { className: "block mb-3" },
      h("div", { className: "text-sm mb-1" }, label),
      h(
        "div",
        { className: "row", style: { alignItems: "center", gap: 8 } },
        h("input", {
          type: "color",
          value: val,
          onChange: (e) => onChange(e.target.value),
        }),
        h("input", {
          className: "input",
          style: { maxWidth: 160 },
          value: val,
          onChange: (e) => onChange(e.target.value),
        })
      )
    );
  }

  return h(
    // paddingBottom՝ որ fixed save-ը չծածկի content-ը
    "div",
    { style: { paddingTop: 16, paddingBottom: 80, position: "relative" } },

    h("h3", { className: "title mb-2" }, T.titleMain),

    // ONLINE LINK
    h("h4", { className: "title mb-1" }, T.onlineTitle),
    h(
      "label",
      { className: "block mb-2" },
      h("div", { className: "text-sm mb-1" }, T.onlineLabel),

      h(
        "div",
        {
          className: "row",
          style: {
            alignItems: "stretch",
            gap: 0,
          },
        },
        h(
          "span",
          {
            className: "input",
            style: {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              whiteSpace: "nowrap",
              userSelect: "text",
              background: "#f4f5f7",
              color: "#333",
            },
          },
          ONLINE_BASE
        ),
        h("input", {
          className: "input",
          style: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          value: share.onlinePath || "",
          placeholder: (cardId && String(cardId)) || "101",
          onChange: (e) =>
            setField("onlinePath", e.target.value.trim()),
        })
      ),
      h(
        "div",
        { className: "small", style: { opacity: 0.7, marginTop: 6 } },
        T.onlineHelp
      ),
      h(
        "div",
        { className: "row", style: { gap: 8, marginTop: 8 } },
        h(
          "button",
          {
            type: "button",
            className: "btn",
            onClick: () =>
              setField("onlinePath", cardId ? String(cardId) : ""),
          },
          T.pathReset
        ),
        h(
          "div",
          { className: "small", style: { opacity: 0.8 } },
          composeOnlineUrl(share.onlinePath || cardId || "101")
        )
      )
    ),

    // OFFLINE QR & CONTACTS
    h("h4", { className: "title mb-1" }, T.offlineTitle),
    h(
      "p",
      {
        className: "small mb-3",
        id: "offlineQRText",
        style: { maxWidth: 360 },
      },
      T.offlineIntro
    ),

    // միայն Phone դաշտը
    h(
      "label",
      { className: "block mb-4" },
      h("div", { className: "text-sm mb-1" }, T.phoneLabel),
      h("input", {
        className: "input",
        value: share.offlinePhone,
        placeholder: T.phonePlaceholder,
        onChange: (e) => setField("offlinePhone", e.target.value),
      })
    ),

    // COLORS
    h(
      "h4",
      { className: "title mb-1", style: { marginTop: 16 } },
      T.colorsTitle
    ),
    colorRow(T.colorBtnText, "btnTextColor"),
    colorRow(T.colorBtnBg, "btnBgColor"),

    // ===== FIXED SAVE BAR ներքևում (BrandsTab-ի նման) =====
    h(
      "div",
      {
        style: {
          position: "sticky",
          bottom: 0,
          marginTop: 16,
          paddingTop: 8,
          paddingBottom: 8,
          background:
            "linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.7))",
          zIndex: 5,
        },
      },
      h(
        "div",
        { className: "row", style: { alignItems: "center" } },
        h(
          "button",
          {
            type: "button",
            className: "btn",
            style: { flex: 1 },
            disabled: saving,
            onClick: save,
          },
          saving ? T.savingButton : T.saveButton
        ),
        msg &&
          h(
            "div",
            {
              className: "small",
              style: { marginLeft: 8, whiteSpace: "nowrap" },
            },
            msg
          )
      )
    )
  );
}
