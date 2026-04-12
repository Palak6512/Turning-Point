import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "18px 0", backgroundColor: "var(--emerald-strong)", color: "white", marginBottom: "28px", borderRadius: "0 0 24px 24px", boxShadow: "0 20px 40px rgba(4, 120, 87, 0.12)" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 10px 24px rgba(16, 185, 129, 0.28)" }} />
          <div>
            <div style={{ fontSize: "1rem", fontWeight: "700", letterSpacing: "0.02em" }}>TurningPoint</div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>Your smart choice assistant</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "600", padding: "10px 12px", borderRadius: "12px", transition: "background-color 0.25s" }} onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.16)"} onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}>Home</Link>
          <Link to="/history" style={{ color: "white", textDecoration: "none", fontWeight: "600", padding: "10px 12px", borderRadius: "12px", transition: "background-color 0.25s" }} onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.16)"} onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}>History</Link>
          <Link to="/profile" style={{ color: "white", textDecoration: "none", fontWeight: "600", padding: "10px 12px", borderRadius: "12px", transition: "background-color 0.25s" }} onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.16)"} onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}>Profile</Link>
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "0.95rem", opacity: 0.95 }}>👤 {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 16px",
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "0.92rem",
                fontWeight: "700",
                transition: "background-color 0.25s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.28)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.18)"}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;