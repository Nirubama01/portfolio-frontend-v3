import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackButton from "../components/BackButton";

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

        if (!userId || !portfolioId) {
          throw new Error("Portfolio details are missing.");
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

        const text = await response.text();

        let data = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { message: text };
        }

        // Handles old API Gateway non-proxy response format if it appears.
        if (data?.statusCode && typeof data.body === "string") {
          const nestedData = JSON.parse(data.body);

          if (data.statusCode >= 400) {
            throw new Error(nestedData.message || "Could not load portfolio.");
          }

          data = nestedData;
        }

        if (!response.ok) {
          throw new Error(data.message || "Could not load portfolio.");
        }

        setPortfolio(data);
      } catch (err) {
        console.error("Could not load portfolio:", err);
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
        <p className="admin-loading">Loading portfolio details...</p>
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

  return (
    <main className="admin-page">
      <BackButton />

      <section className="admin-header">
        <div>
          <p className="admin-eyebrow">PORTFOLIO REVIEW</p>
          <h1>{portfolio?.title || "Portfolio Details"}</h1>
          <p>Viewing a portfolio created by a user.</p>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Project Information</h2>
            <p>Read-only portfolio details.</p>
          </div>
        </div>

        <div className="admin-detail-grid">
          <article className="admin-detail-card">
            <span>Title</span>
            <strong>{portfolio?.title || "—"}</strong>
          </article>

          <article className="admin-detail-card">
            <span>Language</span>
            <strong>{portfolio?.language || "—"}</strong>
          </article>

          <article className="admin-detail-card">
            <span>User ID</span>
            <strong className="admin-id">{portfolio?.userId || "—"}</strong>
          </article>

          <article className="admin-detail-card">
            <span>Portfolio ID</span>
            <strong className="admin-id">
              {portfolio?.portfolioId || "—"}
            </strong>
          </article>
        </div>

        <article className="admin-detail-description">
          <span>Description</span>
          <p>{portfolio?.description || "No description provided."}</p>
        </article>

        {portfolio?.link && (
          <a
            className="admin-view-button"
            href={portfolio.link}
            target="_blank"
            rel="noreferrer"
          >
            Open Project Link
          </a>
        )}
      </section>
    </main>
  );
}

export default AdminPortfolioView;