// client/src/components/BrandInfoPage.js
import React from "react";
import "./Responcive.css";
import { fileUrl } from "../utils/fileUrl.js";

const h = React.createElement;

/* ---------- i18n text for Brand Info ---------- */
const BI_TEXT = {
  hy: {
    title: "Ինֆորմացիա",
    empty: "Տվյալ keyword-ով աշխատակից դեռ չկա։",
    back: "Վերադառնալ",
  },
  ru: {
    title: "Информация",
    empty: "Пока нет сотрудника с таким ключевым словом.",
    back: "Назад",
  },
  en: {
    title: "Information",
    empty: "There is no employee with this keyword yet.",
    back: "Back",
  },
  ar: {
    title: "معلومات",
    empty: "لا يوجد موظف بهذا الكلمة المفتاحية حتى الآن.",
    back: "رجوع",
  },
  fr: {
    title: "Informations",
    empty: "Il n’y a pas encore d’employé avec ce mot-clé.",
    back: "Retour",
  },
  kz: {
    title: "Ақпарат",
    empty: "Бұл кілт сөзі бар қызметкер әлі жоқ.",
    back: "Артқа",
  },
  chn: {
    title: "信息",
    empty: "当前关键词还没有员工。",
    back: "返回",
  },
};

/* ---------- pickLang upgraded for 7 langs ---------- */
/**
 * v – string կամ i18n object ({am, ru, en, ar, fr, kz, chn})
 * lang – htmlLang → "hy","ru","en","ar","fr","kz","chn"
 */
