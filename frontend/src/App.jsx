import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

const Home = ({ onLogout }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome, you are logged in 🎉</h1>

      <button
        onClick={onLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#5F41E4",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={user ? <Home onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route path="/register" element={<Register />} 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;