function ModernTemplate({ portfolio }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        margin: "10px",
        textAlign: "center"
      }}
    >
      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Profile"
            width="180"
            height="180"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "20px"
            }}
          />
        )}

      <h1>{portfolio.title}</h1>

      <h3
        style={{
          color: "#666"
        }}
      >
        {portfolio.language}
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          margin: "20px 0"
        }}
      >
        {portfolio.tools?.map((tool) => (
          <span
            key={tool}
            style={{
              background: "#f0f0f0",
              padding: "10px 15px",
              borderRadius: "20px"
            }}
          >
            {tool}
          </span>
        ))}
      </div>

      <p
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.8"
        }}
      >
        {portfolio.description}
      </p>
    </div>
  );
}

export default ModernTemplate;