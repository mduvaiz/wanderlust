const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressErr = require("../util/ExpressErr.js");
const{reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listings.js")


const validateReview = (req,res,next)=>{
        let {error} = reviewSchema.validate(req.body);
        console.log(error);
        // 400 is the correct client-error status for failed Joi validation (450 is not a valid HTTP status).
        if (error) {
        throw new ExpressErr(400, error.details[0].message);
       }else{
        next();
       }
}
//Reviews
//POST Route
router.post("/", validateReview,async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.session.userId;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review was saved!");
    res.redirect(`/listings/${listing._id}`);
});
// Delete review: $pull removes the ref from the listing; redirect so the request actually finishes.
router.delete("/:reviewId",async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})

module.exports = router;