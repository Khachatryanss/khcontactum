// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { adminMe, adminGetInfo, adminSaveInfo, uploadFile } from "../api.js";
import "./tabs/AdminResponcive.css";
import { getFileUrl } from "../utils/fileUrl.js";
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
    avatarZoomLabel: "Zoom",

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
    loading: "جاري التحميل…",

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

    chooseFileLabel: "انتخاب فایل",
  },
  geo: {
  tabs: {
    home: "მთავარი",
    icons: "아이კონები",
    brands: "ბრენდები",
    brandinfo: "ბრენდის ინფორმაცია",
    share: "გაზიარება / QR",
    password: "პაროლის შეცვლა",
  },
  logout: "გასვლა",
  headerAdminPrefix: "ADMIN",

  langsTitle: "ენები",
  langsDescription:
    "აირჩიეთ აქტიური ენები და შეცვალეთ მათი რიგითობა; პირველი ენა იქნება ნაგულისხმევი საჯარო გვერდზე.",

  avatarTitle: "AVATAR",
  typeLabel: "ტიპი",
  avatarTypeImage: "სურათი",
  avatarTypeVideo: "ვიდეო",
  avatarImageUrlLabel: "ავატარის სურათის ბმული",
  avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
  avatarVideoUrlLabel: "ავატარის ვიდეოს ბმული",
  avatarVideoHint: "მაქს. 20 MB (mp4, webm, ogg)",

  companyNameTitle: "კომპანიის სახელი",
  nameColorLabel: "სახელის ფერი",

  descriptionTitle: "აღწერა",
  descriptionColorLabel: "აღწერის ფერი",

  backgroundTitle: "ფონი",
  backgroundTypeColor: "ფერი",
  backgroundTypeImage: "სურათი",
  backgroundTypeVideo: "ვიდეო",
  backgroundColorLabel: "ფონის ფერი",
  backgroundImageUrlLabel: "ფონის სურათის ბმული",
  backgroundVideoUrlLabel: "ფონის ვიდეოს ბმული",
  backgroundVideoHint: "მაქს. 20 MB (mp4, webm, ogg)",

  saveButton: "შენახვა",
  savingButton: "ინახება...",
  saveOk: "შენახულია ✅",
  saveError: "შენახვის შეცდომა",

  needLoginTitle: "საჭიროა ავტორიზაცია",
  needLoginBody: "გთხოვთ შეხვიდეთ / გვერდზე.",
  loading: "იტვირთება…",

  chooseFileLabel: "ფაილის არჩევა",
},
tr: {
  tabs: {
    home: "Ana Sayfa",
    icons: "Simgeler",
    brands: "Markalar",
    brandinfo: "Marka Bilgisi",
    share: "Paylaş / QR",
    password: "Şifre Değiştir",
  },
  logout: "ÇIKIŞ",
  headerAdminPrefix: "ADMIN",

  langsTitle: "DİLLER",
  langsDescription:
    "Aktif dilleri seçin ve sıralamayı değiştirin; ilk dil, herkese açık sayfadaki varsayılan dil olacaktır.",

  avatarTitle: "AVATAR",
  typeLabel: "Tür",
  avatarTypeImage: "Görsel",
  avatarTypeVideo: "Video",
  avatarImageUrlLabel: "Avatar Görsel URL",
  avatarImageHint: "(PNG / JPG / JPEG / WEBP / GIF)",
  avatarVideoUrlLabel: "Avatar Video URL",
  avatarVideoHint: "Maks. 20 MB (mp4, webm, ogg)",

  companyNameTitle: "ŞİRKET ADI",
  nameColorLabel: "Ad Rengi",

  descriptionTitle: "AÇIKLAMA",
  descriptionColorLabel: "Açıklama Rengi",

  backgroundTitle: "ARKA PLAN",
  backgroundTypeColor: "Renk",
  backgroundTypeImage: "Görsel",
  backgroundTypeVideo: "Video",
  backgroundColorLabel: "Arka Plan Rengi",
  backgroundImageUrlLabel: "Arka Plan Görsel URL",
  backgroundVideoUrlLabel: "Arka Plan Video URL",
  backgroundVideoHint: "Maks. 20 MB (mp4, webm, ogg)",

  saveButton: "Kaydet",
  savingButton: "Kaydediliyor...",
  saveOk: "Kaydedildi ✅",
  saveError: "Kaydederken hata",

  needLoginTitle: "Giriş gerekli",
  needLoginBody: "Lütfen / sayfasından giriş yapın.",
  loading: "Yükleniyor…",

  chooseFileLabel: "Dosya Seç",
},
};

