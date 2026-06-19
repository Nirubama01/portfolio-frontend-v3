function TemplateSelector({
  template,
  setTemplate
}) {
  const cardStyle = (value) => ({
    width: "250px",
    padding: "10px",
    cursor: "pointer",
    border:
      template === value
        ? "3px solid blue"
        : "1px solid gray",
    borderRadius: "10px"
  });

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
        {/* Classic */}
        <div
          onClick={() => setTemplate("classic")}
          style={cardStyle("classic")}
        >
          <h4>Classic Template</h4>

          <img
            src="https://placehold.co/220x120"
            alt="preview"
            width="220"
          />

          <h4>Portfolio Title</h4>

          <p>
            <strong>Language:</strong> React
          </p>

          <p>Description...</p>
        </div>

        {/* Resume */}
        <div
          onClick={() => setTemplate("resume")}
          style={cardStyle("resume")}
        >
          <h4>Resume Template</h4>

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
        </div>

        {/* Modern */}
        <div
          onClick={() => setTemplate("modern")}
          style={{
            ...cardStyle("modern"),
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.15)"
          }}
        >
          <h4>Modern Template</h4>

          <h4>Portfolio Title</h4>

          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#ddd",
              margin: "0 auto"
            }}
          />

          <p>Java</p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <span>AWS</span>
            <span>React</span>
          </div>
        </div>

        {/* Showcase */}
        <div
          onClick={() => setTemplate("showcase")}
          style={cardStyle("showcase")}
        >
          <div
            style={{
              height: "120px",
              background: "#ddd"
            }}
          />

          <div
            style={{
              padding: "10px"
            }}
          >
            <h4>Showcase Template</h4>

            <p>Banner Portfolio</p>
          </div>
        </div>

        {/* Dark */}
        <div
          onClick={() => setTemplate("dark")}
          style={{
            ...cardStyle("dark"),
            background: "#111",
            color: "white"
          }}
        >
          <h4>Dark Template</h4>

          <div
            style={{
              height: "120px",
              background: "#333"
            }}
          />

          <h4>Portfolio Title</h4>

          <p>
            <strong>Language:</strong> React
          </p>

          <p>Description...</p>
        </div>

        {/* Developer */}
        <div
          onClick={() => setTemplate("developer")}
          style={{
            ...cardStyle("developer"),
            background: "#0d1117",
            color: "white"
          }}
        >
          <h4>Developer Template</h4>

          <h4>Portfolio Title</h4>

          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#444",
              margin: "0 auto"
            }}
          />

          <p>
            <strong>Language:</strong> Java
          </p>

          <p>Description...</p>
        </div>

        {/* Neon */}
        <div
          onClick={() => setTemplate("neon")}
          style={{
            ...cardStyle("neon"),
            background: "#0a0a0a",
            color: "#00ffff",
            boxShadow:
              "0 0 10px #00ffff"
          }}
        >
          <h4>Neon Template</h4>

          <p>AWS Engineer</p>

          <p>[AWS] [React]</p>
        </div>

        {/* Terminal */}
        <div
          onClick={() => setTemplate("terminal")}
          style={{
            ...cardStyle("terminal"),
            background: "#000",
            color: "#00ff00",
            fontFamily: "monospace"
          }}
        >
          <p>&gt; whoami</p>

          <p>AWS Engineer</p>

          <p>&gt; skills</p>

          <p>AWS React</p>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;