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
  const [reviewsByPortfolio, setReviewsByPortfolio] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

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

        const sharedPortfolios = Array.isArray(data.portfolios)
          ? data.portfolios
          : [];

        setPortfolios(sharedPortfolios);

        const reviewResults = await Promise.all(
          sharedPortfolios.map(async (portfolio) => {
            try {
              const reviewResponse = await fetch(
                `${API_URL}/review?portfolioId=${encodeURIComponent(
                  portfolio.portfolioId
                )}`
              );

              const reviewData = await reviewResponse.json();

              return {
                portfolioId: portfolio.portfolioId,
                review: reviewResponse.ok
                  ? reviewData
                  : {
                      likedCount: 0,
                      averageRating: 0,
                      ratingCount: 0,
                      comments: [],
                    },
              };
            } catch {
              return {
                portfolioId: portfolio.portfolioId,
                review: {
                  likedCount: 0,
                  averageRating: 0,
                  ratingCount: 0,
                  comments: [],
                },
              };
            }
          })
        );

        const reviewMap = {};

        reviewResults.forEach(({ portfolioId, review }) => {
          reviewMap[portfolioId] = review;
        });

        setReviewsByPortfolio(reviewMap);
      } catch (err) {
        console.error("Shared portfolio error:", err);
        setError(err.message || "Could not load shared portfolios.");
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

  async function loadReviews(portfolioId) {
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
  }

  function getLoggedInUser() {
    const token = localStorage.getItem("id_token");

    if (!token) {
      throw new Error("Please log in to like, rate, or comment.");
    }

    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      throw new Error("Invalid login token. Please log in again.");
    }

    const payload = JSON.parse(
      atob(
        tokenParts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    const reviewerId = payload.sub;

    if (!reviewerId) {
      throw new Error("Could not identify the logged-in user.");
    }

    return { token, reviewerId };
  }

  const currentUserId = (() => {
    try {
      return getLoggedInUser().reviewerId;
    } catch {
      return null;
    }
  })();

  async function saveLike(portfolio, value) {
    try {
      const { token, reviewerId } = getLoggedInUser();

      if (reviewerId === portfolio.userId) {
        throw new Error("You cannot review your own portfolio.");
      }

      setActionLoading((current) => ({
        ...current,
        [`like-${portfolio.portfolioId}`]: true,
      }));

      const response = await fetch(`${API_URL}/review/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          portfolioId: portfolio.portfolioId,
          userId: portfolio.userId,
          reviewerId,
          value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save like.");
      }

      await loadReviews(portfolio.portfolioId);
    } catch (err) {
      alert(err.message || "Could not save like.");
    } finally {
      setActionLoading((current) => ({
        ...current,
        [`like-${portfolio.portfolioId}`]: false,
      }));
    }
  }

  async function saveRating(portfolio, rating) {
    try {
      const { token, reviewerId } = getLoggedInUser();

      if (reviewerId === portfolio.userId) {
        throw new Error("You cannot review your own portfolio.");
      }

      setActionLoading((current) => ({
        ...current,
        [`rating-${portfolio.portfolioId}`]: true,
      }));

      const response = await fetch(`${API_URL}/review/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          portfolioId: portfolio.portfolioId,
          userId: portfolio.userId,
          reviewerId,
          value: rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save rating.");
      }

      await loadReviews(portfolio.portfolioId);
    } catch (err) {
      alert(err.message || "Could not save rating.");
    } finally {
      setActionLoading((current) => ({
        ...current,
        [`rating-${portfolio.portfolioId}`]: false,
      }));
    }
  }

  async function saveComment(portfolio) {
    const text = String(commentText[portfolio.portfolioId] || "").trim();

    if (!text) {
      alert("Please enter a comment.");
      return;
    }

    try {
      const { token, reviewerId } = getLoggedInUser();

      if (reviewerId === portfolio.userId) {
        throw new Error("You cannot review your own portfolio.");
      }

      setActionLoading((current) => ({
        ...current,
        [`comment-${portfolio.portfolioId}`]: true,
      }));

      const response = await fetch(`${API_URL}/review/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          portfolioId: portfolio.portfolioId,
          userId: portfolio.userId,
          reviewerId,
          value: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add comment.");
      }

      setCommentText((current) => ({
        ...current,
        [portfolio.portfolioId]: "",
      }));

      await loadReviews(portfolio.portfolioId);
    } catch (err) {
      alert(err.message || "Could not add comment.");
    } finally {
      setActionLoading((current) => ({
        ...current,
        [`comment-${portfolio.portfolioId}`]: false,
      }));
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
      <h1 style={{ textAlign: "center" }}>Shared Portfolios</h1>

      {portfolios.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No portfolios are available in this shared link.
        </p>
      ) : (
        portfolios.map((portfolio) => {
          const review = reviewsByPortfolio[portfolio.portfolioId] || {
            likedCount: 0,
            averageRating: 0,
            ratingCount: 0,
            comments: [],
          };

          const isOwnPortfolio = currentUserId === portfolio.userId;

          return (
            <div key={portfolio.portfolioId}>
              {renderPortfolioTemplate(portfolio)}

              <section className="portfolio-review-section">
                <div className="review-card like-card">
                  <div className="review-icon">♥</div>

                  <div className="review-content">
                    <h3>Likes</h3>
                    <p>{review.likedCount || 0} likes</p>

                    {isOwnPortfolio && (
                      <p className="own-portfolio-message">
                        You cannot review your own portfolio.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="like-button"
                    onClick={() => saveLike(portfolio, "liked")}
                    disabled={
                      isOwnPortfolio ||
                      actionLoading[`like-${portfolio.portfolioId}`]
                    }
                  >
                    ♥ Like
                  </button>
                </div>

                <div className="review-card rating-card">
                  <div className="rating-info">
                    <h3>Rating</h3>
                    <p>
                      <strong>{review.averageRating || 0}</strong> / 5
                    </p>
                    <span>({review.ratingCount || 0} ratings)</span>
                  </div>

                  <div className="rating-actions">
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="star-button"
                          onClick={() => saveRating(portfolio, star)}
                          disabled={
                            isOwnPortfolio ||
                            actionLoading[
                              `rating-${portfolio.portfolioId}`
                            ]
                          }
                          title={`Give ${star} star`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <p className="rating-help-text">
                      {isOwnPortfolio
                        ? "You cannot rate your own portfolio"
                        : "Click a star to rate"}
                    </p>
                  </div>
                </div>

                <div className="review-card comments-card">
                  <h3>Comments ({review.comments?.length || 0})</h3>

                  <div className="comment-form">
                    <textarea
                      rows="3"
                      value={commentText[portfolio.portfolioId] || ""}
                      onChange={(event) =>
                        setCommentText((current) => ({
                          ...current,
                          [portfolio.portfolioId]: event.target.value,
                        }))
                      }
                      placeholder={
                        isOwnPortfolio
                          ? "You cannot comment on your own portfolio."
                          : "Write a comment..."
                      }
                      disabled={isOwnPortfolio}
                    />

                    <button
                      type="button"
                      className="comment-submit-button"
                      onClick={() => saveComment(portfolio)}
                      disabled={
                        isOwnPortfolio ||
                        actionLoading[
                          `comment-${portfolio.portfolioId}`
                        ]
                      }
                    >
                      {actionLoading[`comment-${portfolio.portfolioId}`]
                        ? "Posting..."
                        : "Post Comment"}
                    </button>
                  </div>

                  <div className="comments-list">
                    {review.comments?.length ? (
                      review.comments.map((comment, index) => (
                        <div
                          className="single-comment"
                          key={comment.reviewKey || index}
                        >
                          <div className="comment-avatar">
                            {String(comment.reviewerId || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <p>{comment.value}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments yet.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          );
        })
      )}
    </main>
  );
}

export default SharedPortfolios;