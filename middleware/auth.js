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

const mongoose = require("mongoose");
const Listing = require("../models/listings");
const Review = require("../models/review");

function httpError(statusCode, message) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw httpError(404, "Listing not found");

    const listing = await Listing.findById(id).select("owner");
    if (!listing) throw httpError(404, "Listing not found");

    // Fails closed: old listings with no owner are denied to everyone.
    if (!listing.owner || listing.owner.toString() !== req.session.userId) {
        throw httpError(403, "You are not allowed to do that");
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) throw httpError(404, "Review not found");

    const review = await Review.findById(reviewId).select("author");
    if (!review) throw httpError(404, "Review not found");

    if (!review.author || review.author.toString() !== req.session.userId) {
        throw httpError(403, "You are not allowed to do that");
    }
    next();
};
Object.assign(module.exports, { hashPassword, verifyPassword, isLoggedIn, safeReturnTo });