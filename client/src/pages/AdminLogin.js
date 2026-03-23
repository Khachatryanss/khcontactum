// client/src/pages/AdminLogin.js
import React, { useState, useEffect } from "react";
import PhoneShell from "../PhoneShell.js";
import { adminLogin } from "../api.js";

import "./AdminLogin.css";

import KHLogoHolding   from "../img/KH_HOLDING.png";
import KHLogoContactum from "../img/KHCONTACTUM1.png";

import phoneIcon    from "../img/phone.png";
import telegramIcon from "../img/telegram.png";
import viberIcon    from "../img/viber.png";
import whatsappIcon from "../img/watsapp.png";
import mailIcon     from "../img/mail.png";

const h = React.createElement;

// ✅ ավելացվեց tr
// (քո նշած՝ kz և chn արդեն կա)
const LANGS = ["am", "ru", "en", "ar", "fr", "kz", "chn", "de", "es", "it", "fa", "geo", "tr"];

const TEXT = {
  am: {
    appTitle: "KHContactum",
    username: "Մուտքանուն",
    password: "Գաղտնաբառ",
    login: "Մուտք",
    description:
      "KHContactum թվային այցեքարտեր. Բիզնեսը սկսվում է մեկ հպումով․ KHContactum LLC-ն Khachatryans Holding CJSC-ի հերթական նորարարական նախագիծն է, որը միավորում է տեխնոլոգիան և բիզնեսը։ Ստեղծված է առաջնորդների համար, ովքեր գնահատում են ոճը և արդյունավետությունը։ Ակնթարթային շփում NFC կամ QR կոդով՝ անհատական պրեմիում ձևավորմամբ ձեր բրենդի համար։ KHContactum — բիզնես հաղորդակցության նոր լեզուն։",
    contactsLabel: "Կապ մեզ հետ",
  },
  ru: {
    appTitle: "KHContactum",
    username: "Имя пользователя",
    password: "Пароль",
    login: "Вход",
    description:
      "Цифровые визитки KHContactum. Бизнес начинается с одного прикосновения. KHContactum LLC — ещё один инновационный проект компании «Khachatryans Holding CJSC», объединяющий технологии и бизнес. Созданы для лидеров, ценящих стиль и эффективность. Мгновенный контакт по NFC или QR-коду с индивидуальным премиальным дизайном для вашего бренда. KHContactum — новый язык делового общения.",
    contactsLabel: "Связаться с нами",
  },
  en: {
    appTitle: "KHContactum",
    username: "Username",
    password: "Password",
    login: "Login",
    description:
      "KHContactum digital business cards. Business starts with one touch. KHContactum LLC is another innovative project of Khachatryans Holding CJSC, which combines technology and business. Created for leaders who value style and efficiency. Instant contact via NFC or QR code with individual premium design for your brand. KHContactum — the new language of business communication.",
    contactsLabel: "Contact us",
  },
  ar: {
    appTitle: "KHContactum",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    description:
      "بطاقات أعمال رقمية من KHContactum. تبدأ الأعمال بلمسة واحدة. KHContactum LLC هو مشروع مبتكر آخر من شركة Khachatryans Holding CJSC، يجمع بين التكنولوجيا والأعمال. صُمم للقادة الذين يُقدّرون الأناقة والكفاءة. تواصل فوري عبر تقنية NFC أو رمز الاستجابة السريعة مع تصميم مميز وفريد لعلامتك التجارية. KHContactum - لغة التواصل الجديدة في عالم الأعمال.",
    contactsLabel: "اتصل بنا",
  },
  fr: {
    appTitle: "KHContactum",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    login: "Connexion",
    description:
      "Cartes de visite numériques KHContactum. Le business commence en un seul geste. KHContactum LLC est un projet innovant de Khachatryans Holding CJSC, alliant technologie et affaires. Conçues pour les dirigeants qui privilégient l'élégance et l'efficacité. Contact instantané via NFC ou QR code avec un design premium personnalisé pour votre marque. KHContactum : le nouveau langage de la communication d'entreprise.",
    contactsLabel: "Contactez-nous",
  },
  kz: {
    appTitle: "KHContactum",
    username: "Пайдаланушы аты",
    password: "Құпиясөз",
    login: "Кіру",
    description:
      "KHContactum цифрлық визиткалары. Бизнес бір жанасудан басталады. KHContactum LLC – Khachatryans Holding CJSC компаниясының технология мен бизнесті біріктіретін тағы бір инновациялық жобасы. Стиль мен тиімділікті бағалайтын көшбасшыларға арналған. NFC немесе QR-код арқылы бір сәтте байланыс, брендіңіз үшін премиум жеке дизайнмен. KHContactum — іскерлік коммуникацияның жаңа тілі.",
    contactsLabel: "Бізбен байланыс",
  },
  chn: {
    appTitle: "KHContactum",
    username: "用户名",
    password: "密码",
    login: "登录",
    description:
      "KHContactum 数字名片。商业从一次触碰开始。KHContactum LLC 是 Khachatryans Holding CJSC 的又一个创新项目，将技术与商业相结合。专为重视风格与效率的领导者打造。通过 NFC 或二维码实现即时连接，为您的品牌提供专属高端设计。KHContactum —— 商务沟通的新语言。",
    contactsLabel: "联系我们",
  },
  de: {
    appTitle: "KHContactum",
    username: "Benutzername",
    password: "Passwort",
    login: "Anmelden",
    description:
      "Digitale Visitenkarten von KHContactum. Business beginnt mit einer einzigen Berührung. KHContactum LLC ist ein weiteres innovatives Projekt von Khachatryans Holding CJSC, das Technologie und Business vereint. Entwickelt für Führungskräfte, die Stil und Effizienz schätzen. Sofortige Verbindung über NFC oder QR-Code mit individuellem Premium-Design für Ihre Marke. KHContactum – die neue Sprache der Geschäftskommunikation.",
    contactsLabel: "Kontakt",
  },
  es: {
    appTitle: "KHContactum",
    username: "Usuario",
    password: "Contraseña",
    login: "Iniciar sesión",
    description:
      "Tarjetas de presentación digitales KHContactum. El negocio comienza con un solo toque. KHContactum LLC es otro proyecto innovador de Khachatryans Holding CJSC que combina tecnología y negocio. Creado para líderes que valoran el estilo y la eficiencia. Conexión instantánea mediante NFC o código QR con diseño premium personalizado para tu marca. KHContactum: el nuevo lenguaje de la comunicación empresarial.",
    contactsLabel: "Contáctanos",
  },
  it: {
    appTitle: "KHContactum",
    username: "Nome utente",
    password: "Password",
    login: "Accedi",
    description:
      "Biglietti da visita digitali KHContactum. Il business inizia con un solo tocco. KHContactum LLC è un progetto innovativo di Khachatryans Holding CJSC che unisce tecnologia e business. Creato per leader che apprezzano stile ed efficienza. Connessione immediata tramite NFC o codice QR con design premium personalizzato per il tuo brand. KHContactum – il nuovo linguaggio della comunicazione aziendale.",
    contactsLabel: "Contattaci",
  },
  fa: {
    appTitle: "KHContactum",
    username: "نام کاربری",
    password: "رمز عبور",
    login: "ورود",
    description:
      "کارت‌های ویزیت دیجیتال KHContactum. کسب‌وکار با یک لمس آغاز می‌شود. KHContactum LLC یکی از پروژه‌های نوآورانه Khachatryans Holding CJSC است که فناوری و کسب‌وکار را به هم متصل می‌کند. طراحی‌شده برای رهبرانی که به سبک و کارایی اهمیت می‌دهند. ارتباط فوری از طریق NFC یا کد QR با طراحی پریمیوم اختصاصی برای برند شما. KHContactum — زبان جدید ارتباطات تجاری.",
    contactsLabel: "تماس با ما",
  },
  geo: {
    appTitle: "KHContactum",
    username: "მომხმარებლის სახელი",
    password: "პაროლი",
    login: "შესვლა",
    description:
      "KHContactum ციფრული ბიზნეს ბარათები. ბიზნესი იწყება ერთი შეხებით. KHContactum LLC არის Khachatryans Holding CJSC-ის კიდევ ერთი ინოვაციური პროექტი, რომელიც აერთიანებს ტექნოლოგიას და ბიზნესს. შექმნილია ლიდერებისთვის, რომლებიც აფასებენ სტილს და ეფექტურობას. მყისიერი კონտაქტი NFC ან QR კოდის საშუალებით, ინდივიდუალური პრემიუმ დიზაინით თქვენი ბრენდისთვის. KHContactum — ბიზნეს კომუნიკაციის ახალი ენა.",
    contactsLabel: "დაგვიკავშირდით",
  },

  // ✅ Turkish (TR) ավելացվեց՝ մնացած լոգիկան չփոփոխելով
  tr: {
    appTitle: "KHContactum",
    username: "Kullanıcı adı",
    password: "Şifre",
    login: "Giriş",
    description:
      "KHContactum dijital kartvizitler. İş dünyası tek bir dokunuşla başlar. KHContactum LLC, Khachatryans Holding CJSC’nin teknoloji ile işi birleştiren bir diğer yenilikçi projesidir. Stil ve verimliliğe değer veren liderler için tasarlandı. Markanız için kişiye özel premium tasarımla NFC veya QR kod üzerinden anında iletişim. KHContactum — iş iletişiminin yeni dili.",
    contactsLabel: "Bize ulaşın",
  },
};

