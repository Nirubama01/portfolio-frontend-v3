import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const API_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod";

function Social() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchUser = async (event) => {
    event.preventDefault();

    const cleanedUsername = username.trim().toLowerCase();

    if (!cleanedUsername) {
      setFoundUser(null);
      setMessage("Please enter a username.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setFoundUser(null);

      const response = await fetch(
        `${API_URL}/social/search?username=${encodeURIComponent(
          cleanedUsername
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "User not found.");
      }

      setFoundUser(data);
    } catch (error) {
      console.error("Social search error:", error);
      setMessage(error.message || "Could not search for this user.");
    } finally {
      setLoading(false);
    }
  };

  const openUserPortfolios = () => {
    if (!foundUser) return;

    navigate(`/social/${encodeURIComponent(foundUser.username)}`, {
      state: {
        userId: foundUser.userId,
        username: foundUser.username,
      },
    });
  };

  return (
    <main className="social-page">
      <BackButton />

      <section className="social-header">
        <p className="social-eyebrow">COMMUNITY</p>
        <h1>Find Portfolio Creators</h1>
        <p>
          Search for a username and explore that creator&apos;s portfolio
          projects.
        </p>
      </section>

      <section className="social-search-card">
        <h2>Search user</h2>
        <p>Enter the username chosen in the user profile.</p>

        <form className="social-search-form" onSubmit={searchUser}>
          <input
            type="text"
            value={username}
            placeholder="Example: nirubama"
            onChange={(event) => setUsername(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {message && <p className="social-message">{message}</p>}

        {foundUser && (
          <button
            type="button"
            className="social-user-result"
            onClick={openUserPortfolios}
          >
            <span className="social-user-avatar">
              {foundUser.username.charAt(0).toUpperCase()}
            </span>

            <span className="social-user-details">
              <strong>@{foundUser.username}</strong>
              <small>View portfolios and reviews</small>
            </span>

            <span className="social-arrow">→</span>
          </button>
        )}
      </section>
    </main>
  );
}

export default Social;