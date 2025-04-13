const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

//3 connect database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //name of database = wanderlust

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//6 after making index.ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//2 basic api
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//5 index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

//8 new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//7 show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; //extract id
  const listing = await Listing.findById(id); //find listing by id
  res.render("listings/show.ejs", { listing });
}));

//9 Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    //let {title, description, image, price, country, location} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//10 Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params; //extract id
  const listing = await Listing.findById(id); //find listing by id
  res.render("listings/edit.ejs", { listing });
}));

//11 update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params; //fetch id
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstruct = ...req.body.listing, and put in listing of id "id"
  //console.log(listing);
  //console.log(listing.image);

  res.redirect(`/listings/${id}`);
}));

//12 delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
}));

//4 new route
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Home",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//save in db
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful Testing");
// });

//13 error catch
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

//14 error throwß
app.all("/:path", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//1
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
