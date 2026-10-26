// Load env vars first so Mongo, session secret, and PORT are available before any config runs.
require("dotenv").config();

// Fail fast on the first missing/empty required env var so the process never starts half-configured.
for (const name of ["SESSION_SECRET", "MONGO_URL", "PORT"]) {
    if (!process.env[name]) {
        throw new Error(`Missing required env var: ${name}`);
    }
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverrride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./util/ExpressErr.js");
const { json } = require("stream/consumers");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const { helmetMiddleware, loginLimiter, signupLimiter } = require("./middleware/security.js");

main().then(()=>{
    console.log("Mongoose connected");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    // Use MONGO_URL from env instead of a hardcoded local URI.
    await mongoose.connect(process.env.MONGO_URL)
}

app.use(helmetMiddleware);
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverrride("_method"));
app.locals.layout = "/layouts/boilerplate";

// Session cookies: no empty sessions, maxAge-only expiry, CSRF-safer SameSite, HTTPS-only in production.
const sessionOptions = {
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    name: "wl.sid",
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true,
        sameSite : "lax",
        secure : process.env.NODE_ENV === "production",
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // Expose session user id to all views so the navbar can switch Login/Signup vs Logout.
    res.locals.currentUserId = req.session.userId || null;
    next(); 
})
app.use((req, res, next) => {
    res.locals.currentUserId = req.session.userId || null;
    next();
});
app.get("/",(req,res)=>{
    res.send("Home site is working!");
});


app.post("/login", loginLimiter);
app.post("/signup", signupLimiter);
app.use("/", userRouter);
app.use("/listings",listings);
app.use("/listings/:id/reviews/",reviews);

// Catch unmatched routes so unknown URLs get a 404 page instead of hanging.
app.use((req, res) => {
  res.status(404).render("error.ejs", { message: "Page not found" });
});

// Single error handler: keep CastError → 404, never leak 500 internals to the client.
app.use((err,req,res,next)=>{
    console.error(err);

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Something went wrong";

    if (err.name === "CastError") {
        statusCode = 404;
        message = "Please enter a valid ID";
    }

    if (statusCode === 500) {
        message = "Something went wrong";
    }

    res.status(statusCode).render("error.ejs",{ message });
});

app.listen(process.env.PORT,()=>{
    console.log("Server is istening");
});
