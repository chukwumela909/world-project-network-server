const LiveCampaign = require("../models/liveCampaign");
const User = require("../models/user");

// Create a new live campaign
const createLiveCampaign = async (req, res) => {
  const { name, brief, imageUrl } = req.body;
  const host = req.user;

  try {
    // Validate required fields
    if (!name || !brief || !imageUrl) {
      return res.status(400).json({
        status: "error",
        message: "Name, brief description, and image URL are required"
      });
    }

    // Create the live campaign
    const liveCampaign = new LiveCampaign({
      name,
      brief,
      imageUrl,
      host: host._id,
      participants: [host._id], // Host is automatically a participant
    });

    await liveCampaign.save();

    res.status(201).json({
      status: "success",
      message: "Live campaign created successfully",
      liveCampaign
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating live campaign",
      error: error.message
    });
  }
};

// Get all active live campaigns
const getAllLiveCampaigns = async (req, res) => {
  try {
    const liveCampaigns = await LiveCampaign.find({ isActive: true })
      .populate("host", "fullName profileImage")
      .populate("participants", "fullName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: liveCampaigns.length,
      liveCampaigns
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching live campaigns",
      error: error.message
    });
  }
};

// Get a specific live campaign by ID
const getLiveCampaignById = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const liveCampaign = await LiveCampaign.findById(campaignId)
      .populate("host", "fullName profileImage emailAddress")
      .populate("participants", "fullName profileImage")
      .populate("comments.user", "fullName profileImage")
      .populate("gifts.user", "fullName profileImage");

    if (!liveCampaign) {
      return res.status(404).json({
        status: "error",
        message: "Live campaign not found"
      });
    }

    res.status(200).json({
      status: "success",
      liveCampaign
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching live campaign",
      error: error.message
    });
  }
};

// Join a live campaign
const joinLiveCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const user = req.user;

  try {
    const liveCampaign = await LiveCampaign.findById(campaignId);

    if (!liveCampaign) {
      return res.status(404).json({
        status: "error",
        message: "Live campaign not found"
      });
    }

    if (!liveCampaign.isActive) {
      return res.status(400).json({
        status: "error",
        message: "This live campaign is no longer active"
      });
    }

    // Check if user is already a participant
    if (liveCampaign.participants.includes(user._id)) {
      return res.status(400).json({
        status: "error",
        message: "You are already a participant in this live campaign"
      });
    }

    // Add user to participants
    liveCampaign.participants.push(user._id);
    await liveCampaign.save();

    res.status(200).json({
      status: "success",
      message: "You have joined the live campaign"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error joining live campaign",
      error: error.message
    });
  }
};

// Leave a live campaign
const leaveLiveCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const user = req.user;

  try {
    const liveCampaign = await LiveCampaign.findById(campaignId);

    if (!liveCampaign) {
      return res.status(404).json({
        status: "error",
        message: "Live campaign not found"
      });
    }

    // Host cannot leave their own campaign
    if (liveCampaign.host.toString() === user._id.toString()) {
      return res.status(400).json({
        status: "error",
        message: "As the host, you cannot leave your own live campaign"
      });
    }

    // Check if user is a participant
    if (!liveCampaign.participants.includes(user._id)) {
      return res.status(400).json({
        status: "error",
        message: "You are not a participant in this live campaign"
      });
    }

    // Remove user from participants
    liveCampaign.participants = liveCampaign.participants.filter(
      participantId => participantId.toString() !== user._id.toString()
    );
    await liveCampaign.save();

    res.status(200).json({
      status: "success",
      message: "You have left the live campaign"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error leaving live campaign",
      error: error.message
    });
  }
};

// Add a comment to a live campaign
const addComment = async (req, res) => {
  const { campaignId } = req.params;
  const { content } = req.body;
  const user = req.user;

  try {
    if (!content) {
      return res.status(400).json({
        status: "error",
        message: "Comment content is required"
      });
    }

    const liveCampaign = await LiveCampaign.findById(campaignId);

    if (!liveCampaign) {
      return res.status(404).json({
        status: "error",
        message: "Live campaign not found"
      });
    }

    if (!liveCampaign.isActive) {
      return res.status(400).json({
        status: "error",
        message: "This live campaign is no longer active"
      });
    }

    // Add the comment
    liveCampaign.comments.push({
      user: user._id,
      content
    });

    await liveCampaign.save();

    // Return the new comment with user details
    const updatedCampaign = await LiveCampaign.findById(campaignId)
      .populate("comments.user", "fullName profileImage");

    const newComment = updatedCampaign.comments[updatedCampaign.comments.length - 1];

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error adding comment",
      error: error.message
    });
  }
};

// Send a gift to a live campaign
const sendGift = async (req, res) => {
  const { campaignId } = req.params;
  const { amount, message } = req.body;
  const user = req.user;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Gift amount must be greater than 0"
      });
    }

    const liveCampaign = await LiveCampaign.findById(campaignId);

    if (!liveCampaign) {
      return res.status(404).json({
        status: "error",
        message: "Live campaign not found"
      });
    }

    if (!liveCampaign.isActive) {
      return res.status(400).json({
        status: "error",
        message: "This live campaign is no longer active"
      });
    }

    // Check if user has enough in wallet
    if (user.wallet < amount) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient funds in your wallet"
      });
    }

    // Add the gift
    liveCampaign.gifts.push({
      user: user._id,
      amount,
      message: message || ""
    });

    // Update total gifts
    liveCampaign.totalGifts += amount;
    await liveCampaign.save();

    // Update host's wallet
    const host = await User.findById(liveCampaign.host);
    host.wallet = Number(host.wallet || 0) + Number(amount);
    await host.save();

    // Deduct from user's wallet
    user.wallet -= amount;
    await user.save();

    // Return the new gift with user details
    const updatedCampaign = await LiveCampaign.findById(campaignId)
      .populate("gifts.user", "fullName profileImage");

    const newGift = updatedCampaign.gifts[updatedCampaign.gifts.length - 1];

    res.status(201).json({
      status: "success",
      message: "Gift sent successfully",
      gift: newGift
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error sending gift",
      error: error.message
    });
  }
};

// End a live campaign (host only)
const endLiveCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const user = req.user;

  try {
    const liveCampaign = await LiveCampaign.findById(campaignId);

    if (!liveCampaign) {
      return res.status(404).json({
        status: "error",
        message: "Live campaign not found"
      });
    }

    // Only the host can end the campaign
    if (liveCampaign.host.toString() !== user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Only the host can end this live campaign"
      });
    }

    if (!liveCampaign.isActive) {
      return res.status(400).json({
        status: "error",
        message: "This live campaign is already ended"
      });
    }

    // End the campaign
    liveCampaign.isActive = false;
    liveCampaign.endTime = new Date();
    await liveCampaign.save();

    res.status(200).json({
      status: "success",
      message: "Live campaign ended successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error ending live campaign",
      error: error.message
    });
  }
};

module.exports = {
  createLiveCampaign,
  getAllLiveCampaigns,
  getLiveCampaignById,
  joinLiveCampaign,
  leaveLiveCampaign,
  addComment,
  sendGift,
  endLiveCampaign
}; 