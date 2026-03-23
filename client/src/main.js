import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  const mediaStandalone =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = window.navigator?.standalone === true;
  return mediaStandalone || iosStandalone;
}

function maybeRestorePublicCardRoute() {
  if (typeof window === "undefined") return;
  if (!isStandaloneMode()) return;
  if (window.location.pathname !== "/") return;

  // Never interfere with admin/superadmin explicit entry points.
  const blocked = ["/SARS"];
  if (blocked.includes(window.location.pathname)) return;

  try {
    if (sessionStorage.getItem("kh_restored_public_card_once") === "1") return;

    const savedPath = localStorage.getItem("kh_last_public_card_path") || "";
    const savedTs = Number(localStorage.getItem("kh_last_public_card_ts") || "0");
    const maxAgeMs = 30 * 24 * 60 * 60 * 1000; // 30 days

    if (!savedPath || !/^\/\d+$/.test(savedPath)) return;
    if (!savedTs || Date.now() - savedTs > maxAgeMs) return;

    sessionStorage.setItem("kh_restored_public_card_once", "1");
    window.location.replace(savedPath);
  } catch {}
}

maybeRestorePublicCardRoute();

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(App));
