function ResumeTemplate({ portfolio }) {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #ccc",
        margin: "10px",
        minHeight: "300px"
      }}
    >
      <div
        style={{
          width: "250px",
          background: "#f4f4f4",
          padding: "20px"
        }}
      >
        {portfolio.images &&
          portfolio.images.length > 0 && (
            <img
              src={portfolio.images[0]}
              alt="Portfolio"
              width="180"
            />
          )}

        <h3>Skills</h3>

        {portfolio.tools?.map((tool) => (
          <p key={tool}>{tool}</p>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px"
        }}
      >
        <h1>{portfolio.title}</h1>

        <h3>{portfolio.language}</h3>

        <p>{portfolio.description}</p>
      </div>
    </div>
  );
}

export default ResumeTemplate;