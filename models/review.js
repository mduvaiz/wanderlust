const mongoose =  require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating : {
        type: Number,
        min:1,
        max:5,
    },
    // Date.now (not Date.now()) so Mongoose evaluates a new timestamp per document, not once at schema load.
    createdAt : {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Review", reviewSchema);