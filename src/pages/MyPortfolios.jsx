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

const API_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio";

function MyPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [reviewsByPortfolio, setReviewsByPortfolio] = useState({});
  const [loading, setLoading] = useState(true);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const navigate = useNavigate();

  const loadPortfolioReviews = async (portfolioId) => {
    try {
      const response = await fetch(
        `${API_URL}/review?portfolioId=${encodeURIComponent(portfolioId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load reviews.");
      }

      setReviewsByPortfolio((current) => ({
        ...current,
        [portfolioId]: data,
      }));
    } catch (error) {
      console.error("Could not load portfolio reviews:", error);

      setReviewsByPortfolio((current) => ({
        ...current,
        [portfolioId]: {
          likedCount: 0,
          averageRating: 0,
          ratingCount: 0,
          comments: [],
        },
      }));
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    async function loadPortfolios() {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load portfolios.");
        }

        const userPortfolios = Array.isArray(data) ? data : [];

        setPortfolios(userPortfolios);

        await Promise.all(
          userPortfolios.map((portfolio) =>
            loadPortfolioReviews(portfolio.portfolioId)
          )
        );
      } catch (error) {
        console.error("Could not load portfolios:", error);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolios();
  }, []);

  const deletePortfolio = async (userId, portfolioId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("id_token"),
        },
        body: JSON.stringify({
          userId,
          portfolioId,
        }),
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      setPortfolios((currentPortfolios) =>
        currentPortfolios.filter(
          (portfolio) => portfolio.portfolioId !== portfolioId
        )
      );

      setReviewsByPortfolio((current) => {
        const updated = { ...current };
        delete updated[portfolioId];
        return updated;
      });

      alert("Portfolio deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not delete the portfolio. Please try again.");
    }
  };

  const renderTemplate = (portfolio) => {
    switch (String(portfolio.template || "classic").toLowerCase()) {
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

      case "classic":
      default:
        return <ClassicTemplate portfolio={portfolio} />;
    }
  };

  const createShareLink = async () => {
    try {
      setShareLoading(true);
      setCopyMessage("");

      const userId = localStorage.getItem("userId");
      const idToken = localStorage.getItem("id_token");

      if (!userId || !idToken) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create share link.");
      }

      const newShareLink = `${window.location.origin}/share/${data.shareId}`;

      setShareLink(newShareLink);
      setShareOpen(true);
    } catch (error) {
      console.error("Share error:", error);
      alert(error.message || "Could not create the share link.");
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyMessage("Copied!");

      setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
      setCopyMessage("Copy failed. Select and copy the link manually.");
    }
  };

  return (
    <main className="portfolios-page">
      <BackButton />

      <section className="portfolios-header">
        <div>
          <p className="portfolios-eyebrow">YOUR WORK</p>

          <div className="portfolios-title-row">
            <h1>My Portfolios</h1>
          </div>

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
          {portfolios.map((portfolio) => {
            const review = reviewsByPortfolio[portfolio.portfolioId] || {
              likedCount: 0,
              averageRating: 0,
              ratingCount: 0,
              comments: [],
            };

            return (
              <article
                className="portfolio-item-card"
                key={portfolio.portfolioId}
              >
                <div className="portfolio-template-preview">
                  {renderTemplate(portfolio)}
                </div>

                <div className="my-portfolio-review-summary">
                  <span>♥ {review.likedCount || 0}</span>

                  <span>
                    ★ {review.averageRating || 0}/5 ({review.ratingCount || 0})
                  </span>

                  <span>💬 {review.comments?.length || 0}</span>
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
            );
          })}
        </section>
      )}

      <div className="share-page-footer">
        <button
          type="button"
          className="share-portfolios-button"
          onClick={createShareLink}
          disabled={shareLoading}
        >
          <span className="share-button-icon" aria-hidden="true">
            ↗
          </span>
          {shareLoading ? "Creating link..." : "Share My Portfolios"}
        </button>
      </div>

      {shareOpen && (
        <div
          className="share-modal-backdrop"
          onClick={() => setShareOpen(false)}
        >
          <section
            className="share-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Share portfolios"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="share-modal-close"
              onClick={() => setShareOpen(false)}
              aria-label="Close share popup"
            >
              ×
            </button>

            <h2>Share your portfolios</h2>

            <p className="share-modal-subtitle">
              Copy this link and paste it anywhere you want.
            </p>

            <div className="share-link-box">
              <input
                value={shareLink}
                readOnly
                aria-label="Portfolio share link"
                onClick={(event) => event.target.select()}
              />

              <button type="button" onClick={copyShareLink}>
                Copy link
              </button>
            </div>

            {copyMessage && (
              <p className="share-copy-message">{copyMessage}</p>
            )}

            <p className="share-link-help">
              Anyone with this link can view your portfolios.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

export default MyPortfolios;