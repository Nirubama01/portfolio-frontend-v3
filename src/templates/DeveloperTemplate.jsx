function DeveloperTemplate({ portfolio }) {
  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        color: "white",
        padding: "25px",
        borderRadius: "10px",
        margin: "10px"
      }}
    >
      <h2
        style={{
          textAlign: "center"
        }}
      >
        👨‍💻 Developer Profile
      </h2>

      {portfolio.images &&
        portfolio.images.length > 0 && (
          <div
            style={{
              textAlign: "center"
            }}
          >
            <img
              src={portfolio.images[0]}
              alt="Profile"
              width="200"
              style={{
                borderRadius: "50%"
              }}
            />
          </div>
        )}

      <h2>{portfolio.title}</h2>

      <p>
        <strong>Language:</strong>{" "}
        {portfolio.language}
      </p>

      <h3>Skills</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        {portfolio.tools?.map((tool) => (
          <span
            key={tool}
            style={{
              background: "#21262d",
              padding: "8px",
              borderRadius: "5px"
            }}
          >
            {tool}
          </span>
        ))}
      </div>

      <h3>About Me</h3>

      <p>{portfolio.description}</p>
    </div>
  );
}

export default DeveloperTemplate;