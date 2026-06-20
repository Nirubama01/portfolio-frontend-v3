import { useEffect, useState } from "react";

const API_URL =
  "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  

  

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [usersResponse, portfoliosResponse] =
          await Promise.all([
            fetch(`${API_URL}/users`),
            fetch(`${API_URL}/all`),
          ]);

        const usersResult = await usersResponse.json();
        const portfoliosResult =
          await portfoliosResponse.json();

        const usersData =
          typeof usersResult.body === "string"
            ? JSON.parse(usersResult.body)
            : usersResult.body;

        const portfoliosData =
          typeof portfoliosResult.body === "string"
            ? JSON.parse(portfoliosResult.body)
            : portfoliosResult.body;

        setUsers(
          Array.isArray(usersData) ? usersData : []
        );

        setPortfolios(
          Array.isArray(portfoliosData)
            ? portfoliosData
            : []
        );
      } catch (error) {
        console.error(error);
        setUsers([]);
        setPortfolios([]);
      } finally {
        setLoadingUsers(false);
        setLoadingPortfolios(false);
      }
    };

    // Start the API request after this effect finishes.
    Promise.resolve().then(loadAdminData);
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
        },
        body: JSON.stringify({
          userId,
          portfolioId,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not delete portfolio");
      }

      setPortfolios((currentPortfolios) =>
        currentPortfolios.filter(
          (portfolio) =>
            portfolio.portfolioId !== portfolioId
        )
      );

      alert("Portfolio deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not delete the portfolio.");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not delete user");
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.userId !== userId
        )
      );

      // Also remove that user's portfolios from the displayed list.
      setPortfolios((currentPortfolios) =>
        currentPortfolios.filter(
          (portfolio) => portfolio.userId !== userId
        )
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not delete the user.");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>

          <h1>Admin Dashboard</h1>

          <p>
            Manage registered users and review every portfolio
            created in the system.
          </p>
        </div>
      </section>

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

          <span className="admin-count">
            {users.length} users
          </span>
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td className="admin-id">
                      {user.userId}
                    </td>
                    <td>
                      <button
                        className="admin-delete-button"
                        onClick={() =>
                          deleteUser(user.userId)
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
            <p className="admin-loading">
              Loading portfolios...
            </p>
          ) : portfolios.length === 0 ? (
            <p className="admin-loading">
              No portfolios found.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Language</th>
                  <th>User ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {portfolios.map((portfolio) => (
                  <tr key={portfolio.portfolioId}>
                    <td>{portfolio.title || "Untitled"}</td>

                    <td className="admin-description">
                      {portfolio.description || "—"}
                    </td>

                    <td>{portfolio.language || "—"}</td>

                    <td className="admin-id">
                      {portfolio.userId}
                    </td>

                    <td>
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