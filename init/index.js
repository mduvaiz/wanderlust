// Load env first so this seed script can use MONGO_URL without a hardcoded URI.
require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

main().then(()=>{
    console.log("Mongoose connected");
}).catch((err)=>{
    console.log("err");
})
async function main() {
    // Use MONGO_URL from env instead of a hardcoded local URI.
    await mongoose.connect(process.env.MONGO_URL)
}

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
