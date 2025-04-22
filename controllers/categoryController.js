const Category = require("../models/category");

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({ name, description });
    await category.save();
    res
      .status(201)
      .json({ status: "success", message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating category",
      error: error.message,
    });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: "success", categories });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get a specific category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }
    res.status(200).json({ status: "success", category });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching category",
      error: error.message,
    });
  }
};

module.exports = { createCategory, getCategories, getCategoryById };
