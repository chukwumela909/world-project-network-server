const express = require("express");
const router = express.Router();

// Import the route files
const categoryRoutes = require("./categories");
const campaignRoutes = require("./campaigns");
const authRoutes = require("./auth");
const donationRoutes = require("./donations");

// Use the routes as middleware
router.use("/categories", categoryRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/donations", donationRoutes);
router.use("/auth", authRoutes);

module.exports = router;
