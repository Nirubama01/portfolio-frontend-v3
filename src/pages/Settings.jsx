import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfileUploadUrl,
  getSettings,
  saveSettings,
  uploadProfileImage,
} from "../services/settingsApi";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function Settings() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("light");
  const [fontColor, setFontColor] = useState("#1f2937");

  const [profileImageKey, setProfileImageKey] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();

        setNickname(data.nickname || "");
        setUsername(data.username || "");
        setTheme(data.theme || "light");
        setFontColor(data.fontColor || "#1f2937");
        setProfileImageKey(data.profileImageKey || "");
        setProfileImageUrl(data.profileImageUrl || "");
      } catch (err) {
        setError(err.message || "Could not load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setMessage("");

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setProfileImageUrl(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      let imageKeyToSave = profileImageKey;

      if (selectedImage) {
        const { uploadUrl, profileImageKey: newImageKey } =
          await getProfileUploadUrl(selectedImage.type);

        await uploadProfileImage(uploadUrl, selectedImage);

        imageKeyToSave = newImageKey;
      }

      const data = await saveSettings({
        nickname,
        theme,
        fontColor,
        profileImageKey: imageKeyToSave,
      });

      setNickname(data.nickname || nickname);
      setUsername(data.username || username);
      setTheme(data.theme || "light");
      setFontColor(data.fontColor || "#1f2937");
      setProfileImageKey(data.profileImageKey || "");
      setProfileImageUrl(data.profileImageUrl || profileImageUrl);
      setSelectedImage(null);

      localStorage.setItem("nickname", data.nickname || nickname);
      localStorage.setItem("appTheme", data.theme || "light");
      localStorage.setItem("fontColor", data.fontColor || "#1f2937");
      localStorage.setItem(
        "profileImageUrl",
        data.profileImageUrl || profileImageUrl || ""
      );

      document.documentElement.dataset.theme = data.theme || "light";
      document.documentElement.style.setProperty(
        "--text",
        data.fontColor || "#1f2937"
      );

      setMessage("Settings and profile picture saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="settings-page">
        <p className="settings-loading">Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to dashboard
      </button>

      <header className="settings-header">
        <p className="settings-eyebrow">PERSONALIZATION</p>
        <h1>Settings</h1>
        <p>
          Choose your display name, profile picture, and workspace appearance.
        </p>
      </header>

      <form className="settings-card" onSubmit={handleSave}>
        <div className="settings-section">
          <div>
            <h2>Profile</h2>
            <p>Choose the name and picture shown in your workspace.</p>
          </div>

          <div className="profile-image-row">
            <div className="profile-image-preview">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile preview" />
              ) : (
                <span>{(nickname || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>

            <label className="profile-image-upload">
              <span>Choose profile picture</span>
              <small>JPG, PNG, or WEBP · Maximum 5 MB</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="settings-field">
            <span>Username</span>

            <input
              type="text"
              value={username}
              readOnly
              placeholder="Your signup username"
            />

            <small className="username-help-text">
              This is your signup username. Other users can search for you in
              Social.
            </small>
          </div>

          <label className="settings-field">
            <span>Nickname</span>

            <input
              type="text"
              value={nickname}
              maxLength="40"
              placeholder="For example: Niru"
              onChange={(event) => setNickname(event.target.value)}
            />
          </label>
        </div>

        <div className="settings-section">
          <div>
            <h2>Appearance</h2>
            <p>Select the theme and main text color for your workspace.</p>
          </div>

          <div className="settings-field">
            <span>Theme</span>

            <div className="settings-theme-options">
              <button
                type="button"
                className={`settings-theme-button ${
                  theme === "light" ? "active" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                ☀ Light
              </button>

              <button
                type="button"
                className={`settings-theme-button ${
                  theme === "dark" ? "active" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                ◐ Dark
              </button>
            </div>
          </div>

          <label className="settings-field settings-color-field">
            <span>Font color</span>

            <div className="settings-color-control">
              <input
                type="color"
                value={fontColor}
                onChange={(event) => setFontColor(event.target.value)}
                aria-label="Choose font color"
              />

              <input
                type="text"
                value={fontColor}
                maxLength="7"
                onChange={(event) => setFontColor(event.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="settings-preview" style={{ color: fontColor }}>
          <span>Preview</span>
          <strong>{nickname || "Your nickname"}</strong>
          <p>Your portfolio workspace will use these preferences.</p>
        </div>

        {error && <p className="settings-message settings-error">{error}</p>}

        {message && (
          <p className="settings-message settings-success">{message}</p>
        )}

        <div className="settings-actions">
          <button
            type="button"
            className="edit-cancel-button"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button
            className="settings-save-button"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Settings;