require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");
const User = require("../models/user.js");

const initDB = async () => {
    if (!process.env.SEED_OWNER_EMAIL) {
        throw new Error("SEED_OWNER_EMAIL is not set in .env");
    }

    await mongoose.connect(process.env.MONGO_URL);

    if (mongoose.connection.name !== "wanderlust") {
        throw new Error(`Refusing to seed database "${mongoose.connection.name}". Check MONGO_URL ends with /wanderlust`);
    }

    const owner = await User.findOne({ email: process.env.SEED_OWNER_EMAIL.toLowerCase() });
    if (!owner) {
        throw new Error(`No user found with email ${process.env.SEED_OWNER_EMAIL}. Sign up with that email first.`);
    }

    const listings = initData.data.map((listing) => ({
        ...listing,
        owner: owner._id,
    }));

    await Listing.deleteMany({});
    await Listing.insertMany(listings);
    console.log(`Seeded ${listings.length} listings into "${mongoose.connection.name}", owned by ${owner.username}`);
};

initDB()
    .catch((err) => {
        console.error("Seed failed:", err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());