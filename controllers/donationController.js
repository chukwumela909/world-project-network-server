const Donation = require("../models/donation");
const Campaign = require("../models/campaign");
const User = require("../models/user");

// Create a donation
const createDonation = async (req, res) => {
  const { campaignId, amount } = req.body;
  const user = req.user; // Extract the authenticated user from the middleware

  try {
    // Ensure the campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ status: "error", message: "Campaign not found" });
    }

    // Create and save the donation
    const donation = new Donation({
      user: user._id,
      campaign: campaignId,
      amount,
    });
    await donation.save();

    // Update the campaign's total donations
    campaign.totalDonations += amount;
    await campaign.save();

    // Update user's wallet balance (optional feature)
    user.wallet -= amount;
    await user.save();

    res
      .status(201)
      .json({ status: "success", message: "Donation successful", donation });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error processing donation",
        error: error.message,
      });
  }
};

// Get donations by campaign ID
const getDonationsByCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const donations = await Donation.find({ campaign: campaignId }).populate(
      "user",
      "fullName emailAddress"
    );
    res.status(200).json({ status: "success", donations });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error fetching donations",
        error: error.message,
      });
  }
};

// Get donations by user ID
const getUserDonations = async (req, res) => {
  const { userId } = req.params;

  try {
    const donations = await Donation.find({ user: userId }).populate(
      "campaign",
      "title description"
    );
    res.status(200).json({ status: "success", donations });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error fetching donations for user",
        error: error.message,
      });
  }
};

module.exports = { createDonation, getDonationsByCampaign, getUserDonations };
