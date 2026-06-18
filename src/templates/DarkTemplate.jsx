function DarkTemplate({ portfolio }) {
  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        padding: "20px",
        margin: "10px",
        borderRadius: "10px",
      }}
    >
      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Portfolio"
            width="250"
            style={{
              borderRadius: "10px",
            }}
          />
        )}

      <h1>{portfolio.title}</h1>

      <h3>{portfolio.language}</h3>

      <p>{portfolio.description}</p>

      <div>
        {portfolio.tools?.map((tool) => (
          <span
            key={tool}
            style={{
              padding: "5px 10px",
              marginRight: "5px",
              background: "#333",
              borderRadius: "20px",
            }}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DarkTemplate;