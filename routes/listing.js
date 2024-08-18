const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer=require('multer');
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
     isLoggedIn,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.createList)
  );
router.route("/search").post(listingController.searchlist);
router.route("/beach").post(listingController.beach);
router.route("/farm").post(listingController.farm);
router.route("/camping").post(listingController.camping);
router.route("/tropical").post(listingController.tropical);
router.route("/cities").post(listingController.cities);
router.route("/historical").post(listingController.historical)
router.route("/lake").post(listingController.lake);
router.route("/artic").post(listingController.artic);
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateList))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteList));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editList));

module.exports = router;
