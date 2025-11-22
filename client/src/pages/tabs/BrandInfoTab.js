// client/src/pages/tabs/BrandInfoTab.js
import React from "react";
import { adminGetInfo, adminSaveInfo, uploadFile } from "../../api.js";

const h = React.createElement;
// 👇 ավելացրինք kz, chn
const LANGS = ["am", "ru", "en", "ar", "fr", "kz", "chn"];

/* ---------- UI TEXT ---------- */
const BRANDINFO_TEXT = {
  am: {
    title: "Բրենդ ինֆո",

    keywordHint: "Այս հատվածը կապվում է բրենդների հետ keyword դաշտի միջոցով։",
    keywordLabel: "Keyword",
    nameLabel: "Անուն:",
    bioLabel: "Նկարագրություն:",
    nameColorLabel: "Անվան գույնը",
    bioColorLabel: "Նկարագրության գույնը",
    bioBgColorLabel: "Նկարագրության ֆոնի գույնը",
    sliderLabel: "Սլայդեր (մինչև 5 նկար, 6:9)",
    deleteWorkerButton: "Ջնջել",
    addWorkerButton: "Ավելացնել",
    saveButton: "Պահել",
    savingButton: "Պահպանում…",
    loading: "Բեռնվում է…",
    avatarLabel: "Վերբեռնել",
    deleteAvatarLabel: "Ջնջել լոգոն",
    fileTypeError: "Ընդունվում է միայն նկար",
    uploadAvatarOk: "Avatar-ը վերբեռնվեց ✔",
    uploadImageOk: "Նկարը վերբեռնվեց ✔",
    uploadFailed: "Վերբեռնումը ձախողվեց",
    savedOk: "Պահվեց ✅",
    loadFailed: "Ներբեռնումը ձախողվեց",
    saveFailed: "Պահպանելը ձախողվեց",
  },

  ru: {
    title: "Информация о бренде",

    keywordHint: "Этот блок связывается с брендами через поле keyword.",
    keywordLabel: "Keyword",
    nameLabel: "Имя :",
    bioLabel: "Описание :",
    nameColorLabel: "Цвет имени",
    bioColorLabel: "Цвет описания",
    bioBgColorLabel: "Цвет фона описания",
    sliderLabel: "Слайдер (до 5 изображений, 6:9)",
    deleteWorkerButton: "Удалить",
    addWorkerButton: "Добавить",
    saveButton: "Сохранить",
    savingButton: "Сохранение…",
    loading: "Загрузка…",
    avatarLabel: "Загрузить",
    deleteAvatarLabel: "Удалить лого",
    fileTypeError: "Допускается только изображение",
    uploadAvatarOk: "Аватар загружен ✔",
    uploadImageOk: "Изображение загружено ✔",
    uploadFailed: "Ошибка при загрузке",
    savedOk: "Сохранено ✅",
    loadFailed: "Ошибка при загрузке",
    saveFailed: "Ошибка при сохранении",
  },

  en: {
    title: "Brand Info",

    keywordHint: "This section is linked to brands via the keyword field.",
    keywordLabel: "Keyword",
    nameLabel: "Name:",
    bioLabel: "Description:",
    nameColorLabel: "Name color",
    bioColorLabel: "Description color",
    bioBgColorLabel: "Description background color",
    sliderLabel: "Slider (up to 5 images, 6:9)",
    deleteWorkerButton: "Delete",
    addWorkerButton: "Add",
    saveButton: "Save",
    savingButton: "Saving…",
    loading: "Loading…",
    avatarLabel: "Upload",
    deleteAvatarLabel: "Delete logo",
    fileTypeError: "Only image files are allowed",
    uploadAvatarOk: "Avatar uploaded ✔",
    uploadImageOk: "Image uploaded ✔",
    uploadFailed: "Upload failed",
    savedOk: "Saved ✅",
    loadFailed: "Load failed",
    saveFailed: "Save failed",
  },

  ar: {
    title: "معلومات العلامة التجارية",

    keywordHint: "يتم ربط هذا القسم بالعلامات التجارية عبر حقل الـ keyword.",
    keywordLabel: "الكلمة المفتاحية",
    nameLabel: "الاسم:",
    bioLabel: "الوصف:",
    nameColorLabel: "لون الاسم",
    bioColorLabel: "لون الوصف",
    bioBgColorLabel: "لون خلفية الوصف",
    sliderLabel: "سلايدر (حتى ٥ صور، 6:9)",
    deleteWorkerButton: "حذف",
    addWorkerButton: "إضافة",
    saveButton: "حفظ",
    savingButton: "جاري الحفظ…",
    loading: "جاري التحميل…",
    avatarLabel: "رفع",
    deleteAvatarLabel: "حذف الشعار",
    fileTypeError: "يُسمح بالصور فقط",
    uploadAvatarOk: "تم رفع الـ Avatar ✔",
    uploadImageOk: "تم رفع الصورة ✔",
    uploadFailed: "فشل الرفع",
    savedOk: "تم الحفظ ✅",
    loadFailed: "فشل التحميل",
    saveFailed: "فشل الحفظ",
  },

  fr: {
    title: "Infos marque",

    keywordHint:
      "Cette section est reliée aux marques via le champ keyword.",
    keywordLabel: "Mot-clé",
    nameLabel: "Nom :",
    bioLabel: "Description :",
    nameColorLabel: "Couleur du nom",
    bioColorLabel: "Couleur de la description",
    bioBgColorLabel: "Couleur du fond de description",
    sliderLabel: "Slider (jusqu’à 5 images, 6:9)",
    deleteWorkerButton: "Supprimer",
    addWorkerButton: "Ajouter",
    saveButton: "Enregistrer",
    savingButton: "Enregistrement…",
    loading: "Chargement…",
    avatarLabel: "Téléverser",
    deleteAvatarLabel: "Supprimer le logo",
    fileTypeError: "Seule une image est acceptée",
    uploadAvatarOk: "Avatar téléversé ✔",
    uploadImageOk: "Image téléversée ✔",
    uploadFailed: "Échec du téléversement",
    savedOk: "Enregistré ✅",
    loadFailed: "Échec du chargement",
    saveFailed: "Échec de l’enregistrement",
  },

  // 🇰🇿 Kazakh
  kz: {
    title: "Бренд туралы ақпарат",

    keywordHint:
      "Бұл бөлім брендтермен keyword өрісі арқылы байланысады.",
    keywordLabel: "Keyword",
    nameLabel: "Аты:",
    bioLabel: "Сипаттама:",
    nameColorLabel: "Атау түсі",
    bioColorLabel: "Сипаттама түсі",
    bioBgColorLabel: "Сипаттама фонының түсі",
    sliderLabel: "Слайдер (5 суретке дейін, 6:9)",
    deleteWorkerButton: "Жою",
    addWorkerButton: "Қосу",
    saveButton: "Сақтау",
    savingButton: "Сақталуда…",
    loading: "Жүктелуде…",
    avatarLabel: "Жүктеу",
    deleteAvatarLabel: "Логотипті жою",
    fileTypeError: "Тек сурет файлдарына рұқсат етіледі",
    uploadAvatarOk: "Аватар жүктелді ✔",
    uploadImageOk: "Сурет жүктелді ✔",
    uploadFailed: "Жүктеу сәтсіз аяқталды",
    savedOk: "Сақталды ✅",
    loadFailed: "Жүктеу сәтсіз аяқталды",
    saveFailed: "Сақтау сәтсіз аяқталды",
  },

  // 🇨🇳 Chinese (Simplified)
  chn: {
    title: "品牌信息",

    keywordHint: "本区域通过 keyword 字段与品牌数据关联。",
    keywordLabel: "Keyword",
    nameLabel: "姓名：",
    bioLabel: "描述：",
    nameColorLabel: "姓名颜色",
    bioColorLabel: "描述文字颜色",
    bioBgColorLabel: "描述背景颜色",
    sliderLabel: "轮播图（最多 5 张，6:9）",
    deleteWorkerButton: "删除",
    addWorkerButton: "添加",
    saveButton: "保存",
    savingButton: "正在保存…",
    loading: "正在加载…",
    avatarLabel: "上传",
    deleteAvatarLabel: "删除 Logo",
    fileTypeError: "仅允许上传图片文件",
    uploadAvatarOk: "头像已上传 ✔",
    uploadImageOk: "图片已上传 ✔",
    uploadFailed: "上传失败",
    savedOk: "已保存 ✅",
    loadFailed: "加载失败",
    saveFailed: "保存失败",
  },
};

