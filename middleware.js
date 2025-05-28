const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectUrl save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you have to login to create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params; //fetch id
  let listing = await Listing.findById(id);
  // auth from hoppscotch api
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have access to this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

//validate by joi
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); //validate the data
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); //validate the data
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params; //fetch id
  let review = await Review.findById(reviewId);
  // auth from hoppscotch api
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have access to this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
