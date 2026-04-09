import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", backgroundColor: "#007bff", color: "white", marginBottom: "20px", borderRadius: "0 0 10px 10px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", padding: "5px 10px", borderRadius: "5px", transition: "background-color 0.3s" }} onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"} onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}>Home</Link>
        <Link to="/history" style={{ color: "white", textDecoration: "none", fontWeight: "bold", padding: "5px 10px", borderRadius: "5px", transition: "background-color 0.3s" }} onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"} onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}>History</Link>
        <Link to="/profile" style={{ color: "white", textDecoration: "none", fontWeight: "bold", padding: "5px 10px", borderRadius: "5px", transition: "background-color 0.3s" }} onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"} onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}>Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;