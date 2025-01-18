const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggesIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/").get(wrapAsync(listingController.index))
    .post(isLoggesIn, upload.single('listing[image]'), wrapAsync(listingController.createListing))
   
//new route
router.get("/new", isLoggesIn, listingController.renderNewForm);

router.route("/:id").get(wrapAsync(listingController.showListing)).put(isLoggesIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing)).delete(isLoggesIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggesIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;