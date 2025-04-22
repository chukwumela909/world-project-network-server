const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonationsByCampaign,
  getUserDonations,
} = require("../controllers/donationController");
const { protectUser } = require("../middlewares/authMiddleware");

// POST /api/donations
router.post("/", protectUser, createDonation);

// GET /api/donations/campaign/:campaignId
router.get("/campaign/:campaignId", getDonationsByCampaign);

// GET /api/donations/user/:userId
router.get("/user/:userId", getUserDonations);

module.exports = router;
