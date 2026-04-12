import { useState, useEffect } from "react";
import axios from "axios";
import FactorsChart from "./FactorsChart";

function History() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history");
        setDecisions(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        alert("Error loading history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>Loading decision history...</div>;

  return (
    <div style={{ padding: "20px 0 40px", maxWidth: "920px", margin: "0 auto" }}>
      <div className="section-title" style={{ justifyContent: "center", marginBottom: "24px" }}>
        <span />
        <div>
          <h1>Decision History</h1>
          <p style={{ marginTop: "10px", color: "var(--text-muted)", fontSize: "1rem" }}>
            Review your past decisions and inspect the recommendation details for every saved entry.
          </p>
        </div>
      </div>

      {decisions.length === 0 ? (
        <div className="card" style={{ padding: "30px", textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "1rem" }}>You haven’t created any decisions yet.</p>
        </div>
      ) : (
        decisions.map((decision, index) => (
          <div
            key={decision._id || index}
            onClick={() => setExpandedId(expandedId === index ? null : index)}
            style={{
              marginBottom: "20px",
              padding: "24px",
              borderRadius: "22px",
              boxShadow: "0 24px 50px rgba(15, 23, 42, 0.07)",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              transform: expandedId === index ? "translateY(-1px)" : "none"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "18px", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: 700, color: "var(--text)" }}>{decision.problem.substring(0, 70)}...</p>
                <p style={{ margin: "0 0 10px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  <strong style={{ color: "var(--emerald-strong)" }}>Type:</strong> {decision.decision_type}
                </p>
                <p style={{ margin: 0, color: "var(--emerald)", fontWeight: 700 }}>{decision.recommendation}</p>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>{new Date(decision.createdAt).toLocaleDateString()}</p>
            </div>

            {expandedId === index && (
              <div style={{ marginTop: "22px", paddingTop: "22px", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: 700, color: "var(--text)" }}>Full Problem</p>
                  <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.75 }}>{decision.problem}</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: 700, color: "var(--text)" }}>Explanation</p>
                  <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.75 }}>{decision.explanation}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ padding: "18px", borderRadius: "16px", backgroundColor: "#f8faf9" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>Risk</p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "var(--emerald)", fontWeight: 700 }}>{decision.risk}</p>
                  </div>
                  <div style={{ padding: "18px", borderRadius: "16px", backgroundColor: "#f8faf9" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>Stress</p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#f59e0b", fontWeight: 700 }}>{decision.stress}</p>
                  </div>
                  <div style={{ padding: "18px", borderRadius: "16px", backgroundColor: "#f8faf9" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>Adj. Risk</p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "var(--emerald-strong)", fontWeight: 700 }}>{(decision.risk * 0.8).toFixed(1)}</p>
                  </div>
                  <div style={{ padding: "18px", borderRadius: "16px", backgroundColor: "#f8faf9" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>Adj. Stress</p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#f59e0b", fontWeight: 700 }}>{(decision.stress * 0.9).toFixed(1)}</p>
                  </div>
                </div>

                {decision.factors && decision.factors.length > 0 && <FactorsChart factors={decision.factors} />}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default History;
