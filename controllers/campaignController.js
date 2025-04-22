const Campaign = require("../models/campaign");

// Create a new campaign
const createCampaign = async (req, res) => {
  const {
    title,
    description,
    goalAmount,
    category,
    imageUrls,
    startDate,
    endDate,
  } = req.body;
  const user = req.user;

  try {
    const campaign = new Campaign({
      title,
      description,
      goalAmount,
      category,
      user: user._id,
      imageUrls,
      startDate,
      endDate,
    });
    await campaign.save();
    res
      .status(201)
      .json({ status: "success", message: "Campaign created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error creating campaign",
        error: error.message,
      });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("category")
      .populate("user");
    res.status(200).json({ status: "success", campaigns });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error fetching campaigns",
        error: error.message,
      });
  }
};

// Get a specific campaign by ID
const getCampaignById = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findById(id)
      .populate("category")
      .populate("user");
    if (!campaign) {
      return res
        .status(404)
        .json({ status: "error", message: "Campaign not found" });
    }
    res.status(200).json({ status: "success", campaign });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error fetching campaign",
        error: error.message,
      });
  }
};

// Update a campaign by ID
const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    goalAmount,
    category,
    imageUrls,
    startDate,
    endDate,
  } = req.body;

  try {
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      {
        title,
        description,
        goalAmount,
        category,
        imageUrls,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!campaign) {
      return res
        .status(404)
        .json({ status: "error", message: "Campaign not found" });
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "Campaign updated successfully",
        campaign,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error updating campaign",
        error: error.message,
      });
  }
};

// Delete a campaign by ID
const deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return res
        .status(404)
        .json({ status: "error", message: "Campaign not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Campaign deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error deleting campaign",
        error: error.message,
      });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
