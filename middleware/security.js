const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

module.exports.helmetMiddleware = helmet({
    contentSecurityPolicy: false
});

function makeLimiter(limit, windowMs, message) {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        handler: (req, res, next) => {
            const err = new Error(message);
            err.statusCode = 429;
            next(err);
        }
    });
}

module.exports.loginLimiter = makeLimiter(10, 15 * 60 * 1000, "Too many login attempts. Try again in 15 minutes.");
module.exports.signupLimiter = makeLimiter(5, 60 * 60 * 1000, "Too many signups from this address. Try again later.");