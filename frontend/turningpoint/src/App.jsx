import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import History from "./components/History";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { token } = useAuth();

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home if authenticated, login if not */}
        <Route path="*" element={token ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;