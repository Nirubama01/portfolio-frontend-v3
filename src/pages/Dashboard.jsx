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
    const params = new URLSearchParams(
      window.location.search
    );

    const code = params.get("code");

    if (!code) {
      return;
    }

    fetch(
      `${cognitoConfig.domain}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: cognitoConfig.clientId,
          code: code,
          redirect_uri:
            cognitoConfig.redirectUri,
        }),
      }
    )
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

        console.log("Admin:", admin);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome to Portfolio Management System</h2>

      <button onClick={() => navigate("/create-portfolio")}>
        Create Portfolio
      </button>

      <br />
      <br />

      <button onClick={() => navigate("/my-portfolios")}>
        My Portfolios
      </button>

      {isAdmin && (
        <>
          <br />
          <br />
          <button onClick={() => navigate("/admin")}>
            Admin Dashboard
          </button>
        </>
      )}

      <br />
      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
