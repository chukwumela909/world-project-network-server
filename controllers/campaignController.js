const Campaign = require("../models/campaign");

// Utility to check required fields
const checkParams = (params) => {
  for (let key in params) {
    if (!params[key]) return key;
  }
  return null;
};

// Create a new campaign
const createCampaign = async (req, res) => {
  const { title, description, goalAmount, category, startDate, endDate } =
    req.body;
  const user = req.user;

  const missingField = checkParams({
    title,
    description,
    goalAmount,
    category,
    startDate,
    endDate,
  });

  if (missingField) {
    return res
      .status(400)
      .json({ status: "error", message: `${missingField} is required` });
  }

  try {
    const campaign = new Campaign({
      title,
      description,
      goalAmount,
      category,
      user: user._id,
      startDate,
      endDate,
    });

    // Upload Image to storage and add URL
    await campaign.save();
    res.status(201).json({
      status: "success",
      message: "Campaign created successfully",
    });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
      status: "error",
      message: "Error fetching campaigns",
      error: error.message,
    });
  }
};

// Get a specific campaign by ID
const getCampaignById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Campaign ID is required" });
  }

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
    res.status(500).json({
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

  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Campaign ID is required" });
  }

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

    res.status(200).json({
      status: "success",
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating campaign",
      error: error.message,
    });
  }
};

// Delete a campaign by ID
const deleteCampaign = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Campaign ID is required" });
  }

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
    res.status(500).json({
      status: "error",
      message: "Error deleting campaign",
      error: error.message,
    });
  }
};

const getCampaignsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const campaigns = await Campaign.find({ category: categoryId }).populate(
      "category"
    );

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignsByCategory,
};
