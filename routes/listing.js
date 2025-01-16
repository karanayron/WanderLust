const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggesIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.route("/").get(wrapAsync(listingController.index)).post(wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggesIn, listingController.renderNewForm);

router.route("/:id").get(wrapAsync(listingController.showListing)).put(isLoggesIn, isOwner, wrapAsync(listingController.updateListing)).delete(isLoggesIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggesIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;