import { useState } from "react";
import TemplateSelector from "../components/TemplateSelector";

function CreatePortfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themeType, setThemeType] = useState("light");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [tools, setTools] = useState("");
  const [template, setTemplate] = useState("classic");
  const [image, setImage] = useState(null);

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

  return (
    <main className="create-page">
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
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
            />
          </label>

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