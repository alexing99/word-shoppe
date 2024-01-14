#! /usr/bin/env node

console.log(
  'This script populates some test words and categories for words to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");

  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function categoryCreate(index, name) {
  const category = new Category({ name: name });

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}
async function itemCreate(index, name, description, category, price) {
  const itemDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
  };
  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Verbs"),
    categoryCreate(1, "Nouns"),
    categoryCreate(2, "Contractions"),
    categoryCreate(3, "Onomanapeia"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(0, "kvell", "feel happy and proud", categories[0], 13),
    itemCreate(1, "be", "exist, occur; take place", categories[0], 1000000),
    itemCreate(
      2,
      "Earth",
      "the planet on which we live",
      categories[1],
      1000000000
    ),
    itemCreate(
      3,
      "necropolis",
      "a cemetery, especially a large one belonging to an ancient city",
      categories[1],
      2.55
    ),
    itemCreate(4, "can't", "can + not", categories[2], 5000),
    itemCreate(
      5,
      "y'all'll'nt've'd's",
      "You all will not have had us",
      categories[2],
      0
    ),
    itemCreate(
      6,
      "belch",
      "emit gas noisily from the stomach through the mouth",
      categories[3],
      25
    ),
    itemCreate(7, "boo", "boooooooo!", categories[3], 45),
  ]);
}
