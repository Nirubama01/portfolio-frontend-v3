function NeonTemplate({ portfolio }) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        color: "#00ffff",
        padding: "30px",
        borderRadius: "20px",
        margin: "20px auto",
        maxWidth: "600px",
        textAlign: "center",
        boxShadow:
          "0 0 20px #00ffff"
      }}
    >
      <h2 style={{color:"#00ffff"}}>{portfolio.title}</h2>

      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Profile"
            width="140"
            height="140"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border:
                "3px solid #00ffff"
            }}
          />
        )}

      <p>
        <strong>Language:</strong>{" "}
        {portfolio.language}
      </p>

      <h3>Tools</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        {portfolio.tools?.map((tool) => (
          <span
            key={tool}
            style={{
              border:
                "1px solid #00ffff",
              padding: "8px 12px",
              borderRadius: "20px"
            }}
          >
            {tool}
          </span>
        ))}
      </div>

      <h3>Description</h3>

      <p>{portfolio.description}</p>
    </div>
  );
}

export default NeonTemplate;