const DEFAULT_INFO = {
  logo_url: "",
  avatar: { type: "image", imageUrl: "", videoUrl: "", zoom: 1 },

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
      geo: "",
      tr: "",
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
    geo: "",
    tr: "",
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
  { code: "geo", label: "ქართული (GEO)" },
  { code: "tr", label: "Türkçe (TR)" },
];
const ALL_CODES = ALL_LANGS.map((x) => x.code);

// always return full shape + back-compat mapping
function normalizeInfo(partial) {
  const i = partial || {};
  const zoomRaw = i.avatar?.zoom;
  const zoom =
    typeof zoomRaw === "number" && zoomRaw >= 0.8 && zoomRaw <= 2
      ? zoomRaw
      : Math.min(2, Math.max(0.8, Number(zoomRaw) || 1));
  const avatar = {
    type: i.avatar?.type || (i.logo_url ? "image" : "image"),
    imageUrl: i.avatar?.imageUrl || i.logo_url || "",
    videoUrl: i.avatar?.videoUrl || "",
    zoom,
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
        geo: i.company?.name?.geo || "",
        tr: i.company?.name?.tr || "",
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
      geo: i.description?.geo || "",
      tr: i.description?.tr || "",
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

    // preserve array fields so Brands/BrandInfo tabs get saved image data on load
    brands: Array.isArray(i.brands) ? i.brands : undefined,
    brandInfos: Array.isArray(i.brandInfos) ? i.brandInfos : undefined,
  };
}

