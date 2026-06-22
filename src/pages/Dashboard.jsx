import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cognitoConfig } from "../cognitoConfig";
import { jwtDecode } from "jwt-decode";
import { getSettings } from "../services/settingsApi";

function Dashboard() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const [nickname, setNickname] = useState(
  localStorage.getItem("nickname") || ""
);

const [profileImageUrl, setProfileImageUrl] = useState(
  localStorage.getItem("profileImageUrl") || ""
);
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("id_token");
    localStorage.removeItem("cognito_code");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("nickname");
    localStorage.removeItem("appTheme");
    localStorage.removeItem("fontColor");

    navigate("/");
  };

 async function loadNickname() {
  try {
    const data = await getSettings();

    setNickname(data.nickname || "");
    setProfileImageUrl(data.profileImageUrl || "");

    localStorage.setItem("nickname", data.nickname || "");
    localStorage.setItem("appTheme", data.theme || "light");
    localStorage.setItem("fontColor", data.fontColor || "#1f2937");
    localStorage.setItem("profileImageUrl", data.profileImageUrl || "");
  } catch (error) {
    console.error("Could not load settings:", error);
  }
}

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
        code,
        redirect_uri: cognitoConfig.redirectUri,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error_description || "Login failed.");
        }

        return data;
      })
      .then(async (data) => {
        if (!data.id_token) {
          throw new Error("No ID token returned from Cognito.");
        }

        const decodedToken = jwtDecode(data.id_token);

        localStorage.setItem("userId", decodedToken.sub);
        localStorage.setItem("id_token", data.id_token);

        const admin =
          decodedToken["cognito:groups"]?.includes("Admin") || false;

        localStorage.setItem("isAdmin", String(admin));
        setIsAdmin(admin);

        // Remove ?code=... after successful login.
        window.history.replaceState({}, document.title, "/dashboard");

        // Token is now stored, so this can securely call GET /settings.
        await loadNickname();
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  }, []);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
  <div className="dashboard-welcome">
    <div className="dashboard-profile-image">
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="Profile" />
      ) : (
        <span>{(nickname || "U").charAt(0).toUpperCase()}</span>
      )}
    </div>

    <div>
      <p className="dashboard-eyebrow">PORTFOLIO MANAGEMENT</p>

      <h1>Welcome back{nickname ? `, ${nickname}` : ""}!</h1>

      <p className="dashboard-description">
        Create, organize, and manage your portfolio projects from one place.
      </p>
    </div>
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

        <button
          className="dashboard-card settings-card"
          onClick={() => navigate("/settings")}
        >
          <span className="dashboard-icon">⚙</span>

          <span>
            <strong>Settings</strong>
            <small>Customize your profile and app appearance</small>
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