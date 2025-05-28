const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//model defined
//sub schema for image

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // e.g., 'Point'
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: false,
    },
  },
  category: {
    type: String,
    enum: [
      "mountains",
      "arctic",
      "farms",
      "deserts",
      "pools",
      "beach",
      "castles",
      "compact house",
    ],
  },
});

//mongo middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
//model created
const Listing = mongoose.model("Listing", listingSchema);
//model export to app.js
module.exports = Listing;
