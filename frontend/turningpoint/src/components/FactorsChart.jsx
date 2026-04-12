import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function FactorsChart({ factors }) {
  if (!factors || factors.length === 0) return null;

  const colors = {
    Growth: "#10b981",
    Salary: "#047857",
    Balance: "#34d399",
    Passion: "#0f766e"
  };

  return (
    <div style={{
      marginTop: "30px",
      padding: "22px",
      borderRadius: "20px",
      boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
      backgroundColor: "#ffffff"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <h3 style={{ color: "#0f172a", margin: 0 }}>Decision Factor Scores</h3>
        <span style={{ padding: "8px 12px", borderRadius: "999px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#047857", fontSize: "0.9rem", fontWeight: 700 }}>Insights</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={factors} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5f5eb" />
          <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 13 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#475569", fontSize: 12 }} label={{ value: "Score (0-100)", angle: -90, position: "insideLeft", fill: "#475569", dy: -10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              border: "1px solid #d1e8db",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 14px 40px rgba(15, 23, 42, 0.08)"
            }}
            formatter={(value) => [`${value}%`, "Score"]}
          />
          <Bar dataKey="value" fill="#047857" radius={[10, 10, 0, 0]} animationDuration={900} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "22px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        {factors.map((factor, index) => (
          <div key={index} style={{
            padding: "16px",
            borderRadius: "16px",
            backgroundColor: "#f8faf9",
            borderLeft: `4px solid ${colors[factor.name] || "#047857"}`
          }}>
            <p style={{ margin: "0 0 6px 0", fontWeight: "700", color: "#0f172a" }}>{factor.name}</p>
            <p style={{ margin: 0, fontSize: "18px", color: colors[factor.name] || "#047857", fontWeight: "700" }}>{factor.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FactorsChart;
