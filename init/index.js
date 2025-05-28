const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//basic connection function
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

const initDB = async () => {
  await Listing.deleteMany({}); //clean all existing data
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "682cb91e4535570d77ff40c1",
  }));
  await Listing.insertMany(initData.data); //insert data
  console.log("Data was initialized");
};

initDB();
