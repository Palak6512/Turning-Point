const mongoose = require("mongoose");

const DecisionSchema = new mongoose.Schema({
  problem: String,
  decision_type: String,
  risk: Number,
  stress: Number,
  recommendation: String,
  explanation: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Decision", DecisionSchema);

