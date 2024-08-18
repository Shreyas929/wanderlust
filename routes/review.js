const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js"); // Add this line to import Listing model
const Review = require("../models/review.js");   // Add this line to import Review model
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const listingController=require("../controller/reviews.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post("/",isLoggedIn,wrapAsync(listingController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(listingController.deleteReview));

module.exports = router;
