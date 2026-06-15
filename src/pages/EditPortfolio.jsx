import { useLocation } from "react-router-dom";
import { useState } from "react";

function EditPortfolio() {

  const location = useLocation();

  const portfolio = location.state;

  const [title, setTitle] =
    useState(portfolio.title);

  const [description, setDescription] =
    useState(portfolio.description);

  const [language, setLanguage] =
    useState(portfolio.language);

    const updatePortfolio = async () => {

  try {

    await fetch(
      "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio",
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          userId: portfolio.userId,
          portfolioId: portfolio.portfolioId,
          title,
          description,
          language,
          tools: portfolio.tools
        })
      }
    );

    alert("Portfolio Updated");

  } catch (error) {

    console.error(error);

  }
};

  return (
    <div>

      <h1>Edit Portfolio</h1>

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br /><br />

      <textarea
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <br /><br />

      <input
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
      />

      <br /><br />

<button onClick={updatePortfolio}>
  Update Portfolio
</button>

    </div>
  );
}

export default EditPortfolio;