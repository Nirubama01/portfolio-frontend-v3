function DarkTemplate({ portfolio }) {
  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        padding: "20px",
        margin: "10px",
        borderRadius: "10px"
      }}
    >
      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Portfolio"
            width="250"
            style={{
              borderRadius: "10px"
            }}
          />
        )}

      <p>
        <strong>Title:</strong>{" "}
        {portfolio.title}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {portfolio.description}
      </p>

      <p>
        <strong>Language:</strong>{" "}
        {portfolio.language}
      </p>

      <p>
        <strong>Tools:</strong>{" "}
        {portfolio.tools?.join(", ")}
      </p>
    </div>
  );
}

export default DarkTemplate;