import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../components/BackButton";

function EditPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();
  const portfolio = location.state;

  const [title, setTitle] = useState(portfolio.title);
  const [description, setDescription] = useState(portfolio.description);
  const [language, setLanguage] = useState(portfolio.language);
  const [saving, setSaving] = useState(false);

  const updatePortfolio = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: portfolio.userId,
            portfolioId: portfolio.portfolioId,
            title,
            description,
            language,
            tools: portfolio.tools,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not update portfolio");
      }

      alert("Portfolio updated successfully.");
      navigate("/my-portfolios");
    } catch (error) {
      console.error(error);
      alert("Could not update the portfolio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

        <div className="edit-actions">
          <button
            type="button"
            className="edit-cancel-button"
            onClick={() => navigate("/my-portfolios")}
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