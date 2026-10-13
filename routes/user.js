const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/signup", (req, res) => {
    res.status(501).send("not implemented");
});

router.post("/login", (req, res) => {
    res.status(501).send("not implemented");
});

router.post("/logout", (req, res) => {
    res.status(501).send("not implemented");
});

module.exports = router;
