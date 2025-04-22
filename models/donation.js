const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      minlength: 5,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", DonationSchema);
