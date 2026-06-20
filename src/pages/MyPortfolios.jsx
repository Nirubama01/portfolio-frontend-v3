import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassicTemplate from "../templates/ClassicTemplate";
import DarkTemplate from "../templates/DarkTemplate";
import ResumeTemplate from "../templates/ResumeTemplate";
import DeveloperTemplate from "../templates/DeveloperTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import ShowcaseTemplate from "../templates/ShowcaseTemplate";
import NeonTemplate from "../templates/NeonTemplate";
import TerminalTemplate from "../templates/TerminalTemplate";
import BackButton from "../components/BackButton";

function MyPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(
      `https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio?userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPortfolios(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error(error);
        setPortfolios([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const deletePortfolio = async (userId, portfolioId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            portfolioId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      setPortfolios((currentPortfolios) =>
        currentPortfolios.filter(
          (portfolio) => portfolio.portfolioId !== portfolioId
        )
      );

      alert("Portfolio deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not delete the portfolio. Please try again.");
    }
  };

  const renderTemplate = (portfolio) => {
    switch (portfolio.template) {
      case "dark":
        return <DarkTemplate portfolio={portfolio} />;
      case "resume":
        return <ResumeTemplate portfolio={portfolio} />;
      case "developer":
        return <DeveloperTemplate portfolio={portfolio} />;
      case "modern":
        return <ModernTemplate portfolio={portfolio} />;
      case "showcase":
        return <ShowcaseTemplate portfolio={portfolio} />;
      case "neon":
        return <NeonTemplate portfolio={portfolio} />;
      case "terminal":
        return <TerminalTemplate portfolio={portfolio} />;
      default:
        return <ClassicTemplate portfolio={portfolio} />;
    }
  };

  return (
    
    <main className="portfolios-page">
      <BackButton />
      <section className="portfolios-header">
        <div>
          <p className="portfolios-eyebrow">YOUR WORK</p>
          <h1>My Portfolios</h1>
          <p>
            View your published projects, edit their details, or remove projects
            you no longer need.
          </p>
        </div>

        <button
          className="new-portfolio-button"
          onClick={() => navigate("/create-portfolio")}
        >
          + Create Portfolio
        </button>
      </section>

      {loading ? (
        <div className="portfolio-message-card">Loading your portfolios...</div>
      ) : portfolios.length === 0 ? (
        <section className="empty-portfolio-card">
          <div className="empty-portfolio-icon">+</div>
          <h2>No portfolios yet</h2>
          <p>Create your first project and it will appear here.</p>
          <button
            className="new-portfolio-button"
            onClick={() => navigate("/create-portfolio")}
          >
            Create your first portfolio
          </button>
        </section>
      ) : (
        <section className="portfolio-list">
          {portfolios.map((portfolio) => (
            <article className="portfolio-item-card" key={portfolio.portfolioId}>
              <div className="portfolio-template-preview">
                {renderTemplate(portfolio)}
              </div>

              <div className="portfolio-item-actions">
                <button
                  className="edit-portfolio-button"
                  onClick={() =>
                    navigate("/edit-portfolio", {
                      state: portfolio,
                    })
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-portfolio-button"
                  onClick={() =>
                    deletePortfolio(portfolio.userId, portfolio.portfolioId)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyPortfolios;