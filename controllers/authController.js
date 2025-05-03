const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User registration
const userRegister = async (req, res) => {
  const {
    fullName,
    emailAddress,
    password,
  } = req.body;
  try {
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is already in use" });
    }


    const user = new User({
      fullName,
      emailAddress,
      password: hashedPassword,
      wallet: 0,
    });
    await user.save();

    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error registering user",
        error: error.message,
      });
  }
};

// User login
const userLogin = async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    const user = await User.findOne({ emailAddress });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });

    // Use bcrypt.compare to safely check the password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "30d" });

    return res.status(200).json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get user details
const getUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json({
        status: "success",
        message: "User fetched successfully",
        user: req.user,
      });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getUser,
};
