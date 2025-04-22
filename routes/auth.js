const express = require("express");
const {
  userRegister,
  userLogin,
  getUser,
} = require("../controllers/authController");
const { protectUser } = require("../middlewares/authMiddleware");

const router = express.Router();

//user routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/user", protectUser, getUser);

module.exports = router;
