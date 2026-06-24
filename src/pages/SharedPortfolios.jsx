import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
          throw new Error(data.message || "Could not load shared portfolios.");
        }

        setPortfolios(Array.isArray(data.portfolios) ? data.portfolios : []);
      } catch (err) {
        console.error("Could not load shared portfolios:", err);
        setError(err.message || "Could not load shared portfolios.");
      } finally {
        setLoading(false);
      }
    }

    loadSharedPortfolios();
  }, [shareId]);

  if (loading) {
    return (
      <main className="portfolios-page">
        <h1>Loading shared portfolios...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="portfolios-page">
        <h1>Shared Portfolios</h1>
        <p className="settings-message settings-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="portfolios-page">
      <section className="portfolios-header">
        <div>
          <p className="admin-eyebrow">PUBLIC PORTFOLIOS</p>
          <h1>Shared Portfolios</h1>
          <p>View the portfolios shared by this user.</p>
        </div>
      </section>

      {portfolios.length === 0 ? (
        <p>No portfolios were found in this shared link.</p>
      ) : (
        <section className="portfolio-list">
          {portfolios.map((portfolio) => (
            <article
              className="portfolio-item"
              key={portfolio.portfolioId}
            >
              {portfolio.images?.length > 0 && (
                <img
                  className="portfolio-item-image"
                  src={portfolio.images[0]}
                  alt={portfolio.title || "Portfolio"}
                />
              )}

              <div className="portfolio-item-content">
                <p className="portfolio-template-label">
                  {portfolio.template || "classic"} TEMPLATE
                </p>

                <h2>{portfolio.title || "Untitled Portfolio"}</h2>

                <p>{portfolio.description || "No description available."}</p>

                <p>
                  <strong>Language:</strong>{" "}
                  {portfolio.language || "Not specified"}
                </p>

                <p>
                  <strong>Tools:</strong>{" "}
                  {Array.isArray(portfolio.tools)
                    ? portfolio.tools.join(", ")
                    : portfolio.tools || "Not specified"}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default SharedPortfolios;