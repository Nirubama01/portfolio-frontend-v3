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
    marginBottom: "20px",
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}
      ><p>
        <strong>Tools</strong>{" "}
        {portfolio.tools}
      </p>
      </div>

       <h2
        style={{
          marginTop: "30px",
          color:"white"
        }}
      >
        Description
      </h2>

      <p>{portfolio.description}</p>
    </div>
  );
}

export default DeveloperTemplate;