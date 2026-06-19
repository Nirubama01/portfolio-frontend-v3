function DeveloperTemplate({ portfolio }) {
  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        color: "white",
        padding: "25px",
        borderRadius: "10px",
        margin: "10px",
        textAlign: "center"
      }}
    >
      <h1>
        👨‍💻 Developer Profile
      </h1>

      {portfolio.images &&
        portfolio.images.length > 0 && (
        <img
              src={portfolio.images[0]}
              alt="Profile"
              width="200"
              style={{
                borderRadius: "50%",
                marginTop: "20px"
              }}
            />
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
          justifyContent: "center",
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

       <h2
        style={{
          marginTop: "30px"
        }}
      >
        About Me
      </h2>

      <p>{portfolio.description}</p>
    </div>
  );
}

export default DeveloperTemplate;