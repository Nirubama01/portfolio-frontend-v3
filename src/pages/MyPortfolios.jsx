import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassicTemplate from "../templates/ClassicTemplate";
import DarkTemplate from "../templates/DarkTemplate";
import ResumeTemplate from "../templates/ResumeTemplate";
import DeveloperTemplate from "../templates/DeveloperTemplate";

function MyPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            portfolioId,
          }),
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
          style={{ marginBottom: "20px" }}
        >
          {portfolio.template === "dark" ? (
  <DarkTemplate portfolio={portfolio} />
) : portfolio.template === "resume" ? (
  <ResumeTemplate portfolio={portfolio} />
) : portfolio.template === "developer" ? (
  <DeveloperTemplate portfolio={portfolio} />
) : (
  <ClassicTemplate portfolio={portfolio} />
)}

          <button
            onClick={() =>
              navigate(
                "/edit-portfolio",
                { state: portfolio }
              )
            }
          >
            Edit
          </button>

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
        </div>
      ))}
    </div>
  );
}

export default MyPortfolios;