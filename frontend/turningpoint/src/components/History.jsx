import { useState, useEffect } from "react";
import axios from "axios";

function History() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log("Fetching decision history...");
        const res = await axios.get("http://localhost:5000/history");
        console.log("History fetched successfully:", res.data.length, "decisions");
        setDecisions(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        alert("Error loading history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Decision History</h1>
      {decisions.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No decisions yet.</p>
      ) : (
        <div>
          {decisions.map((decision, index) => (
            <div key={index} style={{ marginBottom: "20px", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
              <p><strong>Problem:</strong> {decision.problem}</p>
              <p><strong>Type:</strong> {decision.decision_type}</p>
              <p><strong>Recommendation:</strong> <span style={{ color: "#007bff", fontWeight: "bold" }}>{decision.recommendation}</span></p>
              <p><strong>Explanation:</strong> {decision.explanation}</p>
              <p><strong>Risk:</strong> {decision.risk} | <strong>Stress:</strong> {decision.stress}</p>
              <p style={{ fontSize: "14px", color: "#666" }}>Timestamp: {new Date(decision.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;