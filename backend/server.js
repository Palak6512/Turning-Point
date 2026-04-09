const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Decision = require("./models/decisions");
const { analyzeContext, generateFactorScores, generateExplanation } = require("./utils/decisionEngine");

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

    // Analyze context from problem text
    const keywords = analyzeContext(problem);
    console.log("Detected keywords:", keywords);

    // Generate factor scores
    const factors = generateFactorScores(decision_type, risk, stress, keywords);
    console.log("Generated factors:", factors);

    // Convert factors object to array for frontend
    const factorsArray = Object.keys(factors).map(name => ({
      name,
      value: Math.round(factors[name])
    }));

    // Generate AI-like explanation
    const explanation = generateExplanation(decision_type, risk, stress, keywords, factors);
    console.log("Generated explanation:", explanation);

    // Determine recommendation based on highest factor
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

    const adjusted_risk = Math.round((risk * 0.8) * 10) / 10;
    const adjusted_stress = Math.round((stress * 0.9) * 10) / 10;

    // mongodb save
    const newDecision = new Decision({
      problem,
      decision_type,
      risk,
      stress,
      recommendation,
      explanation,
      factors: factorsArray
    });

    await newDecision.save();
    console.log("Decision saved to database with factors");

    res.json({
      recommendation,
      explanation,
      adjusted_risk,
      adjusted_stress,
      factors: factorsArray
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