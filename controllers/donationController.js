const Donation = require("../models/donation");
const Campaign = require("../models/campaign");
const User = require("../models/user");


// Utility to check required fields
const checkParams = (params) => {
  for (let key in params) {
    if (!params[key]) return key;
  }
  return null;
};

// Create a donation
const createDonation = async (req, res) => {
  const { campaignId, amount, message } = req.body

  const missingField = checkParams({
    campaignId,
    amount, 
    message,
  });

  if (missingField) {
    return res
      .status(400)
      .json({ status: "error", message: `${missingField} is required` });
  }

  const user = req.user; // Extract the authenticated user from the middleware

  try {
    // Ensure the campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ status: "error", message: "Campaign not found" });
    }

    // Calculate remaining amount needed to reach the goal
    const remainingAmount = campaign.goalAmount - campaign.currentAmount;
    
    // Check if donation amount exceeds the remaining amount needed
    if (Number(amount) > remainingAmount) {
      return res.status(400).json({
        status: "error",
        message: `Donation amount exceeds the campaign's remaining goal. Maximum allowed donation is ${remainingAmount}.`
      });
    }

    // Create and save the donation
    const donation = new Donation({
      user: user._id,
      campaign: campaignId,
      amount,
      message,
    });
    await donation.save();

    // Update the campaign's currentAmount
    campaign.currentAmount = Number(campaign.currentAmount) + Number(amount);
    
    // Add the donor to the donors array if not already there
    if (!campaign.donors.includes(user._id)) {
      campaign.donors.push(user._id);
    }
    
    await campaign.save();

    // Find the campaign owner and update their wallet
    const campaignOwner = await User.findById(campaign.user);
    if (campaignOwner) {
      campaignOwner.wallet = Number(campaignOwner.wallet || 0) + Number(amount);
      await campaignOwner.save();
    }

    // Update user's wallet balance (optional feature)
    // user.wallet -= amount;
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
  const user = req.user; // Extract the authenticated user from the middleware

  try {
    const donations = await Donation.find({ user: user._id }).populate({
      path: "campaign",
      select: "title description user", // Include the campaign owner (user field)
      populate: {
        path: "user",
        select: "fullName emailAddress" // Populate campaign owner details
      }
    });

    // Get unique campaign owners (partners) that the user has donated to
    const uniquePartners = new Set();
    donations.forEach(donation => {
      if (donation.campaign && donation.campaign.user) {
        uniquePartners.add(donation.campaign.user._id.toString());
      }
    });

    const numberOfPartners = uniquePartners.size;

    res.status(200).json({ 
      status: "success", 
      data: {
      donations,
      // numberOfPartners,
      totalDonations: donations.length
      }
    });
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
