import Remains from "./Remains";
import Header from "./Header";
import Login from "./Login";
import Cards from "./Cards";
import Sales from "./Sales";
import Reports from "./Reports";
import Sidebar from "./Sidebar";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { refreshToken } from "/src/utils/auth.js";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  const { loggedIn, setLoggedIn, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [content, setContent] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshToken();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log("loggedIn изменился:", loggedIn);
  }, [loggedIn]);

  function handleToggleSidebar() {
    setSidebarOpen((prev) => !prev);
    setContent((prev) => !prev);
  }

  const resizeContent = `content ${
    content ? "content-open-sidebar" : "content-streach"
  }`;
  return (
    <div className="pages">
      {loggedIn && (
        <>
          <Header
            signOut={signOut}
            handleToggleSidebar={handleToggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          <Sidebar sidebarOpen={sidebarOpen} />
        </>
      )}
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
        <Route
          path="/remains"
          element={<Remains resizeContent={resizeContent} />}
        />
        <Route
          path="/cards"
          element={<Cards resizeContent={resizeContent} />}
        />
        <Route
          path="/sales"
          element={<Sales resizeContent={resizeContent} />}
        />
        <Route
          path="/reports"
          element={<Reports resizeContent={resizeContent} />}
        />
      </Routes>
    </div>
  );
}

export default App;
