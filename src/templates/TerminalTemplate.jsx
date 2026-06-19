function TerminalTemplate({ portfolio }) {
  return (
    <div
      style={{
        background: "#000",
        color: "#00ff00",
        padding: "30px",
        fontFamily: "monospace",
        borderRadius: "10px",
        maxWidth: "700px",
        margin: "20px auto"
      }}
    >
      <p>&gt; whoami</p>

      <h2 style={{color:"#00ff00"}}>{portfolio.title}</h2>

      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Profile"
            width="150"
            height="120"
            style={{
              objectFit: "cover",
              marginBottom: "20px"
            }}
          />
        )}

      <p>&gt; language</p>


      <p>{portfolio.language}</p>

      <p>&gt; tools</p>

      {portfolio.tools?.map((tool) => (
        <p key={tool}>
          {tool}
        </p>
      ))}

      <p>&gt; Description</p>

      <p>{portfolio.description}</p>
    </div>
  );
}

export default TerminalTemplate;