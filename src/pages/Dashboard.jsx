import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cognitoConfig } from "../cognitoConfig";
import { jwtDecode } from "jwt-decode";

function Dashboard() {

  const navigate = useNavigate();
  const logout = () => {

  localStorage.removeItem(
    "userId"
  );

  localStorage.removeItem(
    "id_token"
  );

  localStorage.removeItem(
    "cognito_code"
  );

  navigate("/");
};
  useEffect(() => {

  const params =
    new URLSearchParams(window.location.search);

  const code =
    params.get("code");

  console.log("Authorization Code:", code);

if (code) {
  localStorage.setItem(
    "cognito_code",
    code
  );

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
      client_id:
        cognitoConfig.clientId,
      code: code,
      redirect_uri:
        cognitoConfig.redirectUri,
    }),
  }
)
  .then((response) =>
    response.json()
  )
  .then((data) => {

    const decodedToken =
  jwtDecode(data.id_token);

console.log(
  "Decoded Token:",
  decodedToken
);

localStorage.setItem(
  "userId",
  decodedToken.sub
);

  console.log(
    "Token Response:",
    data
  );

  localStorage.setItem(
    "id_token",
    data.id_token
  );

});
}

}, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome to Portfolio Management System</h2>

      <button
        onClick={() => navigate("/create-portfolio")}
      >
        Create Portfolio
      </button>

      <br /><br />

      <button
  onClick={() => navigate("/my-portfolios")}
>
  My Portfolios
</button>

<br /><br />

<button onClick={logout}>
  Logout
</button>
    </div>
  );
}

export default Dashboard;