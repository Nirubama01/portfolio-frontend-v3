import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../components/BackButton";

const API_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio";

function EditPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();
  const portfolio = location.state;

  const [title, setTitle] = useState(portfolio?.title || "");
  const [description, setDescription] = useState(portfolio?.description || "");
  const [language, setLanguage] = useState(portfolio?.language || "");

  // Convert saved array ["React", "AWS"] into editable text "React, AWS"
  const [tools, setTools] = useState(
    Array.isArray(portfolio?.tools)
      ? portfolio.tools.join(", ")
      : portfolio?.tools || ""
  );

  const [saving, setSaving] = useState(false);

  const updatePortfolio = async () => {
    try {
      if (!portfolio?.userId || !portfolio?.portfolioId) {
        throw new Error("Portfolio information is missing.");
      }

      if (!title.trim()) {
        alert("Please enter a project title.");
        return;
      }

      setSaving(true);

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("id_token"),
        },
        body: JSON.stringify({
          userId: portfolio.userId,
          portfolioId: portfolio.portfolioId,
          title: title.trim(),
          description: description.trim(),
          language: language.trim(),

          // Convert "React, AWS, DynamoDB" back to an array before saving
          tools: tools
            .split(",")
            .map((tool) => tool.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update portfolio.");
      }

      alert("Portfolio updated successfully.");
      navigate("/my-portfolios");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message || "Could not update the portfolio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!portfolio) {
    return (
      <main className="edit-page">
        <BackButton />

        <section className="edit-form-card">
          <h2>Portfolio not found</h2>
          <p>Please go back to My Portfolios and click Edit again.</p>

          <button
            type="button"
            className="edit-cancel-button"
            onClick={() => navigate("/my-portfolios")}
          >
            Back to My Portfolios
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="edit-page">
      <BackButton />

      <section className="edit-header">
        <p className="edit-eyebrow">UPDATE PROJECT</p>
        <h1>Edit Portfolio</h1>
        <p>Update your project information and save the changes.</p>
      </section>

      <section className="edit-form-card">
        <div className="edit-form-heading">
          <h2>Project details</h2>
          <p>Make changes to the information shown in your portfolio.</p>
        </div>

        <label className="edit-form-field">
          <span>Project title</span>

          <input
            value={title}
            placeholder="Project title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="edit-form-field">
          <span>Description</span>

          <textarea
            value={description}
            placeholder="Project description"
            rows="7"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="edit-form-field">
          <span>Language</span>

          <input
            value={language}
            placeholder="Example: React, JavaScript"
            onChange={(e) => setLanguage(e.target.value)}
          />
        </label>

        <label className="edit-form-field">
          <span>Tools</span>

          <input
            value={tools}
            placeholder="Example: React, AWS, DynamoDB, Figma"
            onChange={(e) => setTools(e.target.value)}
          />

          <small className="edit-tools-help">
            Separate each tool using a comma.
          </small>
        </label>

        <div className="edit-actions">
          <button
            type="button"
            className="edit-cancel-button"
            onClick={() => navigate("/my-portfolios")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="edit-save-button"
            onClick={updatePortfolio}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default EditPortfolio;