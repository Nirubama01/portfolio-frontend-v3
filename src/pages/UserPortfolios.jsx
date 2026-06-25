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
  const [reviews, setReviews] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [openRatings, setOpenRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const userId = location.state?.userId;
  const displayUsername = location.state?.username || username;
  const reviewerId = localStorage.getItem("userId");
  const token = localStorage.getItem("id_token");

  const loadReviews = async (portfolioId) => {
    try {
      const response = await fetch(
        `${API_URL}/portfolio/review?portfolioId=${encodeURIComponent(
          portfolioId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load reviews.");
      }

      setReviews((previousReviews) => ({
        ...previousReviews,
        [portfolioId]: {
          likedCount: data.likedCount || 0,
          averageRating: data.averageRating || 0,
          ratingCount: data.ratingCount || 0,
          comments: Array.isArray(data.comments) ? data.comments : [],
        },
      }));
    } catch (error) {
      console.error("Could not load reviews:", error);
    }
  };

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

        const portfolioList = Array.isArray(data) ? data : [];

        setPortfolios(portfolioList);

        await Promise.all(
          portfolioList.map((portfolio) => loadReviews(portfolio.portfolioId))
        );
      } catch (error) {
        console.error("Could not load user portfolios:", error);
        setMessage(error.message || "Could not load portfolios.");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolios();
  }, [userId]);

  const setPortfolioLoading = (portfolioId, value) => {
    setActionLoading((previousLoading) => ({
      ...previousLoading,
      [portfolioId]: value,
    }));
  };

  const canReviewPortfolio = (portfolio) => {
    if (!reviewerId) {
      alert("Please log in again first.");
      return false;
    }

    if (portfolio.userId === reviewerId) {
      alert("You cannot review your own portfolio.");
      return false;
    }

    return true;
  };

  const saveLike = async (portfolio) => {
    if (!canReviewPortfolio(portfolio)) return;

    try {
      setPortfolioLoading(portfolio.portfolioId, true);

      const response = await fetch(`${API_URL}/portfolio/review/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          portfolioId: portfolio.portfolioId,
          userId: portfolio.userId,
          reviewerId,
          value: "liked",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save like.");
      }

      await loadReviews(portfolio.portfolioId);
    } catch (error) {
      console.error("Like error:", error);
      alert(error.message || "Could not save like.");
    } finally {
      setPortfolioLoading(portfolio.portfolioId, false);
    }
  };

  const saveRating = async (portfolio, rating) => {
    if (!canReviewPortfolio(portfolio)) return;

    try {
      setPortfolioLoading(portfolio.portfolioId, true);

      const response = await fetch(`${API_URL}/portfolio/review/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          portfolioId: portfolio.portfolioId,
          userId: portfolio.userId,
          reviewerId,
          value: String(rating),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save rating.");
      }

      await loadReviews(portfolio.portfolioId);

      setOpenRatings((previous) => ({
        ...previous,
        [portfolio.portfolioId]: false,
      }));
    } catch (error) {
      console.error("Rating error:", error);
      alert(error.message || "Could not save rating.");
    } finally {
      setPortfolioLoading(portfolio.portfolioId, false);
    }
  };

  const saveComment = async (portfolio) => {
    if (!canReviewPortfolio(portfolio)) return;

    const comment = (commentInputs[portfolio.portfolioId] || "").trim();

    if (!comment) {
      alert("Please write a comment first.");
      return;
    }

    try {
      setPortfolioLoading(portfolio.portfolioId, true);

      const response = await fetch(`${API_URL}/portfolio/review/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          portfolioId: portfolio.portfolioId,
          userId: portfolio.userId,
          reviewerId,
          value: comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not post comment.");
      }

      setCommentInputs((previousInputs) => ({
        ...previousInputs,
        [portfolio.portfolioId]: "",
      }));

      await loadReviews(portfolio.portfolioId);

      setOpenComments((previous) => ({
        ...previous,
        [portfolio.portfolioId]: false,
      }));
    } catch (error) {
      console.error("Comment error:", error);
      alert(error.message || "Could not post comment.");
    } finally {
      setPortfolioLoading(portfolio.portfolioId, false);
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
          {portfolios.map((portfolio) => {
            const review = reviews[portfolio.portfolioId] || {
              likedCount: 0,
              averageRating: 0,
              ratingCount: 0,
              comments: [],
            };

            const isSaving = actionLoading[portfolio.portfolioId];
            const commentsAreOpen = openComments[portfolio.portfolioId];
            const ratingsAreOpen = openRatings[portfolio.portfolioId];

            return (
              <article
                className="portfolio-item-card"
                key={portfolio.portfolioId}
              >
                <div className="portfolio-template-preview">
                  {renderTemplate(portfolio)}
                </div>

                <section className="compact-review-bar">
                  <button
                    type="button"
                    className="compact-review-action"
                    onClick={() => saveLike(portfolio)}
                    disabled={isSaving}
                    title="Like this portfolio"
                  >
                    <span className="compact-review-icon">♥</span>
                    <span>{review.likedCount}</span>
                  </button>

                  <div className="compact-review-menu">
                    <button
                      type="button"
                      className="compact-review-action"
                      onClick={() =>
                        setOpenRatings((previous) => ({
                          ...previous,
                          [portfolio.portfolioId]: !ratingsAreOpen,
                        }))
                      }
                      disabled={isSaving}
                      title="Rate this portfolio"
                    >
                      <span className="compact-review-icon">★</span>
                      <span>
                        {Number(review.averageRating || 0).toFixed(1)}
                      </span>
                    </button>

                    {ratingsAreOpen && (
                      <div className="compact-review-popup">
                        <p>Rate this portfolio</p>

                        <div className="compact-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => saveRating(portfolio, star)}
                              disabled={isSaving}
                              aria-label={`Give ${star} star rating`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <small>{review.ratingCount} ratings</small>
                      </div>
                    )}
                  </div>

                  <div className="compact-review-menu">
                    <button
                      type="button"
                      className="compact-review-action"
                      onClick={() =>
                        setOpenComments((previous) => ({
                          ...previous,
                          [portfolio.portfolioId]: !commentsAreOpen,
                        }))
                      }
                      disabled={isSaving}
                      title="View or add comments"
                    >
                      <span className="compact-review-icon">💬</span>
                      <span>{review.comments.length}</span>
                    </button>

                    {commentsAreOpen && (
                      <div className="compact-comments-popup">
                        <div className="compact-comments-popup-header">
                          <strong>Comments ({review.comments.length})</strong>

                          <button
                            type="button"
                            className="compact-comments-close"
                            onClick={() =>
                              setOpenComments((previous) => ({
                                ...previous,
                                [portfolio.portfolioId]: false,
                              }))
                            }
                            aria-label="Close comments"
                          >
                            ×
                          </button>
                        </div>

                        <div className="compact-comment-form">
                          <textarea
                            value={
                              commentInputs[portfolio.portfolioId] || ""
                            }
                            placeholder="Write a comment..."
                            rows="2"
                            onChange={(event) =>
                              setCommentInputs((previousInputs) => ({
                                ...previousInputs,
                                [portfolio.portfolioId]: event.target.value,
                              }))
                            }
                          />

                          <button
                            type="button"
                            onClick={() => saveComment(portfolio)}
                            disabled={isSaving}
                          >
                            Post
                          </button>
                        </div>

                        {review.comments.length === 0 ? (
                          <p className="compact-no-comments">
                            No comments yet.
                          </p>
                        ) : (
                          <div className="compact-comments-list">
                            {review.comments.map((comment, index) => (
                              <div
                                className="compact-comment-item"
                                key={`${comment.reviewerId}-${
                                  comment.createdAt || index
                                }`}
                              >
                                <span className="compact-comment-avatar">
                                  {(comment.reviewerUsername || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>

                                <div>
                                  <strong>
                                    @{comment.reviewerUsername || "User"}
                                  </strong>
                                  <p>{comment.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default UserPortfolios;