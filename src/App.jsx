import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPortfolioView from "./pages/AdminPortfolioView";
import { useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePortfolio from "./pages/CreatePortfolio";
import MyPortfolios from "./pages/MyPortfolios";
import EditPortfolio from "./pages/EditPortfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import SharedPortfolios from "./pages/SharedPortfolios";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme") || "light";
    const savedFontColor = localStorage.getItem("fontColor") || "#6b6375";

    document.documentElement.dataset.theme = savedTheme;
    document.documentElement.style.setProperty("--text", savedFontColor);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/create-portfolio"
          element={
            <ProtectedRoute>
              <CreatePortfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-portfolios"
          element={
            <ProtectedRoute>
              <MyPortfolios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-portfolio"
          element={
            <ProtectedRoute>
              <EditPortfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/portfolio"
  element={
    <ProtectedRoute>
      <AdminPortfolioView />
    </ProtectedRoute>
  }
/>

<Route path="/share/:shareId" element={<SharedPortfolios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;