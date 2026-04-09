import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [stats, setStats] = useState({ total: 0, recent: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching user stats...");
        const res = await axios.get("http://localhost:5000/history");
        const decisions = res.data;
        console.log("Stats calculated:", decisions.length, "total decisions");
        setStats({
          total: decisions.length,
          recent: decisions.slice(0, 3)
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Profile Dashboard</h1>
      <div style={{ marginBottom: "20px", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff", textAlign: "center" }}>
        <h2 style={{ color: "#007bff" }}>Total Decisions: {stats.total}</h2>
      </div>
      <h3 style={{ color: "#333" }}>Recent Decisions</h3>
      {stats.recent.length === 0 ? (
        <p style={{ color: "#666" }}>No recent decisions.</p>
      ) : (
        <div>
          {stats.recent.map((decision, index) => (
            <div key={index} style={{ marginBottom: "10px", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
              <p><strong>{decision.problem}</strong> - <span style={{ color: "#007bff" }}>{decision.recommendation}</span></p>
              <small style={{ color: "#666" }}>{new Date(decision.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;