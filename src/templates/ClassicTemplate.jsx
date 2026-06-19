function ClassicTemplate({ portfolio }) {

  return (
    <div
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
    </div>
  );
}

export default ClassicTemplate;