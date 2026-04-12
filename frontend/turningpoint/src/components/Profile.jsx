import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [stats, setStats] = useState({
    total: 0,
    recent: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history");
        const decisions = res.data;
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
    <div style={{ padding: "20px 0 40px", maxWidth: "920px", margin: "0 auto" }}>
      <div className="section-title" style={{ justifyContent: "center", marginBottom: "24px" }}>
        <span />
        <div>
          <h1>Profile Dashboard</h1>
          <p style={{ marginTop: "10px", color: "var(--text-muted)", fontSize: "1rem" }}>
            Track your decisions, see recent recommendations, and build smarter habits.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: "28px", display: "grid", gap: "18px", textAlign: "center", marginBottom: "28px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <span className="badge">📊</span>
          <h2 style={{ color: "var(--emerald-strong)", margin: 0 }}>Your Statistics</h2>
        </div>
        <p style={{ fontSize: "3rem", color: "var(--emerald)", fontWeight: 700, margin: 0 }}>{stats.total}</p>
        <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 600 }}>Total Decisions Made</p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {stats.recent.length === 0 ? (
          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>No recent decisions yet — create one from the home screen.</p>
          </div>
        ) : (
          stats.recent.map((decision, index) => (
            <div key={index} className="card" style={{ padding: "22px" }}>
              <p style={{ margin: "0 0 10px 0", fontWeight: 700, color: "var(--text)" }}>{decision.problem.substring(0, 60)}...</p>
              <p style={{ margin: "0 0 10px 0", color: "var(--emerald)", fontWeight: 700 }}>{decision.recommendation}</p>
              <small style={{ color: "var(--text-muted)" }}>{new Date(decision.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      <div className="card" style={{ marginTop: "32px", padding: "24px", backgroundColor: "var(--emerald-soft)", border: "1px solid rgba(4, 120, 87, 0.12)" }}>
        <h4 style={{ color: "var(--text)", margin: "0 0 10px 0" }}>💡 Tip</h4>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.75 }}>
          Review your decision patterns to understand your priorities. Trends in factor scores reveal which options align best with your current goals.
        </p>
      </div>
    </div>
  );
}

export default Profile;
