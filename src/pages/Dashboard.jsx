import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cognitoConfig } from "../cognitoConfig";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("id_token");
    localStorage.removeItem("cognito_code");
    localStorage.removeItem("isAdmin");

    navigate("/");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      return;
    }

    fetch(`${cognitoConfig.domain}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: cognitoConfig.clientId,
        code: code,
        redirect_uri: cognitoConfig.redirectUri,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        console.log("TOKEN RESPONSE", data);
        console.log("STATUS", response.status);
        return data;
      })
      .then((data) => {
        if (!data.id_token) {
          console.error("No id_token returned", data);
          return;
        }

        const decodedToken = jwtDecode(data.id_token);

        localStorage.setItem("userId", decodedToken.sub);
        localStorage.setItem("id_token", data.id_token);

        const admin =
          decodedToken["cognito:groups"]?.includes("Admin") || false;

        localStorage.setItem("isAdmin", String(admin));
        setIsAdmin(admin);

        // Removes ?code=... from the browser URL after login.
        window.history.replaceState({}, document.title, "/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">PORTFOLIO MANAGEMENT</p>

          <h1>Welcome back!</h1>

          <p className="dashboard-description">
            Create, organize, and manage your portfolio projects from one
            place.
          </p>
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </section>

      <section className="dashboard-actions">
        <button
          className="dashboard-card create-card"
          onClick={() => navigate("/create-portfolio")}
        >
          <span className="dashboard-icon">+</span>

          <span>
            <strong>Create Portfolio</strong>
            <small>Add a new project to your portfolio</small>
          </span>
        </button>

        <button
          className="dashboard-card portfolios-card"
          onClick={() => navigate("/my-portfolios")}
        >
          <span className="dashboard-icon">▣</span>

          <span>
            <strong>My Portfolios</strong>
            <small>View, edit, and delete your projects</small>
          </span>
        </button>

        {isAdmin && (
          <button
            className="dashboard-card admin-card"
            onClick={() => navigate("/admin")}
          >
            <span className="dashboard-icon">♙</span>

            <span>
              <strong>Admin Dashboard</strong>
              <small>Manage all users and portfolio records</small>
            </span>
          </button>
        )}
      </section>
    </main>
  );
}

export default Dashboard;