/* ---------- helpers ---------- */
function filesBase() {
  if (typeof window === "undefined") return "http://localhost:5050";
  const host = window.location.hostname || "localhost";
  return "http://" + host + ":5050";
}
const isAbsLike = (u = "") => /^(data:|https?:\/\/|blob:)/i.test(u);
function absPreview(u) {
  if (!u) return "";
  if (isAbsLike(u)) return u;
  let s = String(u).trim();
  if (!s.startsWith("/")) s = "/" + s;
  return filesBase() + s;
}
function toI18nObj(v, fb = "") {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const out = {};
    for (const L of LANGS) out[L] = (v[L] ?? "").toString().trim();
    return out;
  }
  const s = (v ?? fb ?? "").toString().trim();
  const out = {};
  for (const L of LANGS) out[L] = L === "am" ? s : "";
  return out;
}
function trimI18nObj(o) {
  const out = {};
  for (const L of LANGS) out[L] = (o?.[L] ?? "").toString().trim();
  return out;
}
function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
function cleanGallery(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) => (x || "").toString().trim())
    .filter(Boolean)
    .slice(0, 5);
}
function putInArray(arr, index, value, maxLen = 5) {
  const out = Array.isArray(arr) ? arr.slice(0, maxLen) : [];
  while (out.length < maxLen) out.push("");
  out[index] = value;
  return out;
}

