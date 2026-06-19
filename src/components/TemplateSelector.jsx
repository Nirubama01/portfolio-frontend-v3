function TemplateSelector({
  template,
  setTemplate
}) {
  return (
    <div>
      <h3
  style={{
    textAlign: "center",
    marginBottom: "20px"
  }}
>
  Choose Template
</h3>

      <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  }}
>
        {/* Classic Preview */}

        <div
          onClick={() =>
            setTemplate("classic")
          }
          style={{
            width: "250px",
            border:
              template === "classic"
                ? "3px solid blue"
                : "1px solid gray",
            padding: "10px",
            cursor: "pointer"
          }}
        >
          <img
            src="https://placehold.co/220x120"
            alt="preview"
            width="220"
          />

          <h4>Portfolio Title</h4>

          <p>
            <strong>Language:</strong>
            React
          </p>

          <p>
            Description...
          </p>
        </div>
        <div
  onClick={() => setTemplate("dark")}
  style={{
    width: "250px",
    backgroundColor: "#111",
    color: "white",
    border:
      template === "dark"
        ? "3px solid blue"
        : "1px solid gray",
    padding: "10px",
    cursor: "pointer"
  }}
>
  <div
    style={{
      height: "120px",
      background: "#333"
    }}
  />

  <h4>Portfolio Title</h4>

  <p>
    <strong>Language:</strong>
    React
  </p>

  <p>Description...</p>
</div>
<div
  onClick={() => setTemplate("resume")}
  style={{
    width: "250px",
    border:
      template === "resume"
        ? "3px solid blue"
        : "1px solid gray",
    padding: "10px",
    cursor: "pointer"
  }}
>
  <div
    style={{
      display: "flex",
      height: "120px"
    }}
  >
    <div
      style={{
        width: "40%",
        background: "#ddd"
      }}
    />

    <div
      style={{
        flex: 1,
        padding: "5px"
      }}
    >
      <div>Title</div>
      <div>Description</div>
      <div>Language</div>
    </div>
  </div>

  <h4>Resume Template</h4>
</div>
      </div>
    </div>
  );
}

export default TemplateSelector;