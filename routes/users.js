const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfileImage } = require("../controllers/userController");
const { protectUser } = require("../middlewares/authMiddleware");

// Get all users
router.get("/", protectUser, getAllUsers);

// Get user by ID
router.get("/:userId", protectUser, getUserById);

// Update profile image
router.post("/profile-image", protectUser, updateProfileImage);

module.exports = router; 