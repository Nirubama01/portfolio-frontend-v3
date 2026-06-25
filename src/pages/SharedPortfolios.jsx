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
          throw new Error(
            data.message || "Could not load shared portfolios."
          );
        }

        const sharedPortfolios = Array.isArray(data.portfolios)
          ? data.portfolios
          : [];

        setPortfolios(sharedPortfolios);

        const reviewResults = await Promise.all(
          sharedPortfolios.map(async (portfolio) => {
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
          })
        );

        const reviewMap = {};

        reviewResults.forEach(({ portfolioId, review }) => {
          reviewMap[portfolioId] = review;
        });

        setReviewsByPortfolio(reviewMap);
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
    const reviewerId = localStorage.getItem("userId");

    if (!token || !reviewerId) {
      throw new Error("Please log in to like, rate, or comment.");
    }

    return { token, reviewerId };
  }

  async function saveLike(portfolio, value) {
    try {
      const { token, reviewerId } = getLoggedInUser();

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

          return (
            <div key={portfolio.portfolioId}>
              {renderPortfolioTemplate(portfolio)}

              <section
                style={{
                  maxWidth: "700px",
                  margin: "0 auto 30px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  background: "#ffffff",
                }}
              >
                <h3>Reviews</h3>

                <p>
                  ❤️ Likes: <strong>{review.likedCount || 0}</strong>
                </p>

                <p>
                  ⭐ Average rating:{" "}
                  <strong>
                    {review.averageRating || 0} / 5
                  </strong>{" "}
                  ({review.ratingCount || 0} ratings)
                </p>

                <div style={{ marginBottom: "18px" }}>
                  <p>Do you like this portfolio?</p>

                  <button
                    type="button"
                    onClick={() => saveLike(portfolio, "liked")}
                    disabled={
                      actionLoading[`like-${portfolio.portfolioId}`]
                    }
                    style={{ marginRight: "10px" }}
                  >
                    ❤️ Like
                  </button>

                  <button
                    type="button"
                    onClick={() => saveLike(portfolio, "unliked")}
                    disabled={
                      actionLoading[`like-${portfolio.portfolioId}`]
                    }
                  >
                    Remove Like
                  </button>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <p>Rate this portfolio:</p>

                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => saveRating(portfolio, star)}
                      disabled={
                        actionLoading[
                          `rating-${portfolio.portfolioId}`
                        ]
                      }
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "24px",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                      title={`${star} star`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <p>Add a comment:</p>

                  <textarea
                    rows="3"
                    value={commentText[portfolio.portfolioId] || ""}
                    onChange={(event) =>
                      setCommentText((current) => ({
                        ...current,
                        [portfolio.portfolioId]: event.target.value,
                      }))
                    }
                    placeholder="Write your comment here..."
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => saveComment(portfolio)}
                    disabled={
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

                <div>
                  <h4>Comments ({review.comments?.length || 0})</h4>

                  {review.comments?.length ? (
                    review.comments.map((comment, index) => (
                      <div
                        key={comment.reviewKey || index}
                        style={{
                          borderTop: "1px solid #eee",
                          padding: "10px 0",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {comment.value}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
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