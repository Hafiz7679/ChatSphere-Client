const DOMPurify = require("dompurify");

function sanitizeHtml(str) {
  if (typeof str !== "string") return "";
  return DOMPurify.sanitize(str, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "u", "br", "p", "span"],
    ALLOWED_ATTR: [],
  });
}

function stripHtmlTags(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "");
}

module.exports = {
  sanitizeHtml,
  stripHtmlTags,
};