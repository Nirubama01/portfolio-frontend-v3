import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod";

function UserPortfolios() {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userId = location.state?.userId;
  const displayUsername = location.state?.username || username;

  useEffect(() => {
    const loadPortfolios = async () => {
      if (!userId) {
        setMessage(
          "User details are missing. Please search for the user again from Social."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const response = await fetch(
          `${API_URL}/portfolio?userId=${encodeURIComponent(userId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load portfolios.");
        }

        setPortfolios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Could not load user portfolios:", error);
        setMessage(error.message || "Could not load portfolios.");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolios();
  }, [userId]);

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
    <main className="user-portfolios-page">
      <BackButton />

      <section className="user-portfolios-header">
        <p className="user-portfolios-eyebrow">CREATOR PORTFOLIOS</p>
        <h1>@{displayUsername}</h1>
        <p>Explore this creator&apos;s projects and portfolio work.</p>
      </section>

      {loading ? (
        <div className="portfolio-message-card">Loading portfolios...</div>
      ) : message ? (
        <section className="empty-portfolio-card">
          <h2>Could not open portfolios</h2>
          <p>{message}</p>

          <button
            type="button"
            className="new-portfolio-button"
            onClick={() => navigate("/social")}
          >
            Back to Social
          </button>
        </section>
      ) : portfolios.length === 0 ? (
        <section className="empty-portfolio-card">
          <h2>No portfolios yet</h2>
          <p>@{displayUsername} has not created any portfolios yet.</p>
        </section>
      ) : (
        <section className="portfolio-list">
          {portfolios.map((portfolio) => (
            <article
              className="portfolio-item-card"
              key={portfolio.portfolioId}
            >
              <div className="portfolio-template-preview">
                {renderTemplate(portfolio)}
              </div>

              <div className="user-portfolio-info">
                <h2>{portfolio.title}</h2>
                <p>{portfolio.description}</p>

                {portfolio.language && (
                  <span className="user-portfolio-language">
                    {portfolio.language}
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default UserPortfolios;