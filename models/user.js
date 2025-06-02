const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullName: { type: String },
  profileImage: { type: String },  
  emailAddress: { type: String, unique: true },
  phoneNumber: { type: String },
  country: { type: String },
  residentState: { type: String },
  address: { type: String },
  password: { type: String, unique: true },
  wallet: { type: Number, default: 0 },
  followers: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
  following: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }]
}, { timestamps: true });

const User = model("User", userSchema);

module.exports = User;
