function ResumeTemplate({ portfolio }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        margin: "10px",
        padding: "20px",
        minHeight: "100px",
        borderRadius: "10px"
      }}
    >
      {/* Left Side - Image */}
      <div
        style={{
          width: "250px",
          textAlign: "center"
        }}
      >
        {portfolio.images &&
          portfolio.images.length > 0 && (
            <img
              src={portfolio.images[0]}
              alt="Portfolio"
              width="200"
              style={{
                borderRadius: "10px"
              }}
            />
          )}
      </div>

      {/* Right Side - Details */}
      <div
        style={{
          flex: 1,
          paddingLeft: "30px"
        }}
      >
        <p>
          <strong>Title:</strong>{" "}
          {portfolio.title}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {portfolio.description}
        </p>

        <p>
          <strong>Language:</strong>{" "}
          {portfolio.language}
        </p>

        <p>
          <strong>Tools:</strong>{" "}
          {portfolio.tools?.join(", ")}
        </p>
      </div>
    </div>
  );
}

export default ResumeTemplate;