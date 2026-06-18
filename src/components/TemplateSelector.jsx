function TemplateSelector({
  template,
  setTemplate
}) {
  return (
    <div>
      <h3>Choose Template</h3>

      <div
        style={{
          display: "flex",
          gap: "20px"
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
      </div>
    </div>
  );
}

export default TemplateSelector;