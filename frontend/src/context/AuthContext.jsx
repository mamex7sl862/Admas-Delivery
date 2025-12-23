import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ← Correct named import (v4+)

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // ← Correct function name: jwtDecode (camelCase)
        setUser({
          id: decoded.user.id,
          isAdmin: decoded.user.isAdmin || false,
          token,
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      setUser({
        id: decoded.user.id,
        isAdmin: decoded.user.isAdmin || false,
        token,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // Let the component handle the error (e.g., show message)
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const token = res.data.token;

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      setUser({
        id: decoded.user.id,
        isAdmin: decoded.user.isAdmin || false,
        totalSpent: decoded.user.totalSpent || 0,
        token,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // Optional: export default if you prefer
