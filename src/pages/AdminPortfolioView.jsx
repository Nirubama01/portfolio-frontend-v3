import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "../components/BackButton";

import ClassicTemplate from "../templates/ClassicTemplate";
import DarkTemplate from "../templates/DarkTemplate";
import DeveloperTemplate from "../templates/DeveloperTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import NeonTemplate from "../templates/NeonTemplate";
import ResumeTemplate from "../templates/ResumeTemplate";
import ShowcaseTemplate from "../templates/ShowcaseTemplate";
import TerminalTemplate from "../templates/TerminalTemplate";

const API_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio";

function AdminPortfolioView() {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const portfolioId = searchParams.get("portfolioId");

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const idToken = localStorage.getItem("id_token");

        if (!idToken) {
          throw new Error("You are not logged in.");
        }

        const response = await fetch(
          `${API_URL}/admin-view?userId=${encodeURIComponent(
            userId
          )}&portfolioId=${encodeURIComponent(portfolioId)}`,
          {
            headers: {
              Authorization: idToken,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load portfolio.");
        }

        setPortfolio(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load portfolio.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [userId, portfolioId]);

  if (loading) {
    return (
      <main className="admin-page">
        <BackButton />
        <p className="admin-loading">Loading portfolio preview...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-page">
        <BackButton />
        <p className="settings-message settings-error">{error}</p>
      </main>
    );
  }

  const template = String(portfolio.template || "classic").toLowerCase();

  const templateProps = {
    portfolio,
    readOnly: true,
  };

  const templateMap = {
    classic: <ClassicTemplate {...templateProps} />,
    dark: <DarkTemplate {...templateProps} />,
    developer: <DeveloperTemplate {...templateProps} />,
    modern: <ModernTemplate {...templateProps} />,
    neon: <NeonTemplate {...templateProps} />,
    resume: <ResumeTemplate {...templateProps} />,
    showcase: <ShowcaseTemplate {...templateProps} />,
    terminal: <TerminalTemplate {...templateProps} />,
  };

  return (
    <main className="admin-portfolio-preview-page">
      <div className="admin-preview-toolbar">
        <BackButton />

        <div>
          <p className="admin-eyebrow">ADMIN PORTFOLIO PREVIEW</p>
          <p className="admin-preview-note">
            Read-only view · Template: {template}
          </p>
        </div>
      </div>

      {templateMap[template] || (
        <section className="admin-section">
          <h2>Template not found</h2>
          <p>
            This portfolio uses the template: <strong>{template}</strong>
          </p>
        </section>
      )}
    </main>
  );
}

export default AdminPortfolioView;