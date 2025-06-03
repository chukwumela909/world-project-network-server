const express = require("express");
const router = express.Router();
const {
  createLiveCampaign,
  getAllLiveCampaigns,
  getLiveCampaignById,
  joinLiveCampaign,
  leaveLiveCampaign,
  addComment,
  sendGift,
  endLiveCampaign
} = require("../controllers/liveCampaignController");
const { protectUser } = require("../middlewares/authMiddleware");

// Create a new live campaign
router.post("/", protectUser, createLiveCampaign);

// Get all active live campaigns
router.get("/", protectUser, getAllLiveCampaigns);

// Get a specific live campaign
router.get("/:campaignId", protectUser, getLiveCampaignById);

// Join a live campaign
router.post("/:campaignId/join", protectUser, joinLiveCampaign);

// Leave a live campaign
router.post("/:campaignId/leave", protectUser, leaveLiveCampaign);

// Add a comment to a live campaign
router.post("/:campaignId/comments", protectUser, addComment);

// Send a gift to a live campaign
router.post("/:campaignId/gifts", protectUser, sendGift);

// End a live campaign (host only)
router.post("/:campaignId/end", protectUser, endLiveCampaign);

module.exports = router; 