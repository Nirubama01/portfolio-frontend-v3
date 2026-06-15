import { useEffect } from "react";

function Login() {

  useEffect(() => {

    const clientId =
      "41srruhjebtheft95e23emvnvv";

    const redirectUri =
      "http://localhost:5173/dashboard";

    const cognitoDomain =
      "https://ap-south-13jwxcnfde.auth.ap-south-1.amazoncognito.com";

    window.location.href =
      `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;

  }, []);

  return <h2>Redirecting to Cognito...</h2>;
}

export default Login;