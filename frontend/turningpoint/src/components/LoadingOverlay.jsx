function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "36px 36px 28px",
        borderRadius: "22px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)"
      }}>
        <div style={{
          width: "52px",
          height: "52px",
          border: "5px solid #10b981",
          borderRadius: "50%",
          borderTop: "5px solid transparent",
          animation: "spin 1s linear infinite",
          margin: "0 auto 22px"
        }} />
        <p style={{
          fontSize: "18px",
          color: "#111827",
          margin: 0,
          fontWeight: "700"
        }}>
          Analyzing your decision...
        </p>
        <p style={{
          fontSize: "14px",
          color: "#475569",
          margin: "10px 0 0 0"
        }}>
          This may take a moment
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default LoadingOverlay;
