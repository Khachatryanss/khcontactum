// client/src/pages/SuperAdminDashboard.js
import React, { useEffect, useState } from "react";
import PhoneShell from "../PhoneShell.js";
import { listAdmins, createAdmin, updateAdmin, deleteAdmin } from "../api.js";

const h = React.createElement;

export default function SuperAdminDashboard({ token, onLogout }) {
  const [list, setList] = useState([]);
  const [mode, setMode] = useState(null); // "create" | "change" | "delete" | "viewPass" | null
  const [msg, setMsg] = useState("");

  // create form
  const [createForm, setCreateForm] = useState({
    card_id: "",
    username: "",
    password: "",
  });

  // change form
  const [changeForm, setChangeForm] = useState({
    card_id: "",
    field: "card_id", // "card_id" | "username" | "password"
    newValue: "",
  });

  // delete form
  const [deleteForm, setDeleteForm] = useState({
    card_id: "",
  });

  const [selectedId, setSelectedId] = useState(null);

  // 🔍 search by card_id
  const [searchCard, setSearchCard] = useState("");
  const [searchAdmin, setSearchAdmin] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // 📂 users block open/closed
  const [showUsers, setShowUsers] = useState(true);

  // 🔐 view password panel
  const [viewCardId, setViewCardId] = useState("");
  const [viewPassword, setViewPassword] = useState("");

  /* ------------ load admins ------------ */
  async function load() {
    try {
      const data = await listAdmins(token);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e.message || "Auth error");
    }
  }

  useEffect(() => {
    if (token) load();
  }, [token]);

  /* ------------ helpers ------------ */
  function toggleMode(next) {
    setMsg("");
    setMode((prev) => (prev === next ? null : next));
  }

  function onRowClick(a) {
    setSelectedId(a.id);
    // auto-fill card_id for change/delete
    setChangeForm((cf) => ({
      ...cf,
      card_id: a.card_id != null ? String(a.card_id) : "",
    }));
    setDeleteForm((df) => ({
      ...df,
      card_id: a.card_id != null ? String(a.card_id) : "",
    }));
    // auto-fill for view password էլ կարող է օգտակար լինել
    setViewCardId(a.card_id != null ? String(a.card_id) : "");
    setViewPassword(""); // ուրիշ row սեղմելուց հին password-ը չմնա
  }

  /* ------------ SEARCH logic ------------ */
  function handleSearch() {
    setMsg("");
    const trimmed = searchCard.trim();
    setSearchAdmin(null);
    setSearchNotFound(false);

    if (!trimmed) {
      setMsg("Նախ գրիր card_id");
      return;
    }

    const admin = list.find((a) => String(a.card_id) === trimmed);
    if (!admin) {
      setSearchNotFound(true);
      return;
    }

    setSearchAdmin(admin);
    setSearchNotFound(false);

    // auto-fill change/delete ձևերը
    setChangeForm((cf) => ({
      ...cf,
      card_id: String(admin.card_id),
    }));
    setDeleteForm((df) => ({
      ...df,
      card_id: String(admin.card_id),
    }));
    // auto-fill նաև view password-ի card_id-ը
    setViewCardId(String(admin.card_id));
    setViewPassword("");
  }

  /* ------------ CREATE logic ------------ */
  async function handleCreate() {
    setMsg("");
    const { card_id, username, password } = createForm;

    if (!card_id || !username || !password) {
      setMsg("Լրացրու card_id, Login և Password դաշտերը");
      return;
    }

    const numericId = Number(card_id);
    if (!Number.isFinite(numericId)) {
      setMsg("card_id-ը պետք է լինի թիվ");
      return;
    }

    // uniqueness check
    if (list.some((a) => Number(a.card_id) === numericId)) {
      setMsg("Այդ card_id-ով admin արդեն կա");
      return;
    }
    if (
      list.some(
        (a) =>
          (a.username || "").toLowerCase() === username.trim().toLowerCase()
      )
    ) {
      setMsg("Այդ login-ով admin արդեն կա");
      return;
    }

    try {
      await createAdmin(token, {
        username: username.trim(),
        password,
        card_id: numericId,
      });
      setMsg("Admin-ը ստեղծվեց ✔");
      setCreateForm({ card_id: "", username: "", password: "" });
      setMode(null);
      await load();
    } catch (e) {
      setMsg(e.message || "Create failed");
    }
  }

  /* ------------ CHANGE logic ------------ */
  async function handleChange() {
    setMsg("");
    const { card_id, field, newValue } = changeForm;

    if (!card_id) {
      setMsg("Նախ գրիր card_id, որը պետք է գտնենք");
      return;
    }
    const admin = list.find((a) => String(a.card_id) === String(card_id));
    if (!admin) {
      setMsg("Նման card_id-ով admin չգտնվեց");
      return;
    }

    if (!newValue) {
      setMsg("Գրի նոր արժեքը");
      return;
    }

    const payload = {};

    if (field === "card_id") {
      const newIdNum = Number(newValue);
      if (!Number.isFinite(newIdNum)) {
        setMsg("Նոր card_id-ը պետք է լինի թիվ");
        return;
      }
      // uniqueness check for card_id
      if (
        list.some(
          (a) => a.id !== admin.id && Number(a.card_id) === newIdNum
        )
      ) {
        setMsg("Այդ card_id-ով admin արդեն գոյություն ունի");
        return;
      }
      payload.card_id = newIdNum;
    }

    if (field === "username") {
      const trimmed = newValue.trim();
      if (!trimmed) {
        setMsg("Login-ը չի կարող դատարկ լինել");
        return;
      }
      // uniqueness check for username
      if (
        list.some(
          (a) =>
            a.id !== admin.id &&
            (a.username || "").toLowerCase() === trimmed.toLowerCase()
        )
      ) {
        setMsg("Այդ login-ով admin արդեն կա");
        return;
      }
      payload.username = trimmed;
    }

    if (field === "password") {
      payload.password = newValue;
    }

    try {
      await updateAdmin(token, admin.id, payload);
      setMsg("Փոփոխությունը պահպանվեց ✔");
      setChangeForm((cf) => ({ ...cf, newValue: "" }));
      await load();
    } catch (e) {
      setMsg(e.message || "Change failed");
    }
  }

  /* ------------ DELETE logic ------------ */
  async function handleDelete() {
    setMsg("");
    const { card_id } = deleteForm;
    if (!card_id) {
      setMsg("Գրի card_id-ը, որը պետք է ջնջենք");
      return;
    }

    const admin = list.find((a) => String(a.card_id) === String(card_id));
    if (!admin) {
      setMsg("Նման card_id-ով admin չկա");
      return;
    }

    try {
      await deleteAdmin(token, admin.id);
      setMsg("Admin-ը և նրա հետ կապված տվյալները ջնջվեցին ✔");
      setDeleteForm({ card_id: "" });
      setSelectedId(null);
      setMode(null);
      await load();
    } catch (e) {
      setMsg(e.message || "Delete failed");
    }
  }

  /* ------------ VIEW PASSWORD logic ------------ */
  function handleViewPassword() {
    setMsg("");
    setViewPassword("");

    const trimmed = viewCardId.trim();
    if (!trimmed) {
      setMsg("Գրի card_id-ը, որի password-ը պետք է տեսնել");
      return;
    }

    const admin = list.find((a) => String(a.card_id) === trimmed);
    if (!admin) {
      setMsg("Նման card_id-ով admin չկա");
      return;
    }

    // listAdmins-ը պետք է վերադարձնի admin.password,
    // եթե backend-ում դա չես ուղարկում, այստեղ պարզապես զգուշացում կտանք.
    if (typeof admin.password === "undefined" || admin.password === null) {
      setMsg("Այս admin-ի password դաշտը backend-ից չի վերադարձվում");
      return;
    }

    setViewPassword(String(admin.password));
  }

  /* ------------	render helpers ------------ */
  const changePlaceholder =
    changeForm.field === "card_id"
      ? "Նոր card_id (unique number)"
      : changeForm.field === "username"
      ? "Նոր login (unique)"
      : "Նոր password";

  return h(
    PhoneShell,
    { title: "Ստեղծել / Փոփոխել / Ջնջել admin" },
    h(
      "div",
      { className: "card" },

      msg &&
        h(
          "div",
          {
            className: "small",
            style: { marginBottom: 8, color: "#a6ffb5" },
          },
          msg
        ),

      // big buttons
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 10,
          },
        },
        h(
          "button",
          { className: "btn", onClick: () => toggleMode("create") },
          "Create"
        ),
        h(
          "button",
          { className: "btn", onClick: () => toggleMode("change") },
          "Change"
        ),
        h(
          "button",
          { className: "btn", onClick: () => toggleMode("delete") },
          "Delete"
        ),
        // ⬇️ ՆՈՐ BUTTON – Delete-ի և Log out-ի միջև
        h(
          "button",
          { className: "btn", onClick: () => toggleMode("viewPass") },
          "View password"
        ),
        h(
          "button",
          {
            className: "btn",
            onClick: onLogout,
            style: { background: "#3c0000", color: "#fff" },
          },
          "Log out"
        )
      ),

      /* ----- search under logout ----- */
      h(
        "div",
        {
          style: {
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          },
        },
        h(
          "label",
          {
            className: "small",
            style: { color: "#cbd5f5" },
          },
          "Որոնում card_id-ով"
        ),

        // input + Search button in one row
        h(
          "div",
          {
            style: {
              display: "flex",
              gap: 6,
            },
          },
          h("input", {
            className: "input",
            placeholder: "օրինակ՝ 101",
            value: searchCard,
            onChange: (e) => setSearchCard(e.target.value),
            style: { flex: "1 0.5 100%" },
          }),
          h(
            "button",
            {
              type: "button",
              className: "btn",
              onClick: handleSearch,
              style: {
                padding: "0 14px",
                whiteSpace: "nowrap",
              },
            },
            "Search"
          )
        ),

        // search result / not found message
        searchAdmin &&
          h(
            "div",
            {
              style: {
                marginTop: 6,
                borderRadius: 8,
                background: "rgba(15,23,42,0.85)",
                padding: 6,
              },
            },
            h(
              "table",
              { className: "table" },
              h(
                "thead",
                null,
                h(
                  "tr",
                  null,
                  h("th", null, "ID"),
                  h("th", null, "User"),
                  h("th", null, "card_id"),
                  h("th", null, "active")
                )
              ),
              h(
                "tbody",
                null,
                h(
                  "tr",
                  {
                    onClick: () => onRowClick(searchAdmin),
                    style: { cursor: "pointer" },
                  },
                  h("td", null, String(searchAdmin.id)),
                  h("td", null, searchAdmin.username),
                  h("td", null, String(searchAdmin.card_id)),
                  h("td", null, String(searchAdmin.is_active))
                )
              )
            )
          ),

        !searchAdmin &&
          searchNotFound &&
          h(
            "div",
            {
              className: "small",
              style: {
                marginTop: 6,
                color: "#fecaca",
              },
            },
            "Չկա այդ card_id-ով օգտատեր"
          )
      ),

      /* ---------- CREATE panel ---------- */
      mode === "create" &&
        h(
          "div",
          {
            style: {
              padding: 8,
              borderRadius: 10,
              background: "rgba(0,0,0,0.35)",
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            },
          },
          h("div", { className: "small" }, "Ստեղծել նոր admin"),
          h("input", {
            className: "input",
            placeholder: "card_id (unique number)",
            value: createForm.card_id,
            onChange: (e) =>
              setCreateForm({ ...createForm, card_id: e.target.value }),
          }),
          h("input", {
            className: "input",
            placeholder: "Login (unique)",
            value: createForm.username,
            onChange: (e) =>
              setCreateForm({ ...createForm, username: e.target.value }),
          }),
          h("input", {
            className: "input",
            placeholder: "Password",
            type: "password",
            value: createForm.password,
            onChange: (e) =>
              setCreateForm({ ...createForm, password: e.target.value }),
          }),
          h(
            "button",
            {
              className: "btn",
              onClick: handleCreate,
              style: {
                alignSelf: "flex-end",
                padding: "6px 16px",
                fontSize: 12,
                marginTop: 4,
              },
            },
            "Create"
          )
        ),

      /* ---------- CHANGE panel ---------- */
      mode === "change" &&
        h(
          "div",
          {
            style: {
              padding: 8,
              borderRadius: 10,
              background: "rgba(0,0,0,0.35)",
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            },
          },
          h("div", { className: "small" }, "Փոփոխել admin-ի տվյալները"),
          h("input", {
            className: "input",
            placeholder: "Գրի card_id, որը պետք է գտնենք",
            value: changeForm.card_id,
            onChange: (e) =>
              setChangeForm({ ...changeForm, card_id: e.target.value }),
          }),
          h(
            "select",
            {
              className: "input",
              value: changeForm.field,
              onChange: (e) =>
                setChangeForm({ ...changeForm, field: e.target.value }),
            },
            h("option", { value: "card_id" }, "Փոխել card_id-ը"),
            h("option", { value: "username" }, "Փոխել login-ը"),
            h("option", { value: "password" }, "Փոխել password-ը")
          ),
          h("input", {
            className: "input",
            placeholder: changePlaceholder,
            value: changeForm.newValue,
            onChange: (e) =>
              setChangeForm({ ...changeForm, newValue: e.target.value }),
          }),
          h(
            "button",
            {
              className: "btn",
              onClick: handleChange,
              style: {
                alignSelf: "flex-end",
                padding: "6px 16px",
                fontSize: 12,
                marginTop: 4,
              },
            },
            "Apply change"
          )
        ),

      /* ---------- DELETE panel ---------- */
      mode === "delete" &&
        h(
          "div",
          {
            style: {
              padding: 8,
              borderRadius: 10,
              background: "rgba(0,0,0,0.35)",
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            },
          },
          h("div", { className: "small" }, "Ջնջել admin-ը ըստ card_id"),
          h("input", {
            className: "input",
            placeholder: "card_id, որը պետք է ջնջվի",
            value: deleteForm.card_id,
            onChange: (e) =>
              setDeleteForm({ ...deleteForm, card_id: e.target.value }),
          }),
          h(
            "button",
            {
              className: "btn",
              onClick: handleDelete,
              style: {
                alignSelf: "flex-end",
                padding: "6px 16px",
                fontSize: 12,
                marginTop: 4,
                background: "#4a0000",
              },
            },
            "Delete this admin"
          )
        ),

      /* ---------- VIEW PASSWORD panel ---------- */
      mode === "viewPass" &&
        h(
          "div",
          {
            style: {
              padding: 8,
              borderRadius: 10,
              background: "rgba(0,0,0,0.35)",
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            },
          },
          h("div", { className: "small" }, "Դիտել admin-ի password-ը ըստ card_id"),
          h("input", {
            className: "input",
            placeholder: "card_id, որի password-ը պետք է տեսնել",
            value: viewCardId,
            onChange: (e) => setViewCardId(e.target.value),
          }),
          h(
            "button",
            {
              className: "btn",
              onClick: handleViewPassword,
              style: {
                alignSelf: "flex-end",
                padding: "6px 16px",
                fontSize: 12,
                marginTop: 4,
              },
            },
            "Show password"
          ),
          viewPassword &&
            h("input", {
              className: "input",
              readOnly: true,
              value: viewPassword,
              style: { marginTop: 4 },
            })
        ),

      /* ---------- Users list (collapsible, ամբողջ լիստը) ---------- */
      h(
        "div",
        {
          style: {
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))",
          },
        },
        // header
        h(
          "button",
          {
            type: "button",
            onClick: () => setShowUsers((v) => !v),
            style: {
              width: "100%",
              padding: "8px 10px",
              background: "transparent",
              border: "none",
              color: "#e5e7eb",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            },
          },
          h("span", null, "Օգտատերերի ցուցակ"),
          h(
            "span",
            { style: { fontSize: 14, opacity: 0.8 } },
            showUsers ? "▾" : "▸"
          )
        ),

        // content
        showUsers &&
          h(
            "div",
            { style: { maxHeight: 320, overflowY: "auto" } },
            h(
              "table",
              { className: "table" },
              h(
                "thead",
                null,
                h(
                  "tr",
                  null,
                  h("th", null, "ID"),
                  h("th", null, "User"),
                  h("th", null, "card_id"),
                  h("th", null, "active")
                )
              ),
              h(
                "tbody",
                null,
                list.map((a) =>
                  h(
                    "tr",
                    {
                      key: a.id,
                      onClick: () => onRowClick(a),
                      style:
                        selectedId === a.id
                          ? { background: "rgba(255,255,255,0.08)" }
                          : null,
                    },
                    h("td", null, String(a.id)),
                    h("td", null, a.username),
                    h("td", null, String(a.card_id)),
                    h("td", null, String(a.is_active))
                  )
                ),
                !list.length &&
                  h(
                    "tr",
                    null,
                    h(
                      "td",
                      {
                        colSpan: 4,
                        style: {
                          padding: "6px 8px",
                          fontSize: 12,
                          color: "#9ca3af",
                        },
                      },
                      "Ցուցիչը դատարկ է"
                    )
                  )
              )
            )
          )
      )
    )
  );
}
