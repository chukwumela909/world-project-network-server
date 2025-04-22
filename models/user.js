const { Schema, model } = require('mongoose');

const userSchema = new Schema({ 
    fullName: { type: String, required: true, },
    emailAddress: {type: String, required: true, unique: true},
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    wallet: { type: Number, default: 0 },
});

const User = model('User', userSchema);

module.exports = User;