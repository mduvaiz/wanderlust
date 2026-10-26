const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type : String,
        required : true,
    }, 
    description : String,
    image : {
        filename : {type : String, default : "default-image"},
        url : {type : String, 
            default : "https://i.pinimg.com/originals/73/c6/9f/73c69f9a7814df00a5652b4ccf5884ad.jpg",
        set: (v) =>
            v === ""
                ? "https://i.pinimg.com/originals/73/c6/9f/73c69f9a7814df00a5652b4ccf5884ad.jpg"
                : v,
            },
    }, 
    price : Number,
    location : String,
    country : String,
    owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;