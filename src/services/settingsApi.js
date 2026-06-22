const API_BASE_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod";

function getHeaders() {
  const idToken = localStorage.getItem("id_token");

  if (!idToken) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: idToken,
  };
}

async function readResponse(response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Settings request failed (${response.status})`
    );
  }

  return data;
}

export async function getSettings() {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "GET",
    headers: getHeaders(),
  });

  return readResponse(response);
}

export async function saveSettings({
  nickname,
  theme,
  fontColor,
  profileImageKey,
}) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      nickname,
      theme,
      fontColor,
      profileImageKey,
    }),
  });

  return readResponse(response);
}

export async function getProfileUploadUrl(contentType) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      contentType,
    }),
  });

  return readResponse(response);
}

export async function uploadProfileImage(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Image upload to S3 failed.");
  }
}