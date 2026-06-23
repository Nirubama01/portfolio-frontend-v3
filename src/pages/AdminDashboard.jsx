import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const API_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);
  const [error, setError] = useState("");

  function getHeaders() {
    const idToken = localStorage.getItem("id_token");

    if (!idToken) {
      throw new Error("You are not logged in.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: idToken,
    };
  }

  async function readApiResponse(response) {
    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    /*
      This handles the old non-proxy API Gateway response format too:
      { statusCode: 403, body: "{\"message\":\"...\"}" }
    */
    if (data?.statusCode && typeof data.body === "string") {
      try {
        const innerBody = JSON.parse(data.body);

        if (data.statusCode >= 400) {
          throw new Error(innerBody.message || "Admin API request failed.");
        }

        data = innerBody;
      } catch (parseError) {
        if (data.statusCode >= 400) {
          throw parseError;
        }
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  }

  useEffect(() => {
    async function loadAdminData() {
      try {
        setError("");

        const headers = getHeaders();

        const [usersResponse, portfoliosResponse] = await Promise.all([
          fetch(`${API_URL}/users`, { headers }),
          fetch(`${API_URL}/all`, { headers }),
        ]);

        const [usersData, portfoliosData] = await Promise.all([
          readApiResponse(usersResponse),
          readApiResponse(portfoliosResponse),
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setPortfolios(Array.isArray(portfoliosData) ? portfoliosData : []);
      } catch (err) {
        console.error("Could not load admin data:", err);
        setError(err.message || "Could not load admin data.");
        setUsers([]);
        setPortfolios([]);
      } finally {
        setLoadingUsers(false);
        setLoadingPortfolios(false);
      }
    }

    loadAdminData();
  }, []);

  const deletePortfolio = async (userId, portfolioId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          userId,
          portfolioId,
        }),
      });

      await readApiResponse(response);

      setPortfolios((currentPortfolios) =>
        currentPortfolios.filter(
          (portfolio) => portfolio.portfolioId !== portfolioId
        )
      );

      alert("Portfolio deleted successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete the portfolio.");
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          userId,
        }),
      });

      await readApiResponse(response);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.userId !== userId)
      );

      setPortfolios((currentPortfolios) =>
        currentPortfolios.filter((portfolio) => portfolio.userId !== userId)
      );

      alert("User deleted successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete the user.");
    }
  };
  const toggleChatbotAccess = async (userId, currentStatus) => {
  const nextStatus = !currentStatus;

  const confirmed = window.confirm(
    nextStatus
      ? "Enable chatbot access for this user?"
      : "Disable chatbot access for this user?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_URL}/users/chatbot-access`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          userId,
          chatbotEnabled: nextStatus,
        }),
      }
    );

    const data = await readApiResponse(response);

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.userId === userId
          ? { ...user, chatbotEnabled: data.chatbotEnabled }
          : user
      )
    );

    alert(data.message);
  } catch (err) {
    console.error(err);
    alert(err.message || "Could not update chatbot access.");
  }
};

  return (
    <main className="admin-page">
      <BackButton />

      <section className="admin-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p>
            Manage registered users and review every portfolio created in the
            system.
          </p>
        </div>
      </section>

      {error && <p className="settings-message settings-error">{error}</p>}

      <section className="admin-stats">
        <article className="admin-stat-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
          <small>Registered accounts</small>
        </article>

        <article className="admin-stat-card">
          <span>Total Portfolios</span>
          <strong>{portfolios.length}</strong>
          <small>Projects in the system</small>
        </article>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>All Users</h2>
            <p>Registered users in your application.</p>
          </div>

          <span className="admin-count">{users.length} users</span>
        </div>

        <div className="admin-table-wrapper">
          {loadingUsers ? (
            <p className="admin-loading">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="admin-loading">No users found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User ID</th>
                  <th>Chatbot Access</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td className="admin-id">{user.userId}</td>

<td>
  <button
    className={
      user.chatbotEnabled
        ? "admin-chatbot-disable-button"
        : "admin-chatbot-enable-button"
    }
    onClick={() =>
      toggleChatbotAccess(user.userId, Boolean(user.chatbotEnabled))
    }
  >
    {user.chatbotEnabled ? "Disable Chatbot" : "Enable Chatbot"}
  </button>
</td>

<td>
  <button
    className="admin-delete-button"
    onClick={() => deleteUser(user.userId)}
  >
    Delete
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>All Portfolios</h2>
            <p>Every portfolio created by all users.</p>
          </div>

          <span className="admin-count">
            {portfolios.length} portfolios
          </span>
        </div>

        <div className="admin-table-wrapper">
          {loadingPortfolios ? (
            <p className="admin-loading">Loading portfolios...</p>
          ) : portfolios.length === 0 ? (
            <p className="admin-loading">No portfolios found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Language</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {portfolios.map((portfolio) => (
                  <tr key={`${portfolio.userId}-${portfolio.portfolioId}`}>
                    <td>{portfolio.title || "Untitled"}</td>

                    <td className="admin-description">
                      {portfolio.description || "—"}
                    </td>

                    <td>{portfolio.language || "—"}</td>

                    <td className="admin-id">{portfolio.userId}</td>

                    <td className="admin-actions">
                      <button
  className="admin-view-button"
  onClick={() =>
    navigate(
      `/admin/portfolio?userId=${encodeURIComponent(
        portfolio.userId
      )}&portfolioId=${encodeURIComponent(
        portfolio.portfolioId
      )}`
    )
  }
  title="Preview this portfolio"
>
  <span className="admin-action-icon">◉</span>
  Preview
</button>

                      <button
                        className="admin-delete-button"
                        onClick={() =>
                          deletePortfolio(
                            portfolio.userId,
                            portfolio.portfolioId
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;