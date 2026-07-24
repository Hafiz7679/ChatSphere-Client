import DOMPurify from "dompurify";

export const sanitizeHtml = (str) => {
  if (typeof str !== "string") return "";
  return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export const sanitizeHtmlSafe = (str) => {
  if (typeof str !== "string") return "";
  return DOMPurify.sanitize(str);
};

export const sanitizeFileName = (name) => {
  if (typeof name !== "string") return "file";
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").substring(0, 100);
};

export const escapeForDisplay = (str) => {
  if (typeof str !== "string") return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};