/* ---------- Reusable file button (translated) ---------- */
function FileButton({ label, accept, onChange, style }) {
  const inputRef = React.useRef(null);
  return h(
    React.Fragment,
    null,
    h(
      "button",
      {
        type: "button",
        className: "btn",
        style,
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

/* ------- Avatar / Background circle preview ------- */
function CirclePreview(src, kind, imageZoom = 1) {
  const isImageWithZoom = src && kind === "image" && imageZoom !== 1;
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
        : isImageWithZoom
        ? h(
            "div",
            {
              style: {
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
              },
            },
            h("img", {
              src,
              alt: "preview",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${imageZoom})`,
              },
            })
          )
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

/* ------- Unified row for URL + Choose file + hint ------- */
function MediaUploadRow({
  label,
  hint,
  urlValue,
  onUrlChange,
  onFileChange,
  previewSrc,
  kind = "image",
  fileLabel,
  accept,
  placeholder,
  imageZoom,
  underPreview,
}) {
  const previewCell = underPreview
    ? h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            flex: "0 0 auto",
          },
        },
        CirclePreview(previewSrc, kind, imageZoom),
        underPreview
      )
    : CirclePreview(previewSrc, kind, imageZoom);
  return h(
    "div",
    {
      className: "mb-4",
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      },
    },
    previewCell,
    h(
      "div",
      null,
      h("div", { className: "text-sm mb-1" }, label),
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto",
            gap: 8,
            alignItems: "center",
          },
        },
        h("input", {
          className: "input",
          id: "nkarInput",
          value: urlValue || "",
          onChange: (e) => onUrlChange && onUrlChange(e.target.value),
          placeholder: placeholder || "",
        }),
        h(FileButton, {
          label: fileLabel,
          accept,
          onChange: onFileChange,
          style: {
            minWidth: 110,
            height: 36,
            padding: "0 16px",
            fontSize: 13,
            fontWeight: 600,
          },
        })
      ),
      hint &&
        h(
          "div",
          {
            className: "small",
            style: { marginTop: 4, fontSize: 11, opacity: 0.8 },
          },
          hint
        )
    )
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
  
  const [me, setMe] = useState(null);

  const allowTR = Boolean(me?.allow_tr);
  // UI լեզուների selector
const UI_LANGS = allowTR
  ? ["en", "am", "fr", "ar", "ru", "kz", "chn", "de", "es", "it", "fa", "geo", "tr"]
  : ["en", "am", "fr", "ar", "ru", "kz", "chn", "de", "es", "it", "fa", "geo"];

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



const EFFECTIVE_LANGS = allowTR
  ? ALL_LANGS
  : ALL_LANGS.filter((x) => x.code !== "tr");

const EFFECTIVE_CODES = EFFECTIVE_LANGS.map((x) => x.code);



  const [cardId, setCardId] = useState(null);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const [langs, setLangs] = useState(["am", "ru", "en", "ar", "fr"]);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState("");
  const [bgVideoPreview, setBgVideoPreview] = useState("");

  // նոր state — Home tab–ի unsaved փոփոխությունները track անելու համար
  const [homeDirty, setHomeDirty] = useState(false);

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
? rawAvail.filter((code) => EFFECTIVE_CODES.includes(code))
    : ["en"];

const def =
root.default_lang && EFFECTIVE_CODES.includes(root.default_lang)
    ? root.default_lang
    : "en";

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

        // if (!langsArr.length) langsArr = ["am"];
        if (!allowTR) {
  langsArr = langsArr.filter((c) => c !== "tr");
}

        setLangs(langsArr);
        setHomeDirty(false);
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

  // Home tab-ի դաշտերը լոկալ state-ում ենք պահում, ամեն փոփոխությունից հետո միայն mark ենք անում dirty=true
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
    setHomeDirty(true);
  }

  async function saveInfo() {
    setSavingInfo(true);
    setInfoMsg("");
    try {
      const payload = normalizeInfo(info);
      payload.available_langs = langs;
      // ✅ default_lang-ը առաջին լեզուն է (langs[0]), fallback՝ "en"
      payload.default_lang = langs[0] || "en";

      await adminSaveInfo(token, payload);
      setInfoMsg(T.saveOk);
      setHomeDirty(false);
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

      const urlFromRes =
        res?.url ||
        (isVid
          ? res?.information?.avatar?.videoUrl
          : res?.information?.avatar?.imageUrl) ||
        "";

      if (!urlFromRes) {
        setInfoMsg("Upload succeeded, but URL is missing");
        return;
      }

      if (isVid) {
        setInfoPath("avatar.videoUrl", urlFromRes);
      } else {
        setInfoPath("avatar.imageUrl", urlFromRes);
        setInfoPath("logo_url", urlFromRes);
      }

      setHomeDirty(true);
      setInfoMsg(isVid ? "Avatar video ✔" : "Avatar image ✔)");
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
      const urlFromRes =
        res?.url || res?.information?.background?.imageUrl || "";

      if (!urlFromRes) {
        setInfoMsg("Upload succeeded, but URL is missing");
        return;
      }

      setInfoPath("background.imageUrl", urlFromRes);
      setInfoPath("background.type", "image");
      setHomeDirty(true);
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
      const urlFromRes =
        res?.url || res?.information?.background?.videoUrl || "";

      if (!urlFromRes) {
        setInfoMsg("Upload succeeded, but URL is missing");
        return;
      }

      setInfoPath("background.videoUrl", urlFromRes);
      setInfoPath("background.type", "video");
      setHomeDirty(true);
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
      return next;
    });
    setAvatarPreview("");
    setHomeDirty(true);
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
    setHomeDirty(true);
  }

  function toggleLang(code) {
    setLangs((prev) => {
      const exists = prev.includes(code);
      let next;
      if (exists) {
        if (prev.length === 1) return prev;
        next = prev.filter((c) => c !== code);
      } else {
        next = [...prev, code];
      }
      return next;
    });
    setHomeDirty(true);
  }

  // վերև / ներքև reorder (օգտագործում ենք սլաքների համար)
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
    setHomeDirty(true);
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

EFFECTIVE_LANGS.map(({ code, label }) => {
          const orderIndex = langs.indexOf(code);
          const active = orderIndex !== -1;
          const orderLabel = active ? `#${orderIndex + 1}` : "—";

          const upDisabled = !active || orderIndex === 0;
          const downDisabled =
            !active || orderIndex === langs.length - 1;

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

            // full label
            h(
              "span",
              {
                style: {
                  flex: 1,
                  fontSize: "14px",
                  fontFamily: "revert-layer",
                  width: 100,
                  paddingLeft: 6,
                },
              },
              label
            ),

            // order label (#1, #2, ...)
            h(
              "span",
              {
                style: {
                  minWidth: 32,
                  fontSize: "13px",
                  opacity: 0.8,
                  textAlign: "right",
                  marginRight: 6,
                },
              },
              orderLabel
            ),

            // up / down arrows
            h(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginRight: 6,
                },
              },
              h(
                "button",
                {
                  type: "button",
                  disabled: upDisabled,
                  onClick: () => !upDisabled && moveLang(code, "up"),
                  style: {
                    width: 22,
                    height: 16,
                    borderRadius: 4,
                    border: "none",
                    fontSize: 11,
                    lineHeight: 1,
                    cursor: upDisabled ? "default" : "pointer",
                    opacity: upDisabled ? 0.3 : 0.9,
                  },
                },
                "▲"
              ),
              h(
                "button",
                {
                  type: "button",
                  disabled: downDisabled,
                  onClick: () => !downDisabled && moveLang(code, "down"),
                  style: {
                    width: 22,
                    height: 16,
                    borderRadius: 4,
                    border: "none",
                    fontSize: 11,
                    lineHeight: 1,
                    cursor: downDisabled ? "default" : "pointer",
                    opacity: downDisabled ? 0.3 : 0.9,
                  },
                },
                "▼"
              )
            ),

            // active / inactive switch
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
        h(MediaUploadRow, {
          label: T.avatarImageUrlLabel,
          hint: T.avatarImageHint,
          urlValue: info?.avatar?.imageUrl || info.logo_url || "",
          onUrlChange: (v) => {
            setInfoPath("avatar.imageUrl", v);
            setInfoPath("logo_url", v);
          },
          onFileChange: handleAvatarUpload,
          previewSrc: getFileUrl(
            avatarPreview || info?.avatar?.imageUrl || info.logo_url
          ),
          kind: "image",
          fileLabel: T.chooseFileLabel,
          accept:
            "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
          placeholder: "https://...",
          imageZoom: info?.avatar?.zoom ?? 1,
          underPreview: h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              },
            },
            h("span", {
              className: "text-sm",
              style: { fontSize: 11, fontWeight: 500 },
            }, (T.avatarZoomLabel || "Zoom") + ": " + String(info?.avatar?.zoom ?? 1)),
            h("button", {
              type: "button",
              "aria-label": "Zoom in",
              className: "btn pill btn-small",
              style: {
                width: 28,
                height: 28,
                minWidth: 28,
                padding: 0,
                fontSize: 14,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              onClick: () => {
                const cur = Math.min(2, (info?.avatar?.zoom ?? 1) + 0.1);
                setInfoPath("avatar.zoom", Math.round(cur * 10) / 10);
              },
            }, "+"),
            h("button", {
              type: "button",
              "aria-label": "Zoom out",
              className: "btn pill btn-small",
              style: {
                width: 28,
                height: 28,
                minWidth: 28,
                padding: 0,
                fontSize: 14,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              onClick: () => {
                const cur = Math.max(0.8, (info?.avatar?.zoom ?? 1) - 0.1);
                setInfoPath("avatar.zoom", Math.round(cur * 10) / 10);
              },
            }, "−")
          ),
        }),

      info?.avatar?.type === "video" &&
        h(MediaUploadRow, {
          label: T.avatarVideoUrlLabel,
          hint: T.avatarVideoHint,
          urlValue: info?.avatar?.videoUrl || "",
          onUrlChange: (v) => setInfoPath("avatar.videoUrl", v),
          onFileChange: handleAvatarUpload,
          previewSrc: getFileUrl(avatarPreview || info?.avatar?.videoUrl || ""),
          kind: "video",
          fileLabel: T.chooseFileLabel,
          accept: "video/*,.mp4,.webm,.ogg",
          placeholder: "/file/...",
        }),

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
            : code === "fa"
            ? "نام شرکت (FA)"
            : code === "geo"
            ? "კომპანიის სახელი (GEO)"
            : "Şirket Adı (TR)";



        const baseClass = "input company-name-input";

        const extraProps =
          code === "ar" || code === "fa"
            ? { dir: "rtl", placeholder, className: baseClass }
            : { placeholder, className: baseClass };

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
            : code === "fa"
            ? "توضیحات (FA)"
            : code === "geo" 
            ? "აღწერა (GEO)"
            : "Açıklama (TR)";

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
        h(MediaUploadRow, {
          label: T.backgroundImageUrlLabel,
          hint: T.avatarImageHint, 
          urlValue: info?.background?.imageUrl || "",
          onUrlChange: (v) => setInfoPath("background.imageUrl", v),
          onFileChange: handleBgImageUpload,
          previewSrc: getFileUrl(
            bgImagePreview || info?.background?.imageUrl || ""
          ),
          kind: "image",
          fileLabel: T.chooseFileLabel,
          accept:
            "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
          placeholder: "https://...",
        }),

      info?.background?.type === "video" &&
        h(MediaUploadRow, {
          label: T.backgroundVideoUrlLabel,
          hint: T.backgroundVideoHint,
          urlValue: info?.background?.videoUrl || "",
          onUrlChange: (v) => setInfoPath("background.videoUrl", v),
          onFileChange: handleBgVideoUpload,
          previewSrc: getFileUrl(
            bgVideoPreview || info?.background?.videoUrl || ""
          ),
          kind: "video",
          fileLabel: T.chooseFileLabel,
          accept: "video/*,.mp4,.webm,.ogg",
          placeholder: "/file/...",
        }),

      h(
        "div",
        { className: "admin-save-bar" },
        h(
          "button",
          {
            className: "btn admin-save-btn",
            disabled: savingInfo,
            onClick: saveInfo,
          },
          savingInfo ? T.savingButton : T.saveButton
        ),
        (infoMsg || msg) &&
          h(
            "div",
            { className: "small admin-save-msg" },
            infoMsg || msg
          )
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
    h(ShareTab, {
      cardId,
      info,
      uiLang,
      onSaveSuccess: (payload) =>
        setInfo((prev) => (payload && payload.share ? { ...prev, share: payload.share } : prev)),
    })
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
