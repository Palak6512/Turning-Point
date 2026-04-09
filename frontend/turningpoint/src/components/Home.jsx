import { useState } from "react";
import axios from "axios";

function Home() {
  const [form, setForm] = useState({
    decision_type: "Career",
    risk: 3,
    stress: 3,
    problem: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/decision", form);
      setResult(res.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error getting decision");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>TurningPoint - Decision Assistant</h1>
      <p style={{ textAlign: "center", color: "#666" }}>Describe your problem and get AI-powered recommendations.</p>

      <div style={{ marginBottom: "20px", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Describe your problem:</label>
          <textarea
            placeholder="e.g., Should I switch jobs?"
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            style={{ width: "100%", height: "100px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Decision Type:</label>
          <select
            value={form.decision_type}
            onChange={(e) => setForm({ ...form, decision_type: e.target.value })}
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px" }}
          >
            <option>Career</option>
            <option>Finance</option>
            <option>Education</option>
            <option>Personal Life</option>
            <option>Daily Choices</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Risk Level: {form.risk}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={form.risk}
            onChange={(e) => setForm({ ...form, risk: Number(e.target.value) })}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Stress Level: {form.stress}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={form.stress}
            onChange={(e) => setForm({ ...form, stress: Number(e.target.value) })}
            style={{ width: "100%" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Getting Decision..." : "Get Decision"}
        </button>
      </div>

      {result && (
        <div style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
          <h2 style={{ color: "#333" }}>Recommendation</h2>
          <p style={{ fontSize: "18px", color: "#007bff", fontWeight: "bold" }}>{result.recommendation}</p>

          <h3 style={{ color: "#333" }}>Explanation</h3>
          <p>{result.explanation}</p>

          <h3 style={{ color: "#333" }}>Adjusted Scores</h3>
          <p>Risk: {result.adjusted_risk.toFixed(1)}</p>
          <p>Stress: {result.adjusted_stress.toFixed(1)}</p>
        </div>
      )}
    </div>
  );
}

export default Home;