const mongoose = require("mongoose");

const DecisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  problem: String,
  decision_type: String,
  risk: Number,
  stress: Number,
  importance: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  timePressure: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  recommendation: String,
  explanation: String,
  factors: [
    {
      name: String,
      value: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Decision", DecisionSchema);

