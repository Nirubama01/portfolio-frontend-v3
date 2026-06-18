import { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

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
    </div>
  );
}

export default AdminDashboard;