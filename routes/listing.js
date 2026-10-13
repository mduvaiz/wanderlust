const express = require("express");
const router = express.Router();
const ExpressErr = require("../util/ExpressErr.js");
const{listingSchema} = require("../schema.js");
const Listing = require("../models/listings.js")


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
    throw new ExpressErr(400, error.details.map(detail => detail.message).join(", "));
       }else{
        next();
       }
}


router.get("/",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
});
router.get("/new",(req,res)=>{
    res.render("listings/new");
});

//create route
router.post("/",validateListing,async (req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
        // let listing = req.body.listing;
        // new Listing(listing);

        // if(!req.body.listing){
        //     throw new ExpressErr(400,"Enter valid data!");
        // }
        console.log("req.body.listing");
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
});

router.get("/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing});
}); 

//Edit route
router.get("/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit",{listing});
});

//Update route
router.put("/:id", validateListing, async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing},{ runValidators: true });
    res.redirect(`/listings/${id}`);
});

//Delete route
router.delete("/:id",async (req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

module.exports = router;