const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
} = require("../controllers/categoryController");
const { protectUser } = require("../middlewares/authMiddleware");

// POST /api/categories
router.post("/", protectUser, createCategory);

// GET /api/categories
router.get("/", getCategories);

// GET /api/categories/:id
router.get("/:id", getCategoryById);

module.exports = router;
