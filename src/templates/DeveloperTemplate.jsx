function DeveloperTemplate({ portfolio }) {
  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        color: "white",
        padding: "40px",
        borderRadius: "15px",
        margin: "10px",
        textAlign: "center",
        minHeight: "500px"
      }}
    >
      {/* Profile Image */}
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
              border: "4px solid #30363d",
              marginBottom: "20px"
            }}
          />
        )}

      {/* Portfolio Title */}
      <h1
        style={{
          color: "white",
          marginBottom: "25px"
        }}
      >
        {portfolio.title}
      </h1>

      {/* Language */}
      <div
        style={{
          marginBottom: "25px"
        }}
      >
        <h2>Language</h2>

        <p
          style={{
            fontSize: "20px"
          }}
        >
          {portfolio.language}
        </p>
      </div>

      {/* Tools */}
      <div
        style={{
          marginBottom: "30px"
        }}
      >
        <h2>Skills</h2>

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
                backgroundColor: "#21262d",
                padding: "10px 18px",
                borderRadius: "20px",
                fontSize: "14px"
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* About Me */}
      <div>
        <h2>About Me</h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.8",
            fontSize: "16px"
          }}
        >
          {portfolio.description}
        </p>
      </div>
    </div>
  );
}

export default DeveloperTemplate;