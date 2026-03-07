// client/src/utils/fileUrl.js
const API_BASE = "https://api.khcontactum.com";

export function getFileUrl(fileName) {
  if (!fileName || typeof fileName !== "string") return "";

  const value = fileName.trim();
  if (!value) return "";

  // եթե արդեն ճիշտ API file URL է
  if (value.startsWith(`${API_BASE}/file/`)) {
    return value;
  }

  // եթե գալիս է հին / սխալ full URL-ով frontend domain-ից կամ onrender domain-ից,
  // վերցնում ենք միայն filename-ը և սարքում ճիշտ API URL
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value);
      const pathname = url.pathname || "";

      if (pathname.startsWith("/file/")) {
        const cleanName = pathname.replace(/^\/file\//, "");
        return `${API_BASE}/file/${cleanName}`;
      }

      return value;
    } catch {
      return value;
    }
  }

  // եթե գալիս է /file/filename կամ file/filename կամ պարզապես filename
  const cleanName = value
    .replace(/^\/+/, "")
    .replace(/^file\//, "");

  return `${API_BASE}/file/${cleanName}`;
}