function contactIcon(src, alt, href) {
  const isHttp = /^https?:\/\//i.test(href);
  return h(
    "a",
    {
      key: alt,
      href,
      className: "admin-login-contact",
      target: isHttp ? "_blank" : undefined,
      rel: isHttp ? "noreferrer noopener" : undefined,
    },
    h("img", { src, alt })
  );
}

export default function AdminLogin({
  onSuccess,
  lang: initialLang = "en",
  onLangChange,
}) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  const [lang, setLang] = useState(initialLang);
  const t = TEXT[lang] || TEXT.en;

  // ✅ Սինխրոնացնում ենք lang state-ը, երբ initialLang prop-ը փոխվում է
  useEffect(() => {
    if (initialLang && initialLang !== lang) {
      setLang(initialLang);
    }
  }, [initialLang]);

  // current URL (որպես fallback՝ "/admin")
  const currentHref =
    (typeof window !== "undefined" &&
      window.location &&
      window.location.href) ||
    "/admin";

  function handleLangChange(next) {
    setLang(next);
    if (onLangChange) onLangChange(next);
    try {
      // ✅ միայն sessionStorage — localStorage չենք օգտագործում
      sessionStorage.setItem("adminLang", next);
    } catch {}
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await adminLogin(u, p);

      try {
        // ✅ token –ը նույնպես միայն sessionStorage-ում
        sessionStorage.setItem("adminToken", token);
      } catch {}

      onSuccess && onSuccess(token);
    } catch (e2) {
      setErr(e2.message || "Bad creds");
    }
  }

  const RTL_LANGS = new Set(["ar", "fa"]);

  return h(
    PhoneShell,
    { title: "" },
    h(
      "div",
      { className: "admin-login-root" },

      h(
        "div",
        {
          className: "admin-login-panel",
          dir: RTL_LANGS.has(lang) ? "rtl" : "ltr",
          style: RTL_LANGS.has(lang) ? { textAlign: "right" } : {},
        },

        h(
          "div",
          { className: "admin-login-header-row" },
          // ⬇ KHContactum clickable link + full refresh
          h(
            "a",
            {
              href: currentHref,
              className:
                "admin-login-app-title admin-login-app-title-link",
            },
            t.appTitle
          ),
          h(
            "select",
            {
              className: "admin-login-lang-select",
              value: lang,
              onChange: (e) => handleLangChange(e.target.value),
            },
            LANGS.map((L) =>
              h("option", { key: L, value: L }, L.toUpperCase())
            )
          )
        ),

        h(
          "form",
          { onSubmit: submit, className: "admin-login-form" },
          h("input", {
            className: "input admin-login-input",
            placeholder: t.username,
            autoComplete: "username",
            value: u,
            onChange: (e) => setU(e.target.value),
          }),

          // 👁 password + show/hide
          h(
            "div",
            {
              style: {
                position: "relative",
                width: "100%",
              },
            },
            h("input", {
              className: "input admin-login-input",
              placeholder: t.password,
              type: showPass ? "text" : "password",
              autoComplete: "current-password",
              value: p,
              onChange: (e) => setP(e.target.value),
              style: { paddingRight: 40 },
            }),
            h(
              "button",
              {
                type: "button",
                onClick: () => setShowPass((v) => !v),
                style: {
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                },
              },
              showPass ? "🤦‍♀️" : "🙎‍♀️"
            )
          ),

          h(
            "button",
            { className: "btn admin-login-btn", type: "submit" },
            t.login
          ),
          err &&
            h("div", { className: "admin-login-error" }, err)
        ),

        h(
          "div",
          { className: "admin-login-description" },
          t.description
        ),

        h(
          "div",
          { className: "admin-login-logos" },
          h("img", {
            src: KHLogoHolding,
            alt: "KH Holding",
            className: "admin-login-logo-img",
          }),
          h("img", {
            src: KHLogoContactum,
            alt: "KHContactum",
            className: "admin-login-logo-img1",
          })
        ),

        h(
          "div",
          { className: "admin-login-contacts" },
          h(
            "div",
            { className: "admin-login-contacts-label" },
            t.contactsLabel
          ),
          h(
            "div",
            { className: "admin-login-contacts-row" },
            contactIcon(
              phoneIcon,
              "Phone",
              "tel:+37495776607"
            ),
            contactIcon(
              telegramIcon,
              "Telegram",
              "https://t.me/+37495776607"
            ),
            contactIcon(
              viberIcon,
              "Instagram",
              "https://www.instagram.com/khcontactum?igsh=NWcxZW1yOHc2Z2E1"
            ),
            contactIcon(
              whatsappIcon,
              "WhatsApp",
              "https://wa.me/37495776607"
            ),
            contactIcon(
              mailIcon,
              "Email",
              "mailto:contact@khachatryanholding.com"
            )
          )
        )
      )
    )
  );
}
