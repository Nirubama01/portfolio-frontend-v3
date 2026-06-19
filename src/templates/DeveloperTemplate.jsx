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
      <h1
  style={{
    color: "white",
    marginBottom: "20px"
    textAlign: "center"
  }}
>
  {portfolio.title}
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
        <h3>Tools</h3>
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