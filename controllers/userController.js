const User = require("../models/user");
const Campaign = require("../models/campaign");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // Get all users, excluding password field
    const users = await User.find({}, { password: 0 });
    
    // Get user campaigns and add them to the response
    const usersWithCampaigns = await Promise.all(
      users.map(async (user) => {
        // Find campaigns created by this user
        const campaigns = await Campaign.find({ user: user._id });
        
        // Convert Mongoose document to plain object
        const userObj = user.toObject();
        
        // Add campaigns to user object
        return {
          ...userObj,
          campaigns
        };
      })
    );
    
    res.status(200).json({
      status: "success",
      count: users.length,
      users: usersWithCampaigns
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching users",
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId, { password: 0 }); // Exclude password field
    
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Find campaigns created by this user
    const campaigns = await Campaign.find({ user: userId });
    
    // Convert Mongoose document to plain object and add campaigns
    const userWithCampaigns = {
      ...user.toObject(),
      campaigns
    };

    res.status(200).json({
      status: "success",
      user: userWithCampaigns
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching user",
      error: error.message
    });
  }
};

// Update user profile image
const updateProfileImage = async (req, res) => {
  const { profileImage } = req.body;
  const user = req.user;

  if (!profileImage) {
    return res.status(400).json({
      status: "error",
      message: "Profile image URL is required"
    });
  }

  try {
    // Update the user's profile image
    await User.findByIdAndUpdate(user._id, { profileImage });

    res.status(200).json({
      status: "success",
      message: "Profile image updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating profile image",
      error: error.message
    });
  }
};

// Follow a user
const followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user;

  // Check if user is trying to follow themselves
  if (userId === currentUser._id.toString()) {
    return res.status(400).json({
      status: "error",
      message: "You cannot follow yourself"
    });
  }

  try {
    // Find the user to follow
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following && 
                              currentUser.following.some(id => id.toString() === userId);
    
    if (isAlreadyFollowing) {
      return res.status(400).json({
        status: "error",
        message: "You are already following this user"
      });
    }

    // Update current user's following list
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: userId }
    });

    // Update target user's followers list
    await User.findByIdAndUpdate(userId, {
      $push: { followers: currentUser._id }
    });

    res.status(200).json({
      status: "success",
      message: `You are now following ${userToFollow.fullName}`
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error following user",
      error: error.message
    });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user;

  // Check if user is trying to unfollow themselves
  if (userId === currentUser._id.toString()) {
    return res.status(400).json({
      status: "error",
      message: "You cannot unfollow yourself"
    });
  }

  try {
    // Find the user to unfollow
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Check if actually following
    const isFollowing = currentUser.following && 
                        currentUser.following.some(id => id.toString() === userId);
    
    if (!isFollowing) {
      return res.status(400).json({
        status: "error",
        message: "You are not following this user"
      });
    }

    // Update current user's following list
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: userId }
    });

    // Update target user's followers list
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUser._id }
    });

    res.status(200).json({
      status: "success",
      message: `You have unfollowed ${userToUnfollow.fullName}`
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error unfollowing user",
      error: error.message
    });
  }
};

// Get followers of a user
const getUserFollowers = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId)
      .populate('followers', 'fullName emailAddress profileImage');
    
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    
    res.status(200).json({
      status: "success",
      followers: user.followers || [],
      count: user.followers ? user.followers.length : 0
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error getting followers",
      error: error.message
    });
  }
};

// Get users followed by a user
const getUserFollowing = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId)
      .populate('following', 'fullName emailAddress profileImage');
    
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    
    res.status(200).json({
      status: "success",
      following: user.following || [],
      count: user.following ? user.following.length : 0
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error getting following users",
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfileImage,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing
}; 