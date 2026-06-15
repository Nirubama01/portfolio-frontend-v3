import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function MyPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId =
  localStorage.getItem("userId");

fetch(
  `https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio?userId=${userId}`
)
      .then((response) => response.json())
      .then((data) => {
        setPortfolios(data);
      });
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

  } catch (error) {

    console.error(error);

  }
};

  return (
    <div>
      <h1>My Portfolios</h1>

      {portfolios.map((portfolio) => (
        <div
          key={portfolio.portfolioId}
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
          }}
        >
          {portfolio.images &&
 portfolio.images.length > 0 && (
  <img
    src={portfolio.images[0]}
    alt="Portfolio"
    width="200"
  />
)}
          <h2>{portfolio.title}</h2>
          

          <p>
            <strong>Language:</strong>{" "}
            {portfolio.language}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {portfolio.description}
          </p>

          <button
  onClick={() =>
    navigate("/edit-portfolio",{state:portfolio})
  }
>
  Edit
</button>

          <button onClick={() =>
    deletePortfolio(
      portfolio.userId,
      portfolio.portfolioId
    )
  }>
  Delete
</button>
        </div>
      ))}
    </div>
  );
}

export default MyPortfolios;