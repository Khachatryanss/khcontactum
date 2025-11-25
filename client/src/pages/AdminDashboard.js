// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { adminMe, adminGetInfo, adminSaveInfo, uploadFile } from "../api.js";
import "./tabs/AdminResponcive.css"
import { fileUrl } from "../utils/fileUrl.js";
import IconsTab from "./tabs/IconsTab.js";
import BrandsTab from "./tabs/BrandsTab.js";
import PasswordTab from "./tabs/PasswordTab.js";
import BrandInfoTab from "./tabs/BrandInfoTab.js";
import ShareTab from "./tabs/ShareTab.js";

const h = React.createElement;

/* ---------- UI TEXT BY LANGUAGE ---------- */
const ADMIN_UI_TEXT = {
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

    defaultBadge: "Default",

    chooseFileLabel: "Ընտրել ֆայլ",
  },

  ru: {
    tabs: {
      home: "Главная",
      icons: "Иконки",
      brands: "Бренды",
      brandinfo: "Инфо о бренде",
      share: "Поделиться / QR",
      password: "Смена пароля",
    },
    logout: "ВЫХОД",
    headerAdminPrefix: "ADMIN",

    langsTitle: "ЯЗЫКИ",
    langsDescription:
      "Выберите активные языки и поменяйте порядок: первый будет языком по умолчанию на публичной странице.",

    avatarTitle: "AVATAR",
    typeLabel: "Тип",
    avatarTypeImage: "Изображение",
    avatarTypeVideo: "Видео",
    avatarImageUrlLabel: "Ссылка на аватар",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "Ссылка на видео-аватар",
    avatarVideoHint: "Макс. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "НАЗВАНИЕ КОМПАНИИ",
    nameColorLabel: "Цвет названия",

    descriptionTitle: "ОПИСАНИЕ",
    descriptionColorLabel: "Цвет описания",

    backgroundTitle: "ФОН",
    backgroundTypeColor: "Цвет",
    backgroundTypeImage: "Изображение",
    backgroundTypeVideo: "Видео",
    backgroundColorLabel: "Цвет фона",
    backgroundImageUrlLabel: "Ссылка на фон-картинку",
    backgroundVideoUrlLabel: "Ссылка на фон-видео",
    backgroundVideoHint: "Макс. 20 MB (mp4, webm, ogg)",

    saveButton: "Сохранить",
    savingButton: "Сохранение...",
    saveOk: "Сохранено ✅",
    saveError: "Ошибка при сохранении",

    needLoginTitle: "Требуется вход",
    needLoginBody: "Авторизуйтесь на странице /.",
    loading: "Загрузка…",

    defaultBadge: "По умолчанию",

    chooseFileLabel: "Выбрать файл",
  },

  en: {
    tabs: {
      home: "Home",
      icons: "Icons",
      brands: "Brands",
      brandinfo: "Brand Info",
      share: "Share / QR",
      password: "Change Password",
    },
    logout: "LOG OUT",
    headerAdminPrefix: "ADMIN",

    langsTitle: "LANGUAGES",
    langsDescription:
      "Select active languages and reorder them; the first one will be the default language on the public page.",

    avatarTitle: "AVATAR",
    typeLabel: "Type",
    avatarTypeImage: "Image",
    avatarTypeVideo: "Video",
    avatarImageUrlLabel: "Avatar Image URL",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "Avatar Video URL",
    avatarVideoHint: "Max 20 MB (mp4, webm, ogg)",

    companyNameTitle: "COMPANY NAME",
    nameColorLabel: "Name Color",

    descriptionTitle: "DESCRIPTION",
    descriptionColorLabel: "Description Color",

    backgroundTitle: "BACKGROUND",
    backgroundTypeColor: "Color",
    backgroundTypeImage: "Image",
    backgroundTypeVideo: "Video",
    backgroundColorLabel: "Background Color",
    backgroundImageUrlLabel: "Background Image URL",
    backgroundVideoUrlLabel: "Background Video URL",
    backgroundVideoHint: "Max 20 MB (mp4, webm, ogg)",

    saveButton: "Save",
    savingButton: "Saving...",
    saveOk: "Saved ✅",
    saveError: "Error while saving",

    needLoginTitle: "Login required",
    needLoginBody: "Please log in on the / page.",
    loading: "Loading…",

    defaultBadge: "Default",

    chooseFileLabel: "Choose File",
  },

  ar: {
    tabs: {
      home: "الصفحة الرئيسية",
      icons: "الأيقونات",
      brands: "العلامات التجارية",
      brandinfo: "معلومات العلامة",
      share: "مشاركة / QR",
      password: "تغيير كلمة المرور",
    },
    logout: "تسجيل الخروج",
    headerAdminPrefix: "ADMIN",

    langsTitle: "اللغات",
    langsDescription:
      "اختر اللغات النشطة وقم بتغيير الترتيب؛ الأول سيكون اللغة الافتراضية في الصفحة العامة.",

    avatarTitle: "الصورة (Avatar)",
    typeLabel: "النوع",
    avatarTypeImage: "صورة",
    avatarTypeVideo: "فيديو",
    avatarImageUrlLabel: "رابط صورة الـ Avatar",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "رابط فيديو الـ Avatar",
    avatarVideoHint: "الحد الأقصى 20MB ‏(mp4, webm, ogg)",

    companyNameTitle: "اسم الشركة",
    nameColorLabel: "لون الاسم",

    descriptionTitle: "الوصف",
    descriptionColorLabel: "لون الوصف",

    backgroundTitle: "الخلفية",
    backgroundTypeColor: "لون",
    backgroundTypeImage: "صورة",
    backgroundTypeVideo: "فيديو",
    backgroundColorLabel: "لون الخلفية",
    backgroundImageUrlLabel: "رابط صورة الخلفية",
    backgroundVideoUrlLabel: "رابط فيديو الخلفية",
    backgroundVideoHint: "الحد الأقصى 20MB ‏(mp4, webm, ogg)",

    saveButton: "حفظ",
    savingButton: "جاري الحفظ...",
    saveOk: "تم الحفظ ✅",
    saveError: "خطأ أثناء الحفظ",

    needLoginTitle: "مطلوب تسجيل الدخول",
    needLoginBody: "يرجى تسجيل الدخول من صفحة /.",
    loading: "جاري التحمیل…",

    defaultBadge: "افتراضي",

    chooseFileLabel: "اختر ملفًا",
  },

  fr: {
    tabs: {
      home: "Accueil",
      icons: "Icônes",
      brands: "Marques",
      brandinfo: "Infos marque",
      share: "Partager / QR",
      password: "Changer le mot de passe",
    },
    logout: "DÉCONNEXION",
    headerAdminPrefix: "ADMIN",

    langsTitle: "LANGUES",
    langsDescription:
      "Sélectionnez les langues actives et changez l’ordre ; la première sera la langue par défaut sur la page publique.",

    avatarTitle: "AVATAR",
    typeLabel: "Type",
    avatarTypeImage: "Image",
    avatarTypeVideo: "Vidéo",
    avatarImageUrlLabel: "URL de l’image avatar",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "URL de la vidéo avatar",
    avatarVideoHint: "Max 20 MB (mp4, webm, ogg)",

    companyNameTitle: "NOM DE L’ENTREPRISE",
    nameColorLabel: "Couleur du nom",

    descriptionTitle: "DESCRIPTION",
    descriptionColorLabel: "Couleur de la description",

    backgroundTitle: "ARRIÈRE-PLAN",
    backgroundTypeColor: "Couleur",
    backgroundTypeImage: "Image",
    backgroundTypeVideo: "Vidéo",
    backgroundColorLabel: "Couleur de fond",
    backgroundImageUrlLabel: "URL de l’image de fond",
    backgroundVideoUrlLabel: "URL de la vidéo de fond",
    backgroundVideoHint: "Max 20 MB (mp4, webm, ogg)",

    saveButton: "Enregistrer",
    savingButton: "Enregistrement...",
    saveOk: "Enregistré ✅",
    saveError: "Erreur lors de l’enregistrement",

    needLoginTitle: "Connexion requise",
    needLoginBody: "Connectez-vous sur la page /.",
    loading: "Chargement…",

    defaultBadge: "Par défaut",

    chooseFileLabel: "Choisir un fichier",
  },

  kz: {
    tabs: {
      home: "Басты бет",
      icons: "Икондар",
      brands: "Брендтер",
      brandinfo: "Бренд туралы",
      share: "Бөлісу / QR",
      password: "Құпиясөзді өзгерту",
    },
    logout: "ШЫҒУ",
    headerAdminPrefix: "ADMIN",

    langsTitle: "ТІЛДЕР",
    langsDescription:
      "Белсенді тілдерді таңдаңыз және ретін өзгертіңіз; біріншісі public бетінің әдепкі тілі болады.",

    avatarTitle: "AVATAR",
    typeLabel: "Түрі",
    avatarTypeImage: "Сурет",
    avatarTypeVideo: "Видео",
    avatarImageUrlLabel: "Avatar суретінің сілтемесі",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "Avatar видеосының сілтемесі",
    avatarVideoHint: "Макс. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "КОМПАНИЯ АТЫ",
    nameColorLabel: "Атаудың түсі",

    descriptionTitle: "СИПАТТАМА",
    descriptionColorLabel: "Сипаттаманың түсі",

    backgroundTitle: "ФОН",
    backgroundTypeColor: "Түс",
    backgroundTypeImage: "Сурет",
    backgroundTypeVideo: "Видео",
    backgroundColorLabel: "Фон түсі",
    backgroundImageUrlLabel: "Фон суретінің сілтемесі",
    backgroundVideoUrlLabel: "Фон видеосының сілтемесі",
    backgroundVideoHint: "Макс. 20 MB (mp4, webm, ogg)",

    saveButton: "Сақтау",
    savingButton: "Сақталуда...",
    saveOk: "Сақталды ✅",
    saveError: "Сақтау кезінде қате",

    needLoginTitle: "Кіру қажет",
    needLoginBody: "/ бетінде жүйеге кіріңіз.",
    loading: "Жүктелуде…",

    defaultBadge: "Әдепкі",

    chooseFileLabel: "Файл таңдау",
  },

  chn: {
    tabs: {
      home: "首页",
      icons: "图标",
      brands: "品牌",
      brandinfo: "品牌信息",
      share: "分享 / QR",
      password: "修改密码",
    },
    logout: "退出登录",
    headerAdminPrefix: "ADMIN",

    langsTitle: "语言",
    langsDescription:
      "选择启用的语言并调整顺序；第一个将作为公开页面的默认语言。",

    avatarTitle: "头像",
    typeLabel: "类型",
    avatarTypeImage: "图片",
    avatarTypeVideo: "视频",
    avatarImageUrlLabel: "头像图片链接",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "头像视频链接",
    avatarVideoHint: "最大 20 MB (mp4, webm, ogg)",

    companyNameTitle: "公司名称",
    nameColorLabel: "名称颜色",

    descriptionTitle: "描述",
    descriptionColorLabel: "描述颜色",

    backgroundTitle: "背景",
    backgroundTypeColor: "纯色",
    backgroundTypeImage: "图片",
    backgroundTypeVideo: "视频",
    backgroundColorLabel: "背景颜色",
    backgroundImageUrlLabel: "背景图片链接",
    backgroundVideoUrlLabel: "背景视频链接",
    backgroundVideoHint: "最大 20 MB (mp4, webm, ogg)",

    saveButton: "保存",
    savingButton: "保存中...",
    saveOk: "已保存 ✅",
    saveError: "保存时出错",

    needLoginTitle: "需要登录",
    needLoginBody: "请在 / 页面登录。",
    loading: "加载中…",

    defaultBadge: "默认",

    chooseFileLabel: "选择文件",
  },

  de: {
    tabs: {
      home: "Startseite",
      icons: "Symbole",
      brands: "Marken",
      brandinfo: "Markeninfo",
      share: "Teilen / QR",
      password: "Passwort ändern",
    },
    logout: "ABMELDEN",
    headerAdminPrefix: "ADMIN",

    langsTitle: "SPRACHEN",
    langsDescription:
      "Wähle aktive Sprachen aus und ändere die Reihenfolge; die erste ist die Standardsprache auf der öffentlichen Seite.",

    avatarTitle: "AVATAR",
    typeLabel: "Typ",
    avatarTypeImage: "Bild",
    avatarTypeVideo: "Video",
    avatarImageUrlLabel: "Avatar-Bild-URL",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "Avatar-Video-URL",
    avatarVideoHint: "Max. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "FIRMENNAME",
    nameColorLabel: "Farbe des Namens",

    descriptionTitle: "BESCHREIBUNG",
    descriptionColorLabel: "Farbe der Beschreibung",

    backgroundTitle: "HINTERGRUND",
    backgroundTypeColor: "Farbe",
    backgroundTypeImage: "Bild",
    backgroundTypeVideo: "Video",
    backgroundColorLabel: "Hintergrundfarbe",
    backgroundImageUrlLabel: "Hintergrundbild-URL",
    backgroundVideoUrlLabel: "Hintergrundvideo-URL",
    backgroundVideoHint: "Max. 20 MB (mp4, webm, ogg)",

    saveButton: "Speichern",
    savingButton: "Wird gespeichert...",
    saveOk: "Gespeichert ✅",
    saveError: "Fehler beim Speichern",

    needLoginTitle: "Anmeldung erforderlich",
    needLoginBody: "Bitte auf der / Seite anmelden.",
    loading: "Lädt…",

    defaultBadge: "Standard",

    chooseFileLabel: "Datei wählen",
  },

  es: {
    tabs: {
      home: "Inicio",
      icons: "Íconos",
      brands: "Marcas",
      brandinfo: "Info de marca",
      share: "Compartir / QR",
      password: "Cambiar contraseña",
    },
    logout: "SALIR",
    headerAdminPrefix: "ADMIN",

    langsTitle: "IDIOMAS",
    langsDescription:
      "Selecciona los idiomas activos y cambia el orden; el primero será el idioma predeterminado en la página pública.",

    avatarTitle: "AVATAR",
    typeLabel: "Tipo",
    avatarTypeImage: "Imagen",
    avatarTypeVideo: "Vídeo",
    avatarImageUrlLabel: "URL de imagen del avatar",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "URL de vídeo del avatar",
    avatarVideoHint: "Máx. 20 MB (mp4, webm, ogg)",

    companyNameTitle: "NOMBRE DE LA EMPRESA",
    nameColorLabel: "Color del nombre",

    descriptionTitle: "DESCRIPCIÓN",
    descriptionColorLabel: "Color de la descripción",

    backgroundTitle: "FONDO",
    backgroundTypeColor: "Color",
    backgroundTypeImage: "Imagen",
    backgroundTypeVideo: "Vídeo",
    backgroundColorLabel: "Color de fondo",
    backgroundImageUrlLabel: "URL de imagen de fondo",
    backgroundVideoUrlLabel: "URL de vídeo de fondo",
    backgroundVideoHint: "Máx. 20 MB (mp4, webm, ogg)",

    saveButton: "Guardar",
    savingButton: "Guardando...",
    saveOk: "Guardado ✅",
    saveError: "Error al guardar",

    needLoginTitle: "Se requiere inicio de sesión",
    needLoginBody: "Por favor inicia sesión en la página /.",
    loading: "Cargando…",

    defaultBadge: "Predeterminado",

    chooseFileLabel: "Elegir archivo",
  },

  it: {
    tabs: {
      home: "Home",
      icons: "Icone",
      brands: "Brand",
      brandinfo: "Info brand",
      share: "Condividi / QR",
      password: "Cambia password",
    },
    logout: "ESCI",
    headerAdminPrefix: "ADMIN",

    langsTitle: "LINGUE",
    langsDescription:
      "Seleziona le lingue attive e cambia l’ordine; la prima sarà la lingua predefinita nella pagina pubblica.",

    avatarTitle: "AVATAR",
    typeLabel: "Tipo",
    avatarTypeImage: "Immagine",
    avatarTypeVideo: "Video",
    avatarImageUrlLabel: "URL immagine avatar",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "URL video avatar",
    avatarVideoHint: "Max 20 MB (mp4, webm, ogg)",

    companyNameTitle: "NOME AZIENDA",
    nameColorLabel: "Colore del nome",

    descriptionTitle: "DESCRIZIONE",
    descriptionColorLabel: "Colore della descrizione",

    backgroundTitle: "SFONDO",
    backgroundTypeColor: "Colore",
    backgroundTypeImage: "Immagine",
    backgroundTypeVideo: "Video",
    backgroundColorLabel: "Colore di sfondo",
    backgroundImageUrlLabel: "URL immagine di sfondo",
    backgroundVideoUrlLabel: "URL video di sfondo",
    backgroundVideoHint: "Max 20 MB (mp4, webm, ogg)",

    saveButton: "Salva",
    savingButton: "Salvataggio...",
    saveOk: "Salvato ✅",
    saveError: "Errore durante il salvataggio",

    needLoginTitle: "Accesso richiesto",
    needLoginBody: "Effettua l’accesso nella pagina /.",
    loading: "Caricamento…",

    defaultBadge: "Default",

    chooseFileLabel: "Scegli file",
  },

  fa: {
    tabs: {
      home: "صفحه اصلی",
      icons: "آیکون‌ها",
      brands: "برندها",
      brandinfo: "اطلاعات برند",
      share: "اشتراک‌گذاری / QR",
      password: "تغییر رمز عبور",
    },
    logout: "خروج",
    headerAdminPrefix: "ADMIN",

    langsTitle: "زبان‌ها",
    langsDescription:
      "زبان‌های فعال را انتخاب کنید و ترتیب را تغییر دهید؛ اولین زبان، زبان پیش‌فرض صفحه عمومی خواهد بود.",

    avatarTitle: "آواتار",
    typeLabel: "نوع",
    avatarTypeImage: "تصویر",
    avatarTypeVideo: "ویدئو",
    avatarImageUrlLabel: "لینک تصویر آواتار",
    avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
    avatarVideoUrlLabel: "لینک ویدئوی آواتار",
    avatarVideoHint: "حداکثر ۲۰ مگابایت (mp4, webm, ogg)",

    companyNameTitle: "نام شرکت",
    nameColorLabel: "رنگ نام",

    descriptionTitle: "توضیحات",
    descriptionColorLabel: "رنگ توضیحات",

    backgroundTitle: "پس‌زمینه",
    backgroundTypeColor: "رنگ",
    backgroundTypeImage: "تصویر",
    backgroundTypeVideo: "ویدئو",
    backgroundColorLabel: "رنگ پس‌زمینه",
    backgroundImageUrlLabel: "لینک تصویر پس‌زمینه",
    backgroundVideoUrlLabel: "لینک ویدئوی پس‌زمینه",
    backgroundVideoHint: "حداکثر ۲۰ مگابایت (mp4, webm, ogg)",

    saveButton: "ذخیره",
    savingButton: "در حال ذخیره...",
    saveOk: "ذخیره شد ✅",
    saveError: "خطا هنگام ذخیره",

    needLoginTitle: "ورود لازم است",
    needLoginBody: "لطفاً در صفحه / وارد شوید.",
    loading: "در حال بارگذاری…",

    defaultBadge: "پیش‌فرض",

    chooseFileLabel: "انتخاب فایل",
  },
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

