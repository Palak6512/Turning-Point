import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const signup = async (email, password, name, profile) => {
    try {
      console.log("Signing up user:", email);
      const response = await axios.post("http://localhost:5000/auth/signup", {
        email,
        password,
        name,
        profile
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      
      console.log("Signup successful");
      return userData;
    } catch (error) {
      console.error("Signup error:", error.response?.data?.error || error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Logging in user:", email);
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      
      console.log("Login successful");
      return userData;
    } catch (error) {
      console.error("Login error:", error.response?.data?.error || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
