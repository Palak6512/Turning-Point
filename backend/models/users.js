const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Profile preferences (captured during signup)
  profile: {
    overthinking: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    riskTolerance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    frustration: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    aiTrust: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);