function pickLang(v, lang = "hy", fallbacks = ["am","en","ru","ar","fr","kz","chn"]) {
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

function hasKeyword(itemKeyword, activeKeyword) {
  const kw = (activeKeyword || "").trim().toLowerCase();
  if (!kw) return false;
  const raw = (itemKeyword || "").toString();
  return raw
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(kw);
}

/* ---------- avatar placeholder text per language ---------- */
function noPhotoLabel(lang) {
  const k = (lang || "").toLowerCase();
  if (k === "hy" || k === "am") return "նկար";
  if (k === "ru") return "фото";
  if (k === "ar") return "صورة";
  if (k === "fr") return "photo";
  if (k === "kz") return "фото";
  if (k === "chn") return "照片";
  return "photo";
}

/* մեկ աշխատակցի քարտ */
function WorkerCard({ item, lang }) {
  const name = pickLang(item.name, lang);

  const descSource = item.description || item.bio || "";
  const desc = pickLang(descSource, lang);

  const slidesSource =
    Array.isArray(item.slides) && item.slides.length
      ? item.slides
      : (Array.isArray(item.gallery) ? item.gallery : []);

  const slides = slidesSource.map(fileUrl).filter(Boolean).slice(0, 5);

  const avatarAbs = fileUrl(item.avatar || "");

  const [index, setIndex] = React.useState(0);
  const hasSlides = slides.length > 0;
  const currentIdx = hasSlides
    ? (index % slides.length + slides.length) % slides.length
    : 0;
  const currentSlide = hasSlides ? slides[currentIdx] : "";

  const goPrev = () => {
    if (!hasSlides) return;
    setIndex(i => (i - 1 + slides.length) % slides.length);
  };
  const goNext = () => {
    if (!hasSlides) return;
    setIndex(i => (i + 1) % slides.length);
  };

  React.useEffect(() => {
    if (!hasSlides) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hasSlides, slides.length]);

  /* ---------- colors from admin ---------- */
  const nameColor   = (item.nameColor   || "#ffffff").toString();
  const bioColor    = (item.bioColor    || "#ffffff").toString();
  const bioBgColor  = (item.bioBgColor  || "rgba(0,0,0,0.55)").toString();

  return h(
    "div",
    {
      className: "card worker-card-public",
      style: {
        marginBottom: 16,
        padding: 16,
        textAlign: "center"
      }
    },

    /* avatar շրջան */
    h("div", {
      style:{
        width:100,
        height:100,
        borderRadius:"50%",
        margin:"0 auto 10px",
        overflow:"hidden",
        background:"#f4f4f4",
        display:"grid",
        placeItems:"center",
      }
    },
      avatarAbs
        ? h("img", {
            src: avatarAbs,
            alt: name || "worker",
            loading: "lazy",
            style:{ width:"100%", height:"100%", objectFit:"cover" }
          })
        : h("span", {
            style:{
              fontWeight:700,
              fontSize:16,
              color:"#777",
              textTransform:"lowercase"
            }
          }, noPhotoLabel(lang))
    ),

    /* անուն */
    h("h3", {
      style:{
        margin:"4px 0 8px",
        fontSize:18,
        fontWeight:700,
        color: nameColor,
      }
    }, name || "—"),

    /* նկարագրություն */
    desc && h("div", {
      style:{
        margin:"0 auto 14px",
        maxWidth:320,
        padding:"10px 12px",
        borderRadius:14,
        background: bioBgColor,
        color: bioColor,
        fontSize:14,
        lineHeight:1.5,
        textAlign:"left",
        whiteSpace:"pre-line"
      }
    }, desc),

    /* slider */
    hasSlides && h("div", {
      style:{
        margin:"0 auto 12px",
        maxWidth:340
      }
    },
      h("div", {
        style:{
          position:"relative",
          borderRadius:18,
          overflow:"hidden",
          background:"#f3f3f3",
          height:190,
          display:"grid",
          placeItems:"center"
        }
      },
        currentSlide && h("img", {
          src: currentSlide,
          alt:"",
          loading: "lazy",
          style:{
            width:"100%",
            height:"100%",
            objectFit:"cover",
            transition: "opacity .35s ease"
          }
        }),

        h("button", {
          type:"button",
          onClick: goPrev,
          style:{
            position:"absolute",
            left:8,
            top:"50%",
            transform:"translateY(-50%)",
            width:30,
            height:30,
            borderRadius:"50%",
            border:"none",
            background:"rgba(0,0,0,.45)",
            color:"#fff",
            display:"grid",
            placeItems:"center",
            cursor:"pointer"
          }
        }, "<"),

        h("button", {
          type:"button",
          onClick: goNext,
          style:{
            position:"absolute",
            right:8,
            top:"50%",
            transform:"translateY(-50%)",
            width:30,
            height:30,
            borderRadius:"50%",
            border:"none",
            background:"rgba(0,0,0,.45)",
            color:"#fff",
            display:"grid",
            placeItems:"center",
            cursor:"pointer"
          }
        }, ">")
      ),

      h("div", {
        style:{
          marginTop:6,
          display:"flex",
          justifyContent:"center",
          gap:6
        }
      },
        slides.map((_, i) =>
          h("span", {
            key:i,
            style:{
              width:8,
              height:8,
              borderRadius:"50%",
              background: i === currentIdx ? "#111" : "#d0d0d0"
            }
          })
        )
      )
    )
  );
}

/**
 * Props:
 * - brandInfos: [{ id, keyword, name, bio/description, gallery/slides[], nameColor, bioColor, bioBgColor }]
 * - keyword
 * - lang (htmlLang → "hy","ru","en","ar","fr","kz","chn")
 * - onBack()
 */
export default function BrandInfoPage({
  brandInfos = [],
  keyword = "",
  lang = "hy",
  onBack
}) {
  const T = BI_TEXT[lang] || BI_TEXT.hy;

  React.useEffect(() => {
    const container = document.querySelector(".public-scroll-layer");
    if (container && typeof container.scrollTo === "function") {
      container.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [keyword]);

  const list = (Array.isArray(brandInfos) ? brandInfos : []).filter(item =>
    hasKeyword(item.keyword, keyword)
  );

  return h(
    "section",
    { className: "brandinfo-public", style: { padding: "10px 12px" } },

    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          gap: 8
        }
      },
      h(
        "button",
        {
          type: "button",
          className: "btn",
          style: { padding: "6px 10px", borderRadius: 999 },
          onClick: () => onBack && onBack()
        },
        "←",
        " ",
        T.back
      ),
      h("h2", {
        className: "company-title",
        style: { margin: 0, fontSize: 20 }
      }, T.title)
    ),

    !list.length &&
      h(
        "div",
        {
          className: "card",
          style: { padding: 12, fontSize: 14 }
        },
        T.empty
      ),

    ...list.map(item =>
      h(WorkerCard, {
        key: item.id || item.keyword || Math.random().toString(36),
        item,
        lang
      })
    )
  );
}
