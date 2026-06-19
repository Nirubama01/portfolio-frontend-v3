function ShowcaseTemplate({ portfolio }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        maxWidth: "700px",
        margin: "20px auto"
      }}
    >
      {/* Banner Image */}

      {portfolio.images &&
        portfolio.images.length > 0 && (
          <img
            src={portfolio.images[0]}
            alt="Banner"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover"
            }}
          />
        )}

      <div
        style={{
          padding: "25px"
        }}
      >
        <h2>{portfolio.title}</h2>

        <p>
          <strong>Language:</strong>{" "}
          {portfolio.language}
        </p>

        <h3>Tools</h3>

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
                background: "#f0f0f0",
                padding: "6px 12px",
                borderRadius: "15px"
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        <h3
          style={{
            marginTop: "20px"
          }}
        >
          About Me
        </h3>

        <p>{portfolio.description}</p>
      </div>
    </div>
  );
}

export default ShowcaseTemplate;