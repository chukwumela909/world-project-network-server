const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfileImage, followUser, unfollowUser, getUserFollowers, getUserFollowing, getCurrentUserFollowers, getCurrentUserFollowing } = require("../controllers/userController");
const { protectUser } = require("../middlewares/authMiddleware");

// Get all users
router.get("/", protectUser, getAllUsers);

// Get user by ID
router.get("/:userId", protectUser, getUserById);

// Update profile image
router.post("/profile-image", protectUser, updateProfileImage);

// Follow a user
router.post("/follow/:userId", protectUser, followUser);

// Unfollow a user
router.post("/unfollow/:userId", protectUser, unfollowUser);

// Get current user's followers
router.get("/me/followers", protectUser, getCurrentUserFollowers);

// Get current user's following
router.get("/me/following", protectUser, getCurrentUserFollowing);

// Get user followers
router.get("/:userId/followers", protectUser, getUserFollowers);

// Get user following
router.get("/:userId/following", protectUser, getUserFollowing);

module.exports = router; 