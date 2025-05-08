const User = require("../models/user");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json({
      status: "success",
      count: users.length,
      users
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

    res.status(200).json({
      status: "success",
      user
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

module.exports = {
  getAllUsers,
  getUserById,
  updateProfileImage
}; 