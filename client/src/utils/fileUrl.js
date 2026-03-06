// client/src/utils/fileUrl.js
import { API } from "../api.js";

/**
 * Build absolute URL for uploaded files (images / videos / any media).
 *
 * Rules:
 * - Empty/null/undefined → returns empty string.
 * - Already absolute (http/https/data/blob) → returned as-is.
 * - Relative value that already contains "/file/" → prepend backend origin.
 * - Raw filename (no "/") → becomes `${BACKEND_ORIGIN}/file/<filename>`.
 * - Other relative paths → prepend backend origin as-is.
 *
 * Backend base is resolved from:
 * - import.meta.env.VITE_API_URL         (preferred, file host)
 * - import.meta.env.VITE_API_BASE        (fallback, existing API base)
 * - API from ../api.js                   (runtime fallback)
 * - window.location.origin               (last-resort in browser)
 */

// Resolve backend base only once on module init
let FILE_API_ORIGIN = "";

try {
  // Prefer explicit file host, then existing API base, then API constant.
  // Vite inlines import.meta.env at build time.
  const env = typeof import.meta !== "undefined" ? import.meta.env || {} : {};
  const rawBase =
    env.VITE_API_URL ||
    env.VITE_API_BASE ||
    API ||
    "http://localhost:5050";

  const url = new URL(String(rawBase));
  FILE_API_ORIGIN = url.origin.replace(/\/+$/, "");
} catch {
  FILE_API_ORIGIN = "";
}

function getBackendOrigin() {
  if (FILE_API_ORIGIN) return FILE_API_ORIGIN;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return "";
}

export function fileUrl(u = "") {
  if (!u) return "";

  const raw = String(u).trim();

  // Already absolute or data/blob: return untouched.
  if (/^(data:|https?:\/\/|blob:)/i.test(raw)) {
    return raw;
  }

  const baseOrigin = getBackendOrigin();

  // Nothing sensible to prepend to – just return original raw value.
  if (!baseOrigin) {
    return raw;
  }

  // Normalise initial value (strip optional "server/" prefix)
  let value = raw.replace(/^server\//i, "");

  // Case 1: already contains "/file/" segment → treat as a file route path.
  if (/\/file\//i.test(value) || /^file\//i.test(value)) {
    if (!value.startsWith("/")) value = "/" + value;
    return `${baseOrigin}${value}`;
  }

  // Case 2: looks like a bare filename (no slash chars) → mount under /file/
  if (!value.includes("/")) {
    const filename = value.replace(/^\/+/, "");
    return `${baseOrigin}/file/${filename}`;
  }

  // Case 3: generic relative path (e.g. "/uploads/xyz.jpg")
  if (!value.startsWith("/")) value = "/" + value;
  return `${baseOrigin}${value}`;
}
