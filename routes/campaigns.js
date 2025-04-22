const express = require("express");
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignsByCategory,
} = require("../controllers/campaignController");
const { protectUser } = require("../middlewares/authMiddleware");

// POST /api/campaigns
router.post("/", protectUser, createCampaign);

// GET /api/campaigns
router.get("/", getCampaigns);

// GET /api/campaigns/category
router.get("/category/:categoryId", getCampaignsByCategory);

// GET /api/campaigns/:id
router.get("/:id", getCampaignById);

// PUT /api/campaigns/:id
router.put("/:id", protectUser, updateCampaign);

// DELETE /api/campaigns/:id
router.delete("/:id", protectUser, deleteCampaign);

module.exports = router;
