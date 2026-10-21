const bcrypt = require("bcrypt");

const COST = 12;

async function hashPassword(plain) {
  return bcrypt.hash(plain, COST);
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// Only same-site relative paths. Blocks "//evil.com" and "/\evil.com".
function safeReturnTo(url) {
  if (typeof url !== "string") return null;
  if (!url.startsWith("/") || url.startsWith("//") || url.startsWith("/\\")) return null;
  return url;
}

function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    if (req.method === "GET") req.session.returnTo = safeReturnTo(req.originalUrl);
    req.flash("error", "You must be logged in first.");
    return res.redirect("/login");
  }
  next();
}

module.exports = { hashPassword, verifyPassword, isLoggedIn, safeReturnTo };