function LangSwitch({ active, onToggle }) {
  return React.createElement(
    "button",
    {
      type: "button",
      onClick: () => onToggle && onToggle(),
      "aria-pressed": active,
      style: {
        width: 42,
        height: 24,
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.15)",
        background: active ? "#111" : "#d1d1d1",
        position: "relative",
        cursor: "pointer",
        padding: 0,
        outline: "none",
      },
    },
    React.createElement("span", {
      style: {
        position: "absolute",
        top: 2,
        left: active ? 20 : 2,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,.3)",
        transition: "left 0.18s ease-out",
      },
    })
  );
}

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

  // UI լեզուների selector-ի համար (նույն տրամաբանությունը, ինչ AdminLogin-ում)
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

  const [langs, setLangs] = useState(["am", "ru", "en", "ar", "fr"]);
  const dragLangIndex = React.useRef(null);

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
      h("div", { className: "text-sm mb-1", id: "nkariBajin"}, label),
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

  function toggleLang(code) {
    setLangs((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  }

  function moveLang(code, dir) {
    setLangs((prev) => {
      const idx = prev.indexOf(code);
      if (idx === -1) return prev;
      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const arr = prev.slice();
      const [item] = arr.splice(idx, 1);
      arr.splice(nextIdx, 0, item);
      return arr;
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

        ALL_LANGS.map(({ code, label }) => {
          const active = langs.includes(code);
          const idx = langs.indexOf(code);
          const isActive = active && idx !== -1;

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
                borderRadius: 12,
                padding: "4px 4px",
                cursor: isActive ? "grab" : "default",
              },
              draggable: isActive,
              onDragStart: isActive
                ? () => {
                    dragLangIndex.current = idx;
                  }
                : undefined,
              onDragOver: isActive
                ? (e) => {
                    e.preventDefault();
                  }
                : undefined,
              onDrop: isActive
                ? (e) => {
                    e.preventDefault();
                    const from = dragLangIndex.current;
                    if (from == null) return;

                    setLangs((prev) => {
                      const to = prev.indexOf(code);
                      if (to === -1 || from === to) return prev;
                      if (from < 0 || from >= prev.length) return prev;
                      const arr = prev.slice();
                      const [moved] = arr.splice(from, 1);
                      arr.splice(to, 0, moved);
                      return arr;
                    });

                    dragLangIndex.current = null;
                  }
                : undefined,
            },

            // language code pill (no toggle here)
            h(
              "div",
              {
                style: {
                  padding: "2px 10px",
                  width: 60,
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: active ? "#111" : "#b3b3b3",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  textAlign: "center",
                  letterSpacing: 0.5,
                },
              },
              code.toUpperCase()
            ),

            // language label
            h(
              "span",
              {
                style: {
                  flex: 1,
                  fontSize: "14px",
                  fontFamily: "revert-layer",
                  width: 100,
                  paddingLeft: 8,
                },
              },
              label
            ),

            // default badge (no numeric #1, #2…)
            active && idx === 0
              ? h(
                  "span",
                  {
                    className: "small",
                    style: {
                      minWidth: 60,
                      fontSize: "13px",
                      opacity: 0.8,
                      marginRight: 6,
                    },
                  },
                  T.defaultBadge
                )
              : h("span", { style: { width: 60 } }, ""),

            // on/off switch for active / inactive
            h(
              "div",
              { style: { marginLeft: 6 } },
              h(LangSwitch, {
                active,
                onToggle: () => toggleLang(code),
              })
            )
          );
        })
      ),

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
            { placeholder: "https://..."}
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
          (code === "ar" || code === "fa")
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

      /* ✅ COMPANY NAME COLOR — FIXED */
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
          (code === "ar" || code === "fa")
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

      /* ✅ DESCRIPTION COLOR — FIXED */
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

      /* ✅ BACKGROUND COLOR — FIXED */
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
