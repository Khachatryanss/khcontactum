// client/src/pages/tabs/PasswordTab.js
import React, { useMemo, useState } from "react";
import { adminChangePassword } from "../../api.js";
const h = React.createElement;

/* ---------- UI TEXT BY LANGUAGE ---------- */
const PW_UI_TEXT = {
  am: {
    title: "Գաղտնաբառի փոփոխություն",

    oldLabel: "Հին գաղտնաբառ",
    newLabel: "Նոր գաղտնաբառ",
    repeatLabel: "Կրկնել նոր գաղտնաբառը",

    oldPlaceholder: "Հին գաղտնաբառը",
    newPlaceholder: "Նոր գաղտնաբառը",
    repeatPlaceholder: "Կրկնել նոր գաղտնաբառը",

    reqTitle: "Պահանջներ՝",
    reqLen: "Առնվազն 8 նիշ",
    reqLow: "Փոքրատառ",
    reqUp: "Մեծատառ",
    reqNum: "Թիվ",
    reqSym: "Սիմվոլ (., !, @, # …)",
    reqDiffOld: "Չկրկնել հինը",

    mismatch: "Չի համընկնում",

    saveButton: "Պահել",
    savingButton: "Պահվում է…",

    hint:
      "Հուշում․ Սերվերը ստուգում է հին գաղտնաբառը և կհրաժարվի, եթե նոր գաղտնաբառը արդեն օգտագործվում է այլ ադմինի կողմից։",

    toastNoToken: "No token",
    toastSuccess: "Գաղտնաբառը փոխվեց ✅",
    toastWrongOld: "Հին գաղտնաբառը սխալ է",
    toastInUse: "Այս գաղտնաբառը արդեն օգտագործվում է մեկ այլ ադմինի կողմից",
    toastRoute404: "Սերվերում գաղտնաբառ փոխելու ուղին չի գտնվել",
  },

  ru: {
    title: "Смена пароля",

    oldLabel: "Старый пароль",
    newLabel: "Новый пароль",
    repeatLabel: "Повторите новый пароль",

    oldPlaceholder: "Старый пароль",
    newPlaceholder: "Новый пароль",
    repeatPlaceholder: "Повторите новый пароль",

    reqTitle: "Требования:",
    reqLen: "Не менее 8 символов",
    reqLow: "Строчная буква",
    reqUp: "Заглавная буква",
    reqNum: "Цифра",
    reqSym: "Символ (., !, @, # …)",
    reqDiffOld: "Не повторять старый пароль",

    mismatch: "Пароли не совпадают",

    saveButton: "Сохранить",
    savingButton: "Сохранение...",

    hint:
      "Подсказка: сервер проверяет старый пароль и отклонит новый, если он уже используется другим администратором.",

    toastNoToken: "Нет токена",
    toastSuccess: "Пароль изменён ✅",
    toastWrongOld: "Старый пароль указан неверно",
    toastInUse: "Этот пароль уже используется другим администратором",
    toastRoute404: "На сервере не найден маршрут смены пароля",
  },

  en: {
    title: "Change password",

    oldLabel: "Current password",
    newLabel: "New password",
    repeatLabel: "Repeat new password",

    oldPlaceholder: "Current password",
    newPlaceholder: "New password",
    repeatPlaceholder: "Repeat new password",

    reqTitle: "Requirements:",
    reqLen: "At least 8 characters",
    reqLow: "Lowercase letter",
    reqUp: "Uppercase letter",
    reqNum: "Number",
    reqSym: "Symbol (., !, @, # …)",
    reqDiffOld: "Do not repeat the old password",

    mismatch: "Passwords do not match",

    saveButton: "Save",
    savingButton: "Saving...",

    hint:
      "Hint: The server checks your current password and will reject the new one if it is already used by another admin.",

    toastNoToken: "No token",
    toastSuccess: "Password changed ✅",
    toastWrongOld: "The current password is incorrect",
    toastInUse: "This password is already used by another admin",
    toastRoute404: "Password change route not found on the server",
  },

  ar: {
    title: "تغيير كلمة المرور",

    oldLabel: "كلمة المرور الحالية",
    newLabel: "كلمة المرور الجديدة",
    repeatLabel: "تأكيد كلمة المرور الجديدة",

    oldPlaceholder: "كلمة المرور الحالية",
    newPlaceholder: "كلمة المرور الجديدة",
    repeatPlaceholder: "تأكيد كلمة المرور الجديدة",

    reqTitle: "المتطلبات:",
    reqLen: "ثمانية أحرف على الأقل",
    reqLow: "حرف صغير",
    reqUp: "حرف كبير",
    reqNum: "رقم",
    reqSym: "رمز (., !, @, # …)",
    reqDiffOld: "عدم تكرار كلمة المرور القديمة",

    mismatch: "كلمتا المرور غير متطابقتين",

    saveButton: "حفظ",
    savingButton: "جارٍ الحفظ...",

    hint:
      "ملاحظة: الخادم يتحقق من كلمة المرور الحالية وسيرفض الجديدة إذا كانت مستخدمة بالفعل من قبل مشرف آخر.",

    toastNoToken: "لا يوجد رمز (token)",
    toastSuccess: "تم تغيير كلمة المرور ✅",
    toastWrongOld: "كلمة المرور الحالية غير صحيحة",
    toastInUse: "هذه الكلمة مستخدمة بالفعل من قبل مشرف آخر",
    toastRoute404: "مسار تغيير كلمة المرور غير موجود على الخادم",
  },

  fr: {
    title: "Modification du mot de passe",

    oldLabel: "Ancien mot de passe",
    newLabel: "Nouveau mot de passe",
    repeatLabel: "Répéter le nouveau mot de passe",

    oldPlaceholder: "Ancien mot de passe",
    newPlaceholder: "Nouveau mot de passe",
    repeatPlaceholder: "Répéter le nouveau mot de passe",

    reqTitle: "Exigences :",
    reqLen: "Au moins 8 caractères",
    reqLow: "Lettre minuscule",
    reqUp: "Lettre majuscule",
    reqNum: "Chiffre",
    reqSym: "Symbole (., !, @, # …)",
    reqDiffOld: "Ne pas répéter l'ancien mot de passe",

    mismatch: "Les mots de passe ne correspondent pas",

    saveButton: "Enregistrer",
    savingButton: "Enregistrement...",

    hint:
      "Astuce : le serveur vérifie votre ancien mot de passe et refusera le nouveau s’il est déjà utilisé par un autre administrateur.",

    toastNoToken: "Pas de jeton (token)",
    toastSuccess: "Mot de passe modifié ✅",
    toastWrongOld: "L'ancien mot de passe est incorrect",
    toastInUse:
      "Ce mot de passe est déjà utilisé par un autre administrateur",
    toastRoute404:
      "La route de changement de mot de passe est introuvable sur le serveur",
  },

  // 🇰🇿 Kazakh
  kz: {
    title: "Құпиясөзді өзгерту",

    oldLabel: "Ескі құпиясөз",
    newLabel: "Жаңа құпиясөз",
    repeatLabel: "Жаңа құпиясөзді қайталау",

    oldPlaceholder: "Ескі құпиясөз",
    newPlaceholder: "Жаңа құпиясөз",
    repeatPlaceholder: "Жаңа құпиясөзді қайталау",

    reqTitle: "Талаптар:",
    reqLen: "Кемінде 8 таңба",
    reqLow: "Кіші әріп",
    reqUp: "Бас әріп",
    reqNum: "Сан",
    reqSym: "Таңба (., !, @, # …)",
    reqDiffOld: "Ескі құпиясөзді қайталамау",

    mismatch: "Құпиясөздер сәйкес келмейді",

    saveButton: "Сақтау",
    savingButton: "Сақталуда...",

    hint:
      "Ескерту: Сервер ескі құпиясөзді тексереді және жаңа құпияսөз басқа админде қолданылып жатса, оны қабылдамайды.",

    toastNoToken: "Token жоқ",
    toastSuccess: "Құпияսөз сәтті өзгертілді ✅",
    toastWrongOld: "Ескі құпияսөз қате енгізілді",
    toastInUse: "Бұл құпияսөз басқа админде қолданылып жатыр",
    toastRoute404: "Սерверде құպияսөзը փոխելու маршруты табիլմադի",
  },

  // 🇨🇳 Chinese (Simplified)
  chn: {
    title: "修改密码",

    oldLabel: "当前密码",
    newLabel: "新密码",
    repeatLabel: "重复新密码",

    oldPlaceholder: "当前密码",
    newPlaceholder: "新密码",
    repeatPlaceholder: "重复新密码",

    reqTitle: "要求：",
    reqLen: "至少 8 个字符",
    reqLow: "至少一个小写字母",
    reqUp: "至少一个大写字母",
    reqNum: "至少一个数字",
    reqSym: "至少一个符号 (., !, @, # …)",
    reqDiffOld: "不能与旧密码相同",

    mismatch: "两次输入的密码不一致",

    saveButton: "保存",
    savingButton: "正在保存...",

    hint:
      "提示：服务器会验证当前密码，如果新密码已经被其他管理员使用，将会被拒绝。",

    toastNoToken: "没有 token",
    toastSuccess: "密码已修改 ✅",
    toastWrongOld: "当前密码不正确",
    toastInUse: "该密码已被其他管理员使用",
    toastRoute404: "服务器上找不到修改密码的接口",
  },

  // ✅ NEW langs — EN fallback until translations are added
  de: {
    title: "Change password",
    oldLabel: "Current password",
    newLabel: "New password",
    repeatLabel: "Repeat new password",
    oldPlaceholder: "Current password",
    newPlaceholder: "New password",
    repeatPlaceholder: "Repeat new password",
    reqTitle: "Requirements:",
    reqLen: "At least 8 characters",
    reqLow: "Lowercase letter",
    reqUp: "Uppercase letter",
    reqNum: "Number",
    reqSym: "Symbol (., !, @, # …)",
    reqDiffOld: "Do not repeat the old password",
    mismatch: "Passwords do not match",
    saveButton: "Save",
    savingButton: "Saving...",
    hint:
      "Hint: The server checks your current password and will reject the new one if it is already used by another admin.",
    toastNoToken: "No token",
    toastSuccess: "Password changed ✅",
    toastWrongOld: "The current password is incorrect",
    toastInUse: "This password is already used by another admin",
    toastRoute404: "Password change route not found on the server",
  },

  es: {
    title: "Change password",
    oldLabel: "Current password",
    newLabel: "New password",
    repeatLabel: "Repeat new password",
    oldPlaceholder: "Current password",
    newPlaceholder: "New password",
    repeatPlaceholder: "Repeat new password",
    reqTitle: "Requirements:",
    reqLen: "At least 8 characters",
    reqLow: "Lowercase letter",
    reqUp: "Uppercase letter",
    reqNum: "Number",
    reqSym: "Symbol (., !, @, # …)",
    reqDiffOld: "Do not repeat the old password",
    mismatch: "Passwords do not match",
    saveButton: "Save",
    savingButton: "Saving...",
    hint:
      "Hint: The server checks your current password and will reject the new one if it is already used by another admin.",
    toastNoToken: "No token",
    toastSuccess: "Password changed ✅",
    toastWrongOld: "The current password is incorrect",
    toastInUse: "This password is already used by another admin",
    toastRoute404: "Password change route not found on the server",
  },

  it: {
    title: "Change password",
    oldLabel: "Current password",
    newLabel: "New password",
    repeatLabel: "Repeat new password",
    oldPlaceholder: "Current password",
    newPlaceholder: "New password",
    repeatPlaceholder: "Repeat new password",
    reqTitle: "Requirements:",
    reqLen: "At least 8 characters",
    reqLow: "Lowercase letter",
    reqUp: "Uppercase letter",
    reqNum: "Number",
    reqSym: "Symbol (., !, @, # …)",
    reqDiffOld: "Do not repeat the old password",
    mismatch: "Passwords do not match",
    saveButton: "Save",
    savingButton: "Saving...",
    hint:
      "Hint: The server checks your current password and will reject the new one if it is already used by another admin.",
    toastNoToken: "No token",
    toastSuccess: "Password changed ✅",
    toastWrongOld: "The current password is incorrect",
    toastInUse: "This password is already used by another admin",
    toastRoute404: "Password change route not found on the server",
  },

  fa: {
    title: "Change password",
    oldLabel: "Current password",
    newLabel: "New password",
    repeatLabel: "Repeat new password",
    oldPlaceholder: "Current password",
    newPlaceholder: "New password",
    repeatPlaceholder: "Repeat new password",
    reqTitle: "Requirements:",
    reqLen: "At least 8 characters",
    reqLow: "Lowercase letter",
    reqUp: "Uppercase letter",
    reqNum: "Number",
    reqSym: "Symbol (., !, @, # …)",
    reqDiffOld: "Do not repeat the old password",
    mismatch: "Passwords do not match",
    saveButton: "Save",
    savingButton: "Saving...",
    hint:
      "Hint: The server checks your current password and will reject the new one if it is already used by another admin.",
    toastNoToken: "No token",
    toastSuccess: "Password changed ✅",
    toastWrongOld: "The current password is incorrect",
    toastInUse: "This password is already used by another admin",
    toastRoute404: "Password change route not found on the server",
  },
  geo: {
  title: "პაროლის შეცვლა",

  oldLabel: "მიმდინარე პაროლი",
  newLabel: "ახალი პაროლი",
  repeatLabel: "გაიმეორეთ ახალი პაროლი",

  oldPlaceholder: "მიმდინარე პაროლი",
  newPlaceholder: "ახალი პაროლი",
  repeatPlaceholder: "გაიმეორეთ ახალი პაროლი",

  reqTitle: "პահանջები:",
  reqLen: "მინიმუმ 8 სიმბოლო",
  reqLow: "ქვედა რეგისტრის ასო",
  reqUp: "ზედა რეგისტრის ასო",
  reqNum: "ციფრი",
  reqSym: "სიმბოლო (., !, @, # …)",
  reqDiffOld: "არ გაიმეოროთ ძველი პაროლი",

  mismatch: "პაროლები არ ემთხვევა",

  saveButton: "შენახვა",
  savingButton: "ინახება...",

  hint:
    "მინიშნება: სერვერი ამოწმებს მიმდინარე პაროლს და უარყოფს ახალს, եթե იგი უკვე გამოყენებულია სხვა ადმინის կողմից.",

  toastNoToken: "ტოკენი არ მოიძებნა",
  toastSuccess: "პაროლი შეცვლილია ✅",
  toastWrongOld: "მიმდინარე პაროლი սխալ է",
  toastInUse: "ეს პაროლი უკვე გამოიყენება სხვა ადმინის მიერ",
  toastRoute404: "სერვერზე პაროლის შეცვლის route ვერ მოიძებნა",
},
};

