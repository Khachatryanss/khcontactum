import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";

function ensureInitialManifestLink() {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const path = window.location.pathname || "/";
  const cardMatch = path.match(/^\/(\d+)$/);
  const href = cardMatch
    ? `/api/public/manifest/${encodeURIComponent(cardMatch[1])}`
    : "/api/public/manifest.json";

  let link = document.getElementById("app-manifest");
  if (!link) {
    link = document.createElement("link");
    link.id = "app-manifest";
    link.rel = "manifest";
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
  link.setAttribute("crossorigin", "anonymous");
}

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

ensureInitialManifestLink();
maybeRestorePublicCardRoute();

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(App));
