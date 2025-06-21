const Listing = require("../models/listing");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  const notFound = allListings.length === 0;

  res.render("listings/index", {
    allListings,
    notFound,
  });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params; //extract id
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;

//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "New Listing Created!");
//   res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const location = req.body.listing.location;

  // Geocode the location using Nominatim
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`
  );
  const geoData = await geoRes.json();

  // Fallback to Delhi if not found
  const coordinates = geoData[0]
    ? [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
    : [77.209, 28.6139];

  const newListing = new Listing({
    ...req.body.listing,
    image: { url, filename },
    owner: req.user._id,
    geometry: {
      type: "Point",
      coordinates,
    },
  });

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params; //extract id
  const listing = await Listing.findById(id); //find listing by id
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params; //fetch id
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
