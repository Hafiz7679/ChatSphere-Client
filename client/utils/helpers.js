const crypto = require("crypto");

function generateCsrfSecret() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  generateCsrfSecret,
  hashToken,
};