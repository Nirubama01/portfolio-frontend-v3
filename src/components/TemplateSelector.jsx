function TemplateSelector({
  template,
  setTemplate,
  themeType,
  currentIndex,
  setCurrentIndex
}) {
  const cardStyle = (value) => ({
  width: "320px",
  height: "350px",
  padding: "15px",
  cursor: "pointer",
  border:
    template === value
      ? "3px solid blue"
      : "1px solid gray",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  overflow: "hidden"
});

  const isLight = themeType === "light";

  const templates = isLight
    ? ["classic", "resume", "modern", "showcase"]
    : ["dark", "developer", "neon", "terminal"];

  const currentTemplate =
    templates[currentIndex] || templates[0];

  const nextTemplate = () => {
    const next =
      (currentIndex + 1) % templates.length;

    setCurrentIndex(next);
    setTemplate(templates[next]);
  };

  const prevTemplate = () => {
    const prev =
      currentIndex === 0
        ? templates.length - 1
        : currentIndex - 1;

    setCurrentIndex(prev);
    setTemplate(templates[prev]);
  };

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
          alignItems: "center",
          gap: "20px"
        }}
      >
        <button
          onClick={prevTemplate}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: "20px"
          }}
        >
          ◀
        </button>

        <div
          style={{
            minWidth: "320px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {/* Classic */}
          {currentTemplate === "classic" && (
            <div
              onClick={() => setTemplate("classic")}
              style={cardStyle("classic")}
            >
              <h4>Classic Template</h4>

              <img
                src="https://placehold.co/220x120"
                alt="preview"
                width="280"
              />

              <h4>Portfolio Title</h4>

              <p>
                <strong>Language:</strong> React
              </p>

              <p>Description...</p>
            </div>
          )}

          {/* Resume */}
          {currentTemplate === "resume" && (
            <div
              onClick={() => setTemplate("resume")}
              style={cardStyle("resume")}
            >
              <h4>Resume Template</h4>

              <div
                style={{
                  display: "flex",
                  height: "150px"
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
          )}

          {/* Modern */}
          {currentTemplate === "modern" && (
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
                  width: "100px",
                  height: "100px",
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
          )}

          {/* Showcase */}
          {currentTemplate === "showcase" && (
            <div
              onClick={() => setTemplate("showcase")}
              style={cardStyle("showcase")}
            >
              <h4>Showcase Template</h4>
              <div
                style={{
                  height: "150px",
                  background: "#ddd"
                }}
              />

              <div
                style={{
                  padding: "10px"
                }}
              >
                

                <p>Banner Portfolio</p>
              </div>
            </div>
          )}

          {/* Dark */}
          {currentTemplate === "dark" && (
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
          )}

          {/* Developer */}
          {currentTemplate === "developer" && (
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
                  width: "100px",
                  height: "100px",
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
          )}

          {/* Neon */}
          {currentTemplate === "neon" && (
            <div
              onClick={() => setTemplate("neon")}
              style={{
                ...cardStyle("neon"),
                background: "#0a0a0a",
                color: "#00ffff",
                boxShadow: "0 0 10px #00ffff"
              }}
            >
              <h4>Neon Template</h4>

              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "2px solid #00ffff",
                  background: "#222",
                  margin: "10px auto"
                }}
              />

              <h4>Portfolio Title</h4>

              <p>
                <strong>Language:</strong> Java
              </p>

              <p>[AWS] [React]</p>
            </div>
          )}

          {/* Terminal */}
          {currentTemplate === "terminal" && (
            <div
              onClick={() => setTemplate("terminal")}
              style={{
                ...cardStyle("terminal"),
                background: "#000",
                color: "#00ff00",
                fontFamily: "monospace"
              }}
            >
              <h4>Terminal Template</h4>

              <div
                style={{
                  width: "100px",
                  height: "100px",
                  border: "2px solid #00ff00",
                  background: "#111",
                  margin: "10px auto"
                }}
              />

              <p>&gt; whoami</p>

              <p>Portfolio Title</p>

              <p>&gt; skills</p>

              <p>AWS React</p>
            </div>
          )}
        </div>

        <button
          onClick={nextTemplate}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: "20px"
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

export default TemplateSelector;