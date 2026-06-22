const API_BASE_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You are not logged in. Access token is missing.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Settings request failed");
  }

  return data;
}

export async function getSettings() {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function saveSettings({ nickname, theme, fontColor }) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      nickname,
      theme,
      fontColor,
    }),
  });

  return handleResponse(response);
}