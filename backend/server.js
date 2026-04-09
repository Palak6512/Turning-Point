const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Decision = require("./models/decisions");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// api 
app.post("/decision", async (req, res) => {
  try {
    const { decision_type, risk, stress, problem } = req.body;
    console.log("Received decision request:", { decision_type, risk, stress, problem: problem.substring(0, 50) + "..." });

    let recommendation = "";
    let explanation = "";

    if (decision_type === "Career") {
      recommendation = "Choose long-term growth option";
      explanation =
        "This is a high-impact decision, so long-term benefits are prioritized.";
    } else if (risk > 3) {
      recommendation = "Choose safer option";
      explanation =
        "Higher uncertainty detected, safer decision is recommended.";
    } else {
      recommendation = "Choose balanced option";
      explanation =
        "Balanced choice gives stable outcomes based on your inputs.";
    }

    const adjusted_risk = risk * 0.8;
    const adjusted_stress = stress * 0.9;

    // mongodb save
    const newDecision = new Decision({
      problem,
      decision_type,
      risk,
      stress,
      recommendation,
      explanation
    });

    await newDecision.save();
    console.log("Decision saved to database");

    res.json({
      recommendation,
      explanation,
      adjusted_risk,
      adjusted_stress
    });

  } catch (err) {
    console.error("Error in /decision:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// history
app.get("/history", async (req, res) => {
  try {
    console.log("Fetching decision history...");
    const decisions = await Decision.find().sort({ createdAt: -1 });
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