const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ category: 1 }).exec();
  res.render("category_list", {
    title: "Parts of Speech",
    category_list: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  //   const desiredCategory = req.param.id;
  const wordsInCategory = await Item.find({ category: req.params.id });
  const category = await Category.findById(req.params.id).exec();
  res.render("category_detail", {
    title: req.params.name,
    category_detail: wordsInCategory,
    category: category,
  });
});
exports.category_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ category: 1 }).exec();
  res.render("category_form", {
    title: "Create Category",
    category_list: allCategories,
  });
  res.render("category_form");
});

exports.category_create_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect("/catalog/categories");
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ category: 1 }).exec();
  const wordsInCategory = await Item.find({ category: req.params.id });
  const category = await Category.findById(req.params.id).exec();

  res.render("category_delete", {
    word_list: wordsInCategory,
    category: category,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  await category.deleteOne(category);
  res.redirect("/catalog/categories");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented");
});
