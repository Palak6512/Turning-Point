import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profile, setProfile] = useState({
    overthinking: 3,
    riskTolerance: 3,
    frustration: 3,
    aiTrust: 3
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        profile
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
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
      backgroundColor: "var(--bg)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "520px",
        backgroundColor: "var(--surface)",
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 24px 50px rgba(15, 23, 42, 0.08)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <p className="badge" style={{ margin: "0 auto 16px", display: "inline-flex" }}>Create Account</p>
          <h1 style={{ margin: 0, color: "var(--text)" }}>Join TurningPoint</h1>
          <p style={{ margin: "12px auto 0", color: "var(--text-muted)", maxWidth: "340px", lineHeight: 1.7 }}>
            {step === 1 ? "Step 1: Account Details" : "Step 2: Get to Know Your Decision Style"}
          </p>
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

        {step === 1 ? (
          <form onSubmit={handleNextStep} style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="primary">Next: Profile Quiz →</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "22px" }}>
            <div style={{ padding: "20px", borderRadius: "22px", backgroundColor: "var(--emerald-soft)", border: "1px solid rgba(4, 120, 87, 0.12)" }}>
              <p style={{ margin: "0 0 12px 0", color: "var(--text)", fontWeight: 700 }}>Help us understand your decision-making style</p>
              <div style={{ display: "grid", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Overthinking Tendency: {profile.overthinking}</label>
                  <p style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>How much do you tend to overthink decisions?</p>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={profile.overthinking}
                    onChange={(e) => handleProfileChange("overthinking", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Risk Tolerance: {profile.riskTolerance}</label>
                  <p style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>How comfortable are you with taking risks?</p>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={profile.riskTolerance}
                    onChange={(e) => handleProfileChange("riskTolerance", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>Frustration Level: {profile.frustration}</label>
                  <p style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>How easily do you get frustrated with uncertainties?</p>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={profile.frustration}
                    onChange={(e) => handleProfileChange("frustration", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "var(--text)" }}>AI Trust Level: {profile.aiTrust}</label>
                  <p style={{ margin: "0 0 8px 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>How much do you trust AI recommendations?</p>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={profile.aiTrust}
                    onChange={(e) => handleProfileChange("aiTrust", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <button type="button" className="secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="submit" className="primary" disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "22px" }}>
          Already have an account? <a href="/login" style={{ color: "var(--emerald)", fontWeight: 700 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
