const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
    console.log("DBG: GET /login", req.session.returnTo);
    res.render("users/login.ejs");
});

const User = require("../models/user.js");
const { signupSchema, loginSchema } = require("../schema.js"); // adjust to your schema file name
const { hashPassword, verifyPassword, safeReturnTo } = require("../middleware/auth.js");

// Computed once at startup. Used so unknown-email logins still pay the bcrypt cost.
const dummyHash = hashPassword("not-a-real-password");

function startSession(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.userId = String(userId);
      req.session.save((err2) => (err2 ? reject(err2) : resolve()));
    });
  });
}

router.post("/signup", async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/signup");
  }

  let user;
  try {
    const passwordHash = await hashPassword(value.password);
    user = await User.create({
      username: value.username,
      email: value.email,
      passwordHash,
    });
  } catch (e) {
    if (e.code === 11000) {
      req.flash("error", "That username or email is already in use.");
      return res.redirect("/signup");
    }
    throw e;
  }

  await startSession(req, user._id);
  req.flash("success", "Welcome to Wanderlust!");
  res.redirect("/listings");
});

router.post("/login", async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  const user = await User.findOne({ email: value.email });
  const hash = user ? user.passwordHash : await dummyHash;
  const ok = await verifyPassword(value.password, hash);

  if (!user || !ok) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  const returnTo = req.session.returnTo;
  console.log("DBG: POST /login before regenerate", returnTo);
  req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      if (returnTo) req.session.returnTo = returnTo;
      req.session.save((err) => {
          if (err) return next(err);
          req.flash("success", "Welcome back!");
          console.log("DBG: POST /login redirect", returnTo || "/listings");
          res.redirect(returnTo || "/listings");
      });
  });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("wl.sid");
    res.redirect("/login");
  });
});

module.exports = router;
