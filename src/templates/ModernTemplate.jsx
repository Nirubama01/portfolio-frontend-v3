function ModernTemplate({ portfolio }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        margin: "20px auto",
        textAlign: "center",
        maxWidth: "500px"
      }}
    >
      {/* Title */}
      <h2
        style={{
          marginBottom: "20px"
        }}
      >
        {portfolio.title}
      </h2>

      {/* Profile Image */}
      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Profile"
            width="120"
            height="120"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "20px"
            }}
          />
        )}

      {/* Language */}
      <p>
        <strong>Language:</strong>{" "}
        {portfolio.language}
      </p>

      {/* Tools */}
      <h3>Tools</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        {portfolio.tools?.map((tool) => (
          <span
            key={tool}
            style={{
              background: "#f0f0f0",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "14px"
            }}
          >
            {tool}
          </span>
        ))}
      </div>

      {/* About Me */}
      <h3>About Me</h3>

      <p
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          lineHeight: "1.6"
        }}
      >
        {portfolio.description}
      </p>
    </div>
  );
}

export default ModernTemplate;