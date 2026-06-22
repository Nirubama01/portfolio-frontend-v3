import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePortfolio from "./pages/CreatePortfolio";
import MyPortfolios from "./pages/MyPortfolios";
import EditPortfolio from "./pages/EditPortfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route
  path="/dashboard"
  element={
    
      <Dashboard />
    
  }
/>
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
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
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

</Routes>
    </BrowserRouter>
  );
}

export default App;