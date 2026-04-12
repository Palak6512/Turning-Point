import { useState } from "react";
import axios from "axios";
import LoadingOverlay from "./LoadingOverlay";
import FactorsChart from "./FactorsChart";

function Home() {
  const [form, setForm] = useState({
    decision_type: "Career",
    risk: 3,
    stress: 3,
    importance: 3,
    timePressure: 3,
    problem: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.problem.trim()) {
      alert("Please describe your problem");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/decision", form);
      setResult(res.data);
    } catch (error) {
      console.error("Error getting decision:", error);
      alert("Error getting decision. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <main style={{ padding: "24px 0 40px" }}>
        <section style={{ maxWidth: "760px", margin: "0 auto 30px", textAlign: "center" }}>
          <div className="section-title" style={{ justifyContent: "center" }}>
            <span />
            <div>
              <h1 style={{ marginBottom: "0.6rem" }}>TurningPoint</h1>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.75 }}>
                Describe your challenge, set your priorities, and get a recommendation that balances risk, stress, and outcomes.
              </p>
            </div>
          </div>
        </section>

        <section className="card" style={{ padding: "28px", marginBottom: "30px" }}>
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: 700, color: "var(--text)" }}>
                Describe your problem
              </label>
              <textarea
                placeholder="e.g., Should I accept a promotion if it means more stress but higher growth?"
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                style={{ minHeight: "140px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: 700, color: "var(--text)" }}>
                Decision Type
              </label>
              <select
                value={form.decision_type}
                onChange={(e) => setForm({ ...form, decision_type: e.target.value })}
              >
                <option>Career</option>
                <option>Finance</option>
                <option>Education</option>
                <option>Personal Life</option>
                <option>Daily Choices</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "18px" }}>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>
                  <span>Risk Level</span>
                  <span>{form.risk}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.risk}
                  onChange={(e) => setForm({ ...form, risk: Number(e.target.value) })}
                />
                <small>1 = Conservative, 5 = Aggressive</small>
              </div>

              <div>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>
                  <span>Stress Level</span>
                  <span>{form.stress}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.stress}
                  onChange={(e) => setForm({ ...form, stress: Number(e.target.value) })}
                />
                <small>1 = Low, 5 = High</small>
              </div>

              <div>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>
                  <span>Importance</span>
                  <span>{form.importance}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.importance}
                  onChange={(e) => setForm({ ...form, importance: Number(e.target.value) })}
                />
                <small>1 = Not Important, 5 = Critical</small>
              </div>

              <div>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>
                  <span>Time Pressure</span>
                  <span>{form.timePressure}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={form.timePressure}
                  onChange={(e) => setForm({ ...form, timePressure: Number(e.target.value) })}
                />
                <small>1 = No Rush, 5 = Urgent</small>
              </div>
            </div>

            <button
              type="button"
              className="primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.75 : 1 }}
            >
              {loading ? "Analyzing..." : "Get Decision"}
            </button>
          </div>
        </section>

        {result && (
          <section className="card" style={{ padding: "24px" }}>
            <div style={{ padding: "20px", borderRadius: "18px", backgroundColor: "var(--emerald-soft)", borderLeft: "4px solid var(--emerald)", marginBottom: "24px" }}>
              <h2 style={{ color: "var(--emerald-strong)", margin: "0 0 10px 0" }}>✨ Recommendation</h2>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#134e4a", margin: 0 }}>{result.recommendation}</p>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <h3 style={{ color: "#0f172a", margin: "0 0 12px 0" }}>💡 Explanation</h3>
              <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>{result.explanation}</p>
            </div>

            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "22px" }}>
              <div style={{ padding: "18px", borderRadius: "18px", backgroundColor: "#f8faf9" }}>
                <p style={{ margin: "0 0 8px 0", fontWeight: 700, color: "#475569" }}>Adjusted Risk</p>
                <p style={{ fontSize: "1.75rem", color: "var(--emerald)", fontWeight: 700, margin: 0 }}>{result.adjusted_risk}</p>
              </div>
              <div style={{ padding: "18px", borderRadius: "18px", backgroundColor: "#f8faf9" }}>
                <p style={{ margin: "0 0 8px 0", fontWeight: 700, color: "#475569" }}>Adjusted Stress</p>
                <p style={{ fontSize: "1.75rem", color: "#f59e0b", fontWeight: 700, margin: 0 }}>{result.adjusted_stress}</p>
              </div>
            </div>

            {result.factors && <FactorsChart factors={result.factors} />}
          </section>
        )}
      </main>
    </>
  );
}

export default Home;
