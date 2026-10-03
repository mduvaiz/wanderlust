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
const session = require("express-session");
const flash = require("connect-flash");


main().then(()=>{
    console.log("Mongoose connected");
}).catch((err)=>{
    console.log("err");
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverrride("_method"));
app.locals.layout = "/layouts/boilerplate";

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next(); 
})
app.get("/",(req,res)=>{
    res.send("Home site is working!");
});


app.use("/listings",listings);
app.use("/listings/:id/reviews/",reviews);

//reviews
app.use((req, res) => {
  res.status(404).render("error.ejs", { message: "Page not found" });
});


app.use((err,req,res,next)=>{
    console.error(err);

    let statusCode = err.status || 500;
    let message = err.message || "Something went wrong";

    if (err.name === "CastError") {
        statusCode = 404;
        message = "Please enter a valid ID";
    }

    res.status(statusCode).render("error.ejs",{ message });
});
// app.use((err,req,res,next)=>{
//     console.log(err);
//     let statusCode = err.status || 500;
//     let message = err.message || "Page not found";
//     if (err.name === "CastError") {
//     statusCode = 404;
//     message = "please enter valid id";
//   }else{
//     statusCode = 500;    
//     message = err.message;
//   }
//     res.status(statusCode).render("error.ejs",{message});
// });

// app.use((err,req,res,next)=>{
//     res.send("Something went wrong!");
// });

app.listen(8080,()=>{
    console.log("Server is istening");
});