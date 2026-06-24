import { useEffect, useRef, useState } from "react";
import TemplateSelector from "../components/TemplateSelector";
import BackButton from "../components/BackButton";

function CreatePortfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeType, setThemeType] = useState("light");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [tools, setTools] = useState("");
  const [template, setTemplate] = useState("classic");
  const [image, setImage] = useState(null);
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
const [chatbotAccessLoading, setChatbotAccessLoading] = useState(true);
const [isAdmin, setIsAdmin] = useState(false);
const [descriptionSuggestion, setDescriptionSuggestion] = useState("");
const [descriptionChecking, setDescriptionChecking] = useState(false);
const [descriptionError, setDescriptionError] = useState("");
const descriptionTimerRef = useRef(null);

  const createPortfolio = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    try {
      const uploadResponse = await fetch(
        "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio/upload-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: image.name,
            contentType: image.type,
          }),
        }
      );

      const uploadData = await uploadResponse.json();

      await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": image.type,
        },
        body: image,
      });

      const response = await fetch(
        "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            title,
            description,
            language,
            template,
            tools: [tools],
            images: [uploadData.fileUrl],
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      alert("Portfolio Created");
    } catch (error) {
      console.error(error);
      alert("Could not create portfolio. Please try again.");
    }
  };
  function getIsAdminFromToken() {
  try {
    const token = localStorage.getItem("id_token");

    if (!token) return false;

    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    const groups = payload["cognito:groups"] || [];

    if (Array.isArray(groups)) {
      return groups.includes("Admin");
    }

    return String(groups)
      .split(",")
      .map((group) => group.trim())
      .includes("Admin");
  } catch (error) {
    console.error("Could not read admin group:", error);
    return false;
  }
}
  useEffect(() => {
  async function loadChatbotAccess() {
    const adminUser = getIsAdminFromToken();
setIsAdmin(adminUser);
    try {
      const response = await fetch(
        "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/settings",
        {
          headers: {
            Authorization: localStorage.getItem("id_token"),
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setChatbotEnabled(data.chatbotEnabled === true);
      }
    } catch (error) {
      console.error("Could not load chatbot access:", error);
      setChatbotEnabled(false);
    } finally {
      setChatbotAccessLoading(false);
    }
  }

  loadChatbotAccess();
}, []);

const checkDescriptionWithAI = async (text) => {
  const cleanText = text.trim();

  if (cleanText.length < 15) {
    setDescriptionSuggestion("");
    return;
  }

  try {
    setDescriptionChecking(true);
    setDescriptionError("");

    const response = await fetch(
      "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio/chatbot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("id_token"),
        },
        body: JSON.stringify({
          message:
            "Correct only grammar, spelling, punctuation, and clarity in this portfolio description. " +
            "Keep the same meaning. Return only the corrected description, without explanation:\n\n" +
            cleanText,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not check the description.");
    }

    const correctedText = (data.reply || "").trim();

    if (correctedText && correctedText !== cleanText) {
      setDescriptionSuggestion(correctedText);
    } else {
      setDescriptionSuggestion("");
    }
  } catch (error) {
    console.error("Description AI check error:", error);
    setDescriptionError("AI correction is temporarily unavailable.");
  } finally {
    setDescriptionChecking(false);
  }
};
  return (
    <main className="create-page">
      <BackButton />
      <section className="create-header">
        <p className="create-eyebrow">NEW PROJECT</p>
        <h1>Create Portfolio</h1>
        <p>
          Add your project details, choose a template, and publish it to your
          portfolio.
        </p>
      </section>

      <section className="create-layout">
        <div className="create-form-card">
          <h2>Project details</h2>
          <p className="form-help">
            Fill in the information visitors will see on your portfolio.
          </p>

          <div className="form-grid">
            <label className="form-field">
              <span>Project image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <small>{image ? image.name : "Choose an image for this project"}</small>
            </label>

            <label className="form-field">
              <span>Project title</span>
              <input
                placeholder="Example: E-commerce Website"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>

          <label className="form-field">
  <span>Description</span>

  <textarea
    placeholder="Tell visitors what this project does..."
    value={description}
    onChange={(e) => {
      const newDescription = e.target.value;

      setDescription(newDescription);
      setDescriptionSuggestion("");
      setDescriptionError("");

      if (!chatbotEnabled && !isAdmin) {
        return;
      }

      clearTimeout(descriptionTimerRef.current);

      descriptionTimerRef.current = setTimeout(() => {
        checkDescriptionWithAI(newDescription);
      }, 1500);
    }}
    rows="6"
  />

  {chatbotEnabled || !isAdmin  && (
    <small className="description-ai-status">
      {descriptionChecking
        ? "✨ AI is checking your description..."
        : "✨ AI checks grammar and clarity while you type."}
    </small>
  )}
</label>

{descriptionError && (
  <p className="description-ai-error">{descriptionError}</p>
)}

{descriptionSuggestion && (
  <section className="description-ai-suggestion">
    <div className="description-ai-suggestion-heading">
      <div>
        <p>✨ AI CORRECTION</p>
        <h3>Suggested improved description</h3>
      </div>

      <button
        type="button"
        onClick={() => {
          setDescriptionSuggestion("");
        }}
      >
        ×
      </button>
    </div>

    <p>{descriptionSuggestion}</p>

    <button
      type="button"
      className="description-ai-use-button"
      onClick={() => {
        setDescription(descriptionSuggestion);
        setDescriptionSuggestion("");
      }}
    >
      Use corrected description
    </button>
  </section>
)}
          {!chatbotAccessLoading && !chatbotEnabled && !isAdmin && (
  <section className="chatbot-locked-card">
    <div className="chatbot-blur-content">
      <div className="chatbot-demo-header">
        <span>✨ AI Description Assistant</span>
        <span className="chatbot-online-dot"></span>
      </div>

      <div className="chatbot-demo-message assistant">
        I will check spelling, grammar, and clarity as you type.
      </div>

      <div className="chatbot-demo-input">
        Type your project description...
      </div>
    </div>

    <div className="chatbot-lock-overlay">
      <div className="chatbot-lock-icon">🔒</div>
      <h3>AI Assistant is locked</h3>
      <p>Please contact the administrator for access.</p>
    </div>
  </section>
)}

          <div className="form-grid">
            <label className="form-field">
              <span>Language</span>
              <input
                placeholder="Example: React, JavaScript"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </label>

            <label className="form-field">
              <span>Tools</span>
              <input
                placeholder="Example: AWS, DynamoDB, S3"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="template-card">
          <div className="template-heading">
            <div>
              <h2>Choose a template</h2>
              <p className="form-help">Select how your project will be displayed.</p>
            </div>

            <div className="theme-switch">
              <button
                className={themeType === "light" ? "theme-button active" : "theme-button"}
                onClick={() => setThemeType("light")}
                type="button"
              >
                Light
              </button>

              <button
                className={themeType === "dark" ? "theme-button active" : "theme-button"}
                onClick={() => setThemeType("dark")}
                type="button"
              >
                Dark
              </button>
            </div>
          </div>

          <TemplateSelector
            template={template}
            setTemplate={setTemplate}
            themeType={themeType}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      </section>

      <div className="create-footer">
        <button className="publish-button" onClick={createPortfolio}>
          Create Portfolio
        </button>
      </div>
    </main>
  );
}

export default CreatePortfolio;