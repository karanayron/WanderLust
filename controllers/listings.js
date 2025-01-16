const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).lean();
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
    console.log(req.body); // Debugging purpose
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
        const newListing = new Listing(req.body.listing);
        console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing created");
        res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).lean();
    if (listing.image) {
        listing.image = listing.image.url;
    } else {
        listing.image = null;
    }
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
    
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};