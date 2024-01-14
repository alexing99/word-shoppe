const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Word Shoppe",
    item_count: numItems,
    category_count: numCategories,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "name price").sort({ item: 1 }).exec();
  res.render("item_list", {
    title: "Words",
    item_list: allItems,
  });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  res.render("item_detail", {
    title: item.name,
    item: item,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ category: 1 }).exec();
  res.render("item_form", { title: "Add Word", category_list: allCategories });
});

// Handle book create on POST.
exports.item_create_post = [
  // Convert the genre to an array.
  //   (req, res, next) => {
  //     if (!Array.isArray(req.body.genre)) {
  //       req.body.genre =
  //         typeof req.body.genre === "undefined" ? [] : [req.body.genre];
  //     }
  //     next();
  //   },

  // Validate and sanitize fields.
  body("name", "name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("category", "Part of speech must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "definition must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const allCategories = await Category.find().sort({ category: 1 }).exec();

      // Mark our selected genres as checked.
      //   for (const genre of allGenres) {
      //     if (book.genre.includes(genre._id)) {
      //       genre.checked = "true";
      //     }

      res.render("item_form", {
        title: "Add Word",
        category_list: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    // No results.
    res.redirect("catalog/items");
  }

  res.render("item_delete", {
    title: "Delete Word",
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  await Item.deleteOne(item);
  res.redirect("/catalog/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented");
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented");
});
