const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview, isLoggesIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

//Reviews - POST Router
router.post("/", validateReview, isLoggesIn, wrapAsync(reviewController.createReview) );
 
 //Delte review route
 router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.destroyReview));

 module.exports = router;