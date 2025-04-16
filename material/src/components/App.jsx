import Remains from "./Remains";
import Header from "./Header";
import Login from "./Login";
import Cards from "./Cards";
import Sales from "./Sales";
import Reports from "./Reports";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { refreshToken } from "/src/utils/auth.js";
import { Route, Routes, Navigate } from "react-router-dom";
function App() {
  const { loggedIn, setLoggedIn, signOut } = useAuth();
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshToken();
    }, 300000); // Обновляем токен каждые 5 минут

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log("loggedIn изменился:", loggedIn);
  }, [loggedIn]);
  return (
    <div className="content">
      {loggedIn && <Header signOut={signOut} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/remains" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/remains" element={<Remains />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
