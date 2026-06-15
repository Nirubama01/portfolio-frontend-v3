export const cognitoConfig = {
  clientId:
    import.meta.env.VITE_COGNITO_CLIENT_ID || "41srruhjebtheft95e23emvnvv",

  domain:
    import.meta.env.VITE_COGNITO_DOMAIN || "https://ap-south-13jwxcnfde.auth.ap-south-1.amazoncognito.com",

  redirectUri:
    import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173/dashboard"
};