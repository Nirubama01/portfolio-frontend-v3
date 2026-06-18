import { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    fetch(
      "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio/users"
    )
      .then((res) => res.json())
      .then((data) => {
        const usersData = JSON.parse(data.body);
        setUsers(usersData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
  fetch(
    "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio/all"
  )
    .then((res) => res.json())
    .then((data) => {
      const portfolioData =
        JSON.parse(data.body);

      console.log(
        "PORTFOLIOS:",
        portfolioData
      );

      setPortfolios(
        portfolioData
      );
    })
    .catch((err) =>
      console.error(err)
    );
}, []);

const deletePortfolio = async (
  userId,
  portfolioId
) => {
  try {
    await fetch(
      "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          portfolioId
        })
      }
    );

    alert("Portfolio Deleted");

    loadPortfolios();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h2>All Users</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Id</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>All Portfolios</h2>

<table border="1" cellPadding="10">
  <thead>
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>Language</th>
      <th>User Id</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
  {portfolios.map((portfolio) => (
    <tr key={portfolio.portfolioId}>
      <td>{portfolio.title}</td>
      <td>{portfolio.description}</td>
      <td>{portfolio.language}</td>
      <td>{portfolio.userId}</td>

      <td>
        <button
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
    </div>
  );
}

export default AdminDashboard;