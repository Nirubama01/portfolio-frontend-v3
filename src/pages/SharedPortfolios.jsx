import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

function SharedPortfolios() {
  const { shareId } = useParams();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSharedPortfolios() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/share?shareId=${encodeURIComponent(shareId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load shared portfolios."
          );
        }

        setPortfolios(
          Array.isArray(data.portfolios) ? data.portfolios : []
        );
      } catch (err) {
        console.error("Shared portfolio error:", err);
        setError(
          err.message || "Could not load shared portfolios."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSharedPortfolios();
  }, [shareId]);

  function renderPortfolioTemplate(portfolio) {
    const template = String(portfolio.template || "classic").toLowerCase();

    switch (template) {
      case "dark":
        return <DarkTemplate portfolio={portfolio} />;

      case "developer":
        return <DeveloperTemplate portfolio={portfolio} />;

      case "modern":
        return <ModernTemplate portfolio={portfolio} />;

      case "neon":
        return <NeonTemplate portfolio={portfolio} />;

      case "resume":
        return <ResumeTemplate portfolio={portfolio} />;

      case "showcase":
        return <ShowcaseTemplate portfolio={portfolio} />;

      case "terminal":
        return <TerminalTemplate portfolio={portfolio} />;

      case "classic":
      default:
        return <ClassicTemplate portfolio={portfolio} />;
    }
  }

  if (loading) {
    return (
      <main style={{ padding: "30px" }}>
        <h1>Loading shared portfolios...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "30px" }}>
        <h1>Shared Portfolios</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Portfolios</h1>

      {portfolios.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No portfolios are available in this shared link.
        </p>
      ) : (
        portfolios.map((portfolio) => (
          <div key={portfolio.portfolioId}>
            {renderPortfolioTemplate(portfolio)}
          </div>
        ))
      )}
    </main>
  );
}

export default SharedPortfolios;