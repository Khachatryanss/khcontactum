// client/src/utils/fileUrl.js
const API_BASE = "https://api.khcontactum.com";

export function getFileUrl(fileName) {
  if (!fileName) return "";

  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName;
  }

  const cleanName = fileName
    .replace(/^\/+/, "")
    .replace(/^file\//, "");

  return `${API_BASE}/file/${cleanName}`;
}
