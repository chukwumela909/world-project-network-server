const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['food', 'education', 'health', 'humanity', 'environment', 'social', 'orphanage', 'startup capital', 'animals', 'disabled']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    startDate: {
      type: Date, 
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    donors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
