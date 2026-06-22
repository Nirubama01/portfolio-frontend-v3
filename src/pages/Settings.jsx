import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, saveSettings } from "../services/settingsApi";

function Settings() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [theme, setTheme] = useState("light");
  const [fontColor, setFontColor] = useState("#1f2937");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();

        setNickname(data.nickname || "");
        setTheme(data.theme || "light");
        setFontColor(data.fontColor || "#1f2937");
      } catch (err) {
        setError(err.message || "Could not load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await saveSettings({
        nickname,
        theme,
        fontColor,
      });

      // Save locally so we can use it later on Dashboard and other pages.
      localStorage.setItem("nickname", data.nickname);
      localStorage.setItem("appTheme", data.theme);
      localStorage.setItem("fontColor", data.fontColor);
      document.documentElement.dataset.theme = data.theme;
document.documentElement.style.setProperty("--text", data.fontColor);

      setMessage("Settings saved successfully.");
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
          Choose how your portfolio workspace looks and how your name appears.
        </p>
      </header>

      <form className="settings-card" onSubmit={handleSave}>
        <div className="settings-section">
          <div>
            <h2>Profile name</h2>
            <p>This name will be shown in your app instead of your account name.</p>
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
        {message && <p className="settings-message settings-success">{message}</p>}

        <div className="settings-actions">
          <button
            type="button"
            className="edit-cancel-button"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button className="settings-save-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Settings;