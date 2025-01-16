const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggesIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        //redirectURL save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    res.locals.currUser = req.user;
    let listing = await Listing.findById(id);
    // console.log(req.locals.currUser);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    res.locals.currUser = req.user;
    let review = await Review.findById(reviewId);
    // console.log(req.locals.currUser);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
};