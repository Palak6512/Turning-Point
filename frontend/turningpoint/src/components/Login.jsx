import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "var(--bg)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "var(--surface)",
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p className="badge" style={{ margin: "0 auto 16px", display: "inline-flex" }}>Welcome Back</p>
          <h1 style={{ margin: 0, color: "var(--text)" }}>Sign in to TurningPoint</h1>
          <p style={{ margin: "12px auto 0", color: "var(--text-muted)", maxWidth: "320px" }}>Access your decision history and personalized recommendations.</p>
        </div>

        {error && (
          <div style={{
            padding: "14px",
            backgroundColor: "#fef3f2",
            color: "#b91c1c",
            borderRadius: "16px",
            marginBottom: "18px",
            fontSize: "0.95rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="primary" disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "22px" }}>
          Don't have an account? <a href="/signup" style={{ color: "var(--emerald)", fontWeight: 700 }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