/* ---------- COMPONENT ---------- */
export default function PasswordTab({ token: propToken, uiLang = "en" }) {
  const token =
    propToken ||
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    "";

  const T = PW_UI_TEXT[uiLang] || PW_UI_TEXT.en;

  const [vals, setVals] = useState({ old: "", p1: "", p2: "" });
  const [show, setShow] = useState({ old: false, p1: false, p2: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // {type,msg}

  const onChange = (k) => (e) =>
    setVals((s) => ({ ...s, [k]: e.target.value }));

  // password requirements (>=8, lower, upper, number, symbol, != old, and match)
  const req = useMemo(() => {
    const p = vals.p1 || "";
    return {
      len: p.length >= 8,
      low: /[a-z\u0561-\u0587]/.test(p),
      up: /[A-Z\u0531-\u0556]/.test(p),
      num: /\d/.test(p),
      sym: /[^A-Za-z0-9\u0531-\u0556\u0561-\u0587]/.test(p),
      match: vals.p1 === vals.p2 && vals.p1.length > 0,
      diffOld: vals.p1 !== "" && vals.p1 !== vals.old,
    };
  }, [vals]);

  const allOk =
    req.len &&
    req.low &&
    req.up &&
    req.num &&
    req.sym &&
    req.match &&
    req.diffOld &&
    !!vals.old;

  function note(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2200);
  }

  async function save() {
    if (!allOk || loading) return;
    if (!token) {
      note("err", T.toastNoToken);
      return;
    }
    setLoading(true);
    try {
      await adminChangePassword(token, {
        old_password: vals.old,
        new_password: vals.p1,
      });

      // success
      setVals({ old: "", p1: "", p2: "" });
      note("ok", T.toastSuccess);
    } catch (e) {
      const m = String(e.message || "Error");
      if (/old.*password|incorrect|invalid/i.test(m)) {
        note("err", T.toastWrongOld);
      } else if (/in use|already used|exists|409|conflict/i.test(m)) {
        note("err", T.toastInUse);
      } else if (/not found|404/i.test(m)) {
        note("err", T.toastRoute404);
      } else {
        note("err", m);
      }
    } finally {
      setLoading(false);
    }
  }

  const Row = (label, field, help) =>
    h(
      "label",
      { className: "block mb-3", id: "firstPasswordBlock" },
      h("div", { className: "text-sm mb-1" }, label),
      field,
      help || null
    );

  const Eye = (k) =>
    h(
      "button",
      {
        type: "button",
        className: "btn-ghost",
        onClick: () => setShow((s) => ({ ...s, [k]: !s[k] })),
        style: { marginLeft: 6 },
      },
      show[k] ? "🤦‍♀️" : "🙎‍♀️"
    );

  const Checklist = ({ ok, label }) =>
    h(
      "div",
      {
        className: "small",
        style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          opacity: ok ? 1 : 0.6,
        },
      },
      h("span", null, ok ? "✅" : "•"),
      h("span", null, label)
    );

  return h(
    "div",
    {
      className: "password-tab-root", // ✅ UNIC root (card class removed)
      id: "p",
    },

    h(
      "h2",
      { className: "company-title", style: { marginTop: 0 } },
      T.title
    ),

    toast &&
      h(
        "div",
        {
          className: `toast ${toast.type}`,
          style: {
            padding: "8px 10px",
            borderRadius: 8,
            border:
              toast.type === "ok"
                ? "1px solid #c8ead0"
                : "1px solid #f5c2c7",
            background: toast.type === "ok" ? "#effaf2" : "#fff5f6",
            color: toast.type === "ok" ? "#215a2e" : "#9a1c24",
          },
        },
        toast.msg
      ),

    Row(
      T.oldLabel,
      h(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        h("input", {
          className: "input",
          type: show.old ? "text" : "password",
          value: vals.old,
          onChange: onChange("old"),
          placeholder: T.oldPlaceholder,
        }),
        Eye("old")
      )
    ),

    Row(
      T.newLabel,
      h(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        h("input", {
          className: "input",
          type: show.p1 ? "text" : "password",
          value: vals.p1,
          onChange: onChange("p1"),
          placeholder: T.newPlaceholder,
        }),
        Eye("p1")
      ),
      h(
        "div",
        { style: { display: "grid", gap: 4, marginTop: 6 } },
        h(
          "div",
          { className: "small", id: "passwordText", style: { opacity: 0.8 } },
          T.reqTitle
        ),
        h(Checklist, { ok: req.len, label: T.reqLen }),
        h(Checklist, { ok: req.low, label: T.reqLow }),
        h(Checklist, { ok: req.up, label: T.reqUp }),
        h(Checklist, { ok: req.num, label: T.reqNum }),
        h(Checklist, { ok: req.sym, label: T.reqSym }),
        h(Checklist, { ok: req.diffOld, label: T.reqDiffOld })
      )
    ),

    Row(
      T.repeatLabel,
      h(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        h("input", {
          className: "input",
          type: show.p2 ? "text" : "password",
          value: vals.p2,
          onChange: onChange("p2"),
          placeholder: T.repeatPlaceholder,
        }),
        Eye("p2")
      ),
      !req.match &&
        vals.p2.length > 0 &&
        h(
          "div",
          {
            className: "small",
            style: { color: "#a00000", marginTop: 4 },
          },
          T.mismatch
        )
    ),

    h(
      "div",
      { className: "row", style: { marginTop: 6 } },
      h(
        "button",
        { className: "btn", disabled: !allOk || loading, onClick: save },
        loading ? T.savingButton : T.saveButton
      )
    ),

    h(
      "div",
      { className: "small", style: { opacity: 0.65 } },
      T.hint
    )
  );
}
