import { useEffect } from "react";
import { cognitoConfig } from "../cognitoConfig";

function Login() {

  useEffect(() => {
    const { clientId, domain, redirectUri } = cognitoConfig;

    window.location.href =
      `${domain}/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;

  }, []);

  return <h2>Redirecting to Cognito...</h2>;
}

export default Login;