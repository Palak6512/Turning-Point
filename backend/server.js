const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const Decision = require("./models/decisions");
const User = require("./models/users");
const authMiddleware = require("./middleware/authMiddleware");
const authController = require("./controllers/authController");
const { analyzeContext, generateFactorScores, generateExplanation } = require("./utils/decisionEngine");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes (public)
app.post("/auth/signup", authController.signup);
app.post("/auth/login", authController.login);
app.get("/auth/profile", authMiddleware, authController.getProfile);

// api - Protected routes
app.post("/decision", authMiddleware, async (req, res) => {
  try {
    const { decision_type, risk, stress, problem, importance, timePressure } = req.body;
    console.log("Received decision request:", { decision_type, risk, stress, problem: problem.substring(0, 50) + "..." });

    const user = await User.findById(req.userId).select("profile");
    const profile = user?.profile || {
      overthinking: 3,
      riskTolerance: 3,
      frustration: 3,
      aiTrust: 3
    };

    const mlPayload = {
      overthinking: profile.overthinking,
      risk,
      frustration: profile.frustration,
      decision_type,
      importance: importance || 3,
      time_pressure: timePressure || 3,
      trust: profile.aiTrust
    };

    let prediction;
    try {
      const mlResponse = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mlPayload)
      });

      if (!mlResponse.ok) {
        throw new Error(`ML API status ${mlResponse.status}`);
      }

      prediction = await mlResponse.json();
      console.log("ML API prediction:", prediction);
    } catch (mlError) {
      console.error("ML API request failed, using fallback logic:", mlError.message);

      const keywords = analyzeContext(problem);
      const factors = generateFactorScores(decision_type, risk, stress, keywords);
      const explanation = generateExplanation(decision_type, risk, stress, keywords, factors);
      const highestFactor = Object.keys(factors).reduce((a, b) => 
        factors[a] > factors[b] ? a : b
      );

      let recommendation = "";
      if (highestFactor === "Growth") {
        recommendation = "Prioritize this option for long-term advancement";
      } else if (highestFactor === "Salary") {
        recommendation = "This choice maximizes financial benefits";
      } else if (highestFactor === "Balance") {
        recommendation = "This option provides optimal work-life balance";
      } else if (highestFactor === "Passion") {
        recommendation = "This aligns well with your interests and passion";
      }

      prediction = {
        recommendation,
        explanation,
        factors: Object.keys(factors).map(name => ({ name, value: Math.round(factors[name]) }))
      };
    }

    const adjusted_risk = Math.round((risk * 0.8) * 10) / 10;
    const adjusted_stress = Math.round((stress * 0.9) * 10) / 10;

    const newDecision = new Decision({
      userId: req.userId,
      problem,
      decision_type,
      risk,
      stress,
      importance: importance || 3,
      timePressure: timePressure || 3,
      recommendation: prediction.recommendation,
      explanation: prediction.explanation,
      factors: prediction.factors
    });

    await newDecision.save();
    console.log("Decision saved to database with ML prediction or fallback logic");

    res.json({
      recommendation: prediction.recommendation,
      explanation: prediction.explanation,
      adjusted_risk,
      adjusted_stress,
      factors: prediction.factors
    });

  } catch (err) {
    console.error("Error in /decision:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// history
app.get("/history", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching decision history for user:", req.userId);
    const decisions = await Decision.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log("Returning", decisions.length, "decisions");
    res.json(decisions);
  } catch (err) {
    console.error("Error in /history:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});