/* ---------- I18nRow helper ---------- */
function I18nRow({ brandId, label, value, onChange, langs }) {
  const usedLangs = Array.isArray(langs) && langs.length ? langs : LANGS;

  return h(
    "div",
    { className: "i18n-row" },
    h("label", { className: "lbl" }, label),
    h(
      "div",
      { className: "i18n-vertical" },
      usedLangs.map((L) => {
        const fieldKey = brandId
          ? `${brandId}:${L}:${label}`
          : `title:${L}:${label}`;
        const rtlProps =
          L === "ar" ? { dir: "rtl", style: { textAlign: "right" } } : {};
        return h(
          "div",
          { key: L, className: "i18n-item" },
          h("div", { className: "tag" }, L.toUpperCase()),
          h(
            "textarea",
            Object.assign(
              {
                className: "input",
                "data-fieldkey": fieldKey,
                autoComplete: "off",
                spellCheck: false,
                rows: 2,
                value: value?.[L] ?? "",
                onChange: (e) =>
                  onChange &&
                  onChange(L, e.target.value, fieldKey, null),
              },
              rtlProps
            )
          )
        );
      })
    )
  );
}

/* ---------- component ---------- */
export default function BrandInfoTab({ langs, uiLang = "am" }) {
  const token =
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const activeLangs =
    Array.isArray(langs) && langs.length ? langs : LANGS;
  const T = BRANDINFO_TEXT[uiLang] || BRANDINFO_TEXT.en;

  const [baseInfo, setBaseInfo] = React.useState(null);

  // workers: [{ id, keyword, name:{}, bio:{}, avatar, gallery[], nameColor, bioColor, bioBgColor }]
  const [workers, setWorkers] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await adminGetInfo(token);
        const info = r?.information || r || {};
        setBaseInfo(info);

        const list = Array.isArray(info.brandInfos)
          ? info.brandInfos
          : Array.isArray(info.brandWorkers)
          ? info.brandWorkers
          : [];

        const prepared = list.map((x) => ({
          id: x.id || uid(),
          keyword: (x.keyword || "").toString().trim(),
          name: toI18nObj(x.name || x.title || ""),
          bio: toI18nObj(x.bio || x.description || ""),
          avatar: (x.avatar || "").toString().trim(),
          gallery: cleanGallery(x.gallery),
          nameColor: (x.nameColor || "#ffffff").toString(),
          bioColor: (x.bioColor || "#ffffff").toString(),
          bioBgColor: (x.bioBgColor || "#000000").toString(),
        }));
        setWorkers(prepared);
      } catch (e) {
        setMsg(e?.message || T.loadFailed);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, uiLang]);

  /* ------ CRUD helpers ------ */
  function onWorkerField(id, key, value) {
    setWorkers((list) =>
      list.map((w) => (w.id === id ? { ...w, [key]: value } : w))
    );
  }

  function onWorkerName(id, lang, value) {
    setWorkers((list) =>
      list.map((w) =>
        w.id === id ? { ...w, name: { ...w.name, [lang]: value } } : w
      )
    );
  }

  function onWorkerBio(id, lang, value) {
    setWorkers((list) =>
      list.map((w) =>
        w.id === id ? { ...w, bio: { ...w.bio, [lang]: value } } : w
      )
    );
  }

  function addWorker() {
    setWorkers((list) => {
      const next = [
        ...list,
        {
          id: uid(),
          keyword: "",
          name: toI18nObj(""),
          bio: toI18nObj(""),
          avatar: "",
          gallery: [],
          nameColor: "#ffffff",
          bioColor: "#ffffff",
          bioBgColor: "#000000",
        },
      ];

      setTimeout(() => {
        if (typeof document !== "undefined") {
          const el = document.querySelector(
            ".admin-workers .worker-row:last-child"
          );
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }
      }, 60);

      return next;
    });
  }

  function delWorker(id) {
    setWorkers((list) => list.filter((w) => w.id !== id));
  }

  // reorder workers (up/down)
  function moveWorker(id, dir) {
    setWorkers((list) => {
      const i = list.findIndex((x) => x.id === id);
      if (i < 0) return list;
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const out = list.slice();
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
      return out;
    });
  }

  // delete avatar locally
  function deleteWorkerAvatar(id) {
    setWorkers((list) =>
      list.map((w) => (w.id === id ? { ...w, avatar: "" } : w))
    );
  }

  // delete gallery image
  function deleteGalleryImg(id, idx) {
    setWorkers((list) =>
      list.map((w) => {
        if (w.id !== id) return w;
        return { ...w, gallery: putInArray(w.gallery, idx, "", 5) };
      })
    );
  }

  /* ------ upload helpers ------ */
  function uploadWorkerAvatar(id, file) {
    return (async () => {
      try {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          setMsg(T.fileTypeError);
          return;
        }
        const blobUrl = URL.createObjectURL(file);
        setWorkers((list) =>
          list.map((w) => (w.id === id ? { ...w, avatar: blobUrl } : w))
        );

        const r = await uploadFile(token, file, "brandInfos.avatar");
        const serverPath = r?.url || r?.path || r?.location || "";
        setWorkers((list2) =>
          list2.map((w) =>
            w.id === id ? { ...w, avatar: serverPath } : w
          )
        );
        setMsg(T.uploadAvatarOk);
      } catch (e) {
        setMsg(e?.message || T.uploadFailed);
      }
    })();
  }

  function uploadWorkerGallery(id, file, index) {
    return (async () => {
      try {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          setMsg(T.fileTypeError);
          return;
        }
        const blobUrl = URL.createObjectURL(file);
        setWorkers((list) =>
          list.map((w) => {
            if (w.id !== id) return w;
            const g1 = putInArray(w.gallery, index, blobUrl, 5);
            return { ...w, gallery: g1 };
          })
        );

        const r = await uploadFile(token, file, "brandInfos.gallery");
        const serverPath = r?.url || r?.path || r?.location || "";
        setWorkers((list2) =>
          list2.map((w) => {
            if (w.id !== id) return w;
            const g2 = putInArray(w.gallery, index, serverPath, 5);
            return { ...w, gallery: g2 };
          })
        );
        setMsg(T.uploadImageOk);
      } catch (e) {
        setMsg(e?.message || T.uploadFailed);
      }
    })();
  }

  /* ------ save ------ */
  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const cleanWorkers = workers.map((w) => ({
        id: w.id,
        keyword: (w.keyword || "").toString().trim(),
        name: trimI18nObj(w.name),
        bio: trimI18nObj(w.bio),
        avatar: (w.avatar || "").toString().trim(),
        gallery: cleanGallery(w.gallery),
        nameColor: (w.nameColor || "#ffffff").toString(),
        bioColor: (w.bioColor || "#ffffff").toString(),
        bioBgColor: (w.bioBgColor || "#000000").toString(),
      }));

      const next = { ...(baseInfo || {}) };
      next.brandInfos = cleanWorkers;
      delete next.brandWorkers;

      await adminSaveInfo(token, next);

      const back = await adminGetInfo(token);
      const info = back?.information || next;

      setBaseInfo(info);

      const list = Array.isArray(info.brandInfos)
        ? info.brandInfos
        : Array.isArray(info.brandWorkers)
        ? info.brandWorkers
        : [];
      const prepared = list.map((x) => ({
        id: x.id || uid(),
        keyword: (x.keyword || "").toString().trim(),
        name: toI18nObj(x.name || x.title || ""),
        bio: toI18nObj(x.bio || x.description || ""),
        avatar: (x.avatar || "").toString().trim(),
        gallery: cleanGallery(x.gallery),
        nameColor: (x.nameColor || "#ffffff").toString(),
        bioColor: (x.bioColor || "#ffffff").toString(),
        bioBgColor: (x.bioBgColor || "#000000").toString(),
      }));
      setWorkers(prepared);

      setMsg(T.savedOk);
    } catch (e) {
      setMsg(e?.message || T.saveFailed);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  }

  /* ------ UI ------ */
  if (loading) return h("div", { className: "card" }, T.loading);

  return h(
    "div",
    { className: "admin-scroll-root" },

    h(
      "h2",
      {
        className: "company-title",
        style: { marginTop: 8, marginBottom: 6 },
      },
      T.title
    ),

    h(
      "p",
      {
        className: "small",
        style: { marginBottom: 10 },
      },
      T.keywordHint
    ),

    h(
      "div",
      { className: "admin-workers" },
      workers.map((w, index) =>
        h(
          "div",
          { key: w.id, className: "worker-row card" },

          // LEFT COL: avatar + upload + delete + up/down
          h(
            "div",
            { className: "worker-left" },

            h(
              "div",
              { className: "worker-avatar" },
              w.avatar
                ? h("img", { src: absPreview(w.avatar), alt: "worker" })
                : h(
                    "span",
                    { className: "worker-avatar-initials" },
                    (w.name && (w.name.am || w.name.en || "?"))
                      .slice(0, 2)
                      .toUpperCase()
                  )
            ),

            h(
              "div",
              { className: "avatar-actions" },
              h(
                "label",
                {
                  className: "btn pill btn-small",
                  onMouseDown: (e) => e.preventDefault(),
                },
                T.avatarLabel,
                h("input", {
                  type: "file",
                  accept: "image/*",
                  style: { display: "none" },
                  onChange: (e) => {
                    const f = e.target.files && e.target.files[0];
                    if (f) uploadWorkerAvatar(w.id, f)();
                    e.target.value = "";
                  },
                })
              ),

              w.avatar
                ? h(
                    "button",
                    {
                      type: "button",
                      className: "btn pill danger btn-small",
                      onClick: () => deleteWorkerAvatar(w.id),
                    },
                    T.deleteAvatarLabel
                  )
                : null
            ),

            // up/down reorder
            h(
              "div",
              { className: "reorder-col" },
              h(
                "button",
                {
                  type: "button",
                  className: "order-btn up",
                  disabled: index === 0,
                  onClick: () => moveWorker(w.id, -1),
                  title: "Move up",
                },
                "↑"
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "order-btn down",
                  disabled: index === workers.length - 1,
                  onClick: () => moveWorker(w.id, +1),
                  title: "Move down",
                },
                "↓"
              )
            )
          ),

          // main fields
          h(
            "div",
            { className: "worker-main" },

            h(
              "div",
              { className: "row" },
              h("label", { className: "lbl" }, T.keywordLabel + ":"),
              h("input", {
                className: "input",
                style: { flex: 1 },
                value: w.keyword || "",
                "data-fieldkey": w.id + ":keyword",
                autoComplete: "off",
                spellCheck: false,
                onChange: (e) =>
                  onWorkerField(w.id, "keyword", e.target.value),
              })
            ),

            // Name color
            h(
              "div",
              {
                className: "row",
                style: {
                  marginTop: 4,
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                },
              },
              h("label", { className: "lbl" }, T.nameColorLabel),
              h("input", {
                type: "color",
                value: w.nameColor || "#ffffff",
                onChange: (e) =>
                  onWorkerField(w.id, "nameColor", e.target.value),
                style: {
                  width: 52,
                  height: 28,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                },
              })
            ),

            // Description color
            h(
              "div",
              {
                className: "row",
                style: {
                  marginTop: 4,
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                },
              },
              h("label", { className: "lbl" }, T.bioColorLabel),
              h("input", {
                type: "color",
                value: w.bioColor || "#ffffff",
                onChange: (e) =>
                  onWorkerField(w.id, "bioColor", e.target.value),
                style: {
                  width: 52,
                  height: 28,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                },
              })
            ),

            // Description background color
            h(
              "div",
              {
                className: "row",
                style: {
                  marginTop: 4,
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                },
              },
              h("label", { className: "lbl" }, T.bioBgColorLabel),
              h("input", {
                type: "color",
                value: w.bioBgColor || "#000000",
                onChange: (e) =>
                  onWorkerField(w.id, "bioBgColor", e.target.value),
                style: {
                  width: 52,
                  height: 28,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                },
              })
            ),

            h(I18nRow, {
              brandId: w.id + ":name",
              label: T.nameLabel,
              value: w.name,
              onChange: (L, v, fieldKey) =>
                onWorkerName(w.id, L, v, fieldKey),
              langs: activeLangs,
            }),

            h(I18nRow, {
              brandId: w.id + ":bio",
              label: T.bioLabel,
              value: w.bio,
              onChange: (L, v, fieldKey) =>
                onWorkerBio(w.id, L, v, fieldKey),
              langs: activeLangs,
            }),

            h(
              "div",
              { className: "worker-gallery-block" },
              h(
                "div",
                { className: "lbl", style: { marginBottom: 6 } },
                T.sliderLabel
              ),
              h(
                "div",
                { className: "worker-gallery-row" },
                [0, 1, 2, 3, 4].map((idx) => {
                  const src =
                    w.gallery && w.gallery[idx] ? w.gallery[idx] : "";
                  return h(
                    "label",
                    {
                      key: idx,
                      className: "gallery-slot",
                    },
                    src
                      ? h("img", { src: absPreview(src), alt: "slide" })
                      : h(
                          "span",
                          { className: "gallery-plus" },
                          "+"
                        ),

                    // hover delete for gallery image
                    src
                      ? h(
                          "button",
                          {
                            type: "button",
                            className: "gallery-del",
                            onClick: (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteGalleryImg(w.id, idx);
                            },
                            title: "Delete image",
                          },
                          "×"
                        )
                      : null,

                    h("input", {
                      type: "file",
                      accept: "image/*",
                      style: { display: "none" },
                      onChange: (e) => {
                        const f =
                          e.target.files && e.target.files[0];
                        if (f) uploadWorkerGallery(w.id, f, idx)();
                        e.target.value = "";
                      },
                    })
                  );
                })
              )
            ),

            h(
              "div",
              { className: "row", style: { marginTop: 6 } },
              h(
                "button",
                {
                  type: "button",
                  className: "btn pill danger btn-small",
                  onClick: () => delWorker(w.id),
                },
                T.deleteWorkerButton
              )
            )
          )
        )
      )
    ),

    h(
      "div",
      { className: "footer-actions" },
      h(
        "button",
        {
          className: "btn strong",
          type: "button",
          onClick: addWorker,
        },
        T.addWorkerButton
      ),
      h("div", { style: { flex: 1 } }),
      h(
        "button",
        {
          className: "btn strong",
          type: "button",
          onClick: save,
          disabled: saving,
        },
        saving ? T.savingButton : T.saveButton
      ),
      msg && h("span", { className: "small-msg" }, msg)
    ),

    h(
      "style",
      null,
      [
        ".admin-scroll-root{overscroll-behavior:contain;}",
        ".admin-workers{display:flex;flex-direction:column;gap:12px;}",

        ".worker-row{display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:start;}",
        "@media(max-width:520px){.worker-row{grid-template-columns:90px 1fr;}}",

        ".worker-left{display:flex;flex-direction:column;gap:8px;align-items:center;}",

        ".worker-avatar{width:96px;height:96px;border-radius:16px;overflow:hidden;background:#f2f2f2;display:grid;place-items:center;}",
        ".worker-avatar img{width:100%;height:100%;object-fit:cover;}",
        ".worker-avatar-initials{font-weight:700;color:#777;}",

        ".avatar-actions{display:flex;flex-direction:column;gap:6px;width:100%;align-items:center;}",

        ".reorder-col{display:flex;flex-direction:column;gap:6px;width:100%;align-items:center;}",
        ".order-btn{width:54px;height:32px;border:none;border-radius:10px;font-weight:700;cursor:pointer;}",
        ".order-btn.up{background:#d9d9d9;color:#111;}",
        ".order-btn.down{background:#111;color:#fff;}",
        ".order-btn:disabled{opacity:.5;cursor:not-allowed;}",

        ".worker-main{display:grid;gap:8px;align-content:start;}",

        ".worker-gallery-row{display:flex;gap:8px;flex-wrap:wrap;}",
        ".gallery-slot{width:90px;height:54px;border-radius:10px;overflow:hidden;background:#f4f4f4;position:relative;display:grid;place-items:center;cursor:pointer;border:1px dashed #ccc;}",
        ".gallery-slot img{width:100%;height:100%;object-fit:cover;}",
        ".gallery-plus{font-size:22px;color:#777;}",

        ".gallery-del{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;border:none;background:rgba(0,0,0,.65);color:#fff;font-size:14px;line-height:20px;display:none;align-items:center;justify-content:center;cursor:pointer;}",
        ".gallery-slot:hover .gallery-del{display:flex;}",

        ".btn-small{padding:6px 10px;font-size:12px;}",
        ".card{background:#fff;border:1px solid:#ececec;border-radius:16px;padding:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);}",
        ".lbl{font-weight:600;min-width:max-content;}",
        ".i18n-row{display:grid;gap:6px;}",
        ".i18n-vertical{display:grid;gap:6px;grid-template-columns:1fr;}",
        ".i18n-item{display:grid;gap:4px;}",
        ".tag{font-size:12px;font-weight:700;opacity:.7;}",
        ".input{width:100%;padding:8px 10px;border:1px solid:#ddd;border-radius:12px;background:#fff;}",
        ".btn{padding:10px 14px;border:none;border-radius:12px;background:#111;color:#fff;cursor:pointer;}",
        ".btn.pill{border-radius:999px;}",
        ".btn.danger{background:#e8554d;}",
        ".btn.strong{font-weight:700;}",
        ".footer-actions{position:sticky;bottom:0;display:flex;align-items:center;gap:10px;padding-top:8px;padding-bottom:6px;background:#fff;border-top:1px solid:#ececec;}",
        ".small-msg{margin-left:8px;font-size:12px;color:#444;}",
        ".small{font-size:12px;color:#666;}",
      ].join("\n")
    )
  );
}
