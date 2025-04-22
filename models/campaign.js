const { Schema, model } = require('mongoose');

const campaignSchema = new Schema({ 
    title: { type: String, required: true, },
    description: {type: String, required: true,},

});

const Campaign = model('Campaign', campaignSchema);

module.exports = Campaign;