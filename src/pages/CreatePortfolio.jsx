import { useState } from "react";
import TemplateSelector from "../components/TemplateSelector";

function CreatePortfolio() {
  const [currentIndex, setCurrentIndex] =
  useState(0);
  const [themeType, setThemeType] =
  useState("light");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [language, setLanguage] =
    useState("");

  const [tools, setTools] =
    useState("");
    const [template, setTemplate] =
  useState("classic");

  const [image, setImage] =
  useState(null);
  console.log("Selected Image:", image);

  const createPortfolio = async () => {

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

const uploadData =
  await uploadResponse.json();

  await fetch(
  uploadData.uploadUrl,
  {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  }
);

console.log(uploadData);

    const response = await fetch(
      "https://x5xv9nqfag.execute-api.ap-south-1.amazonaws.com/prod/portfolio",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          userId:
            localStorage.getItem("userId"),

          title,
          description,
          language,
          template,

          tools: [
            tools
          ],
          images: [
  uploadData.fileUrl
],
        })
      }
    );

    const data =
      await response.json();

    console.log(data);

    alert(
      "Portfolio Created"
    );

  } catch (error) {

    console.error(error);

  }

};

  return (
    <div>

      <h1>Create Portfolio</h1>
      
      <br /><br />

<input
  type="file"
  onChange={(e) =>
    setImage(e.target.files[0])
  }
/>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br /><br />

      <textarea
  placeholder="Description"
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
  rows="6"
  style={{
    width: "100%",
    maxWidth: "1200px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical"
  }}
/>

      <br /><br />

      <input
        placeholder="Language"
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
      />

      <br /><br />

      <input
        placeholder="Tools"
        value={tools}
        onChange={(e) =>
          setTools(e.target.value)
        }
      />

      <br /><br />

<div
  style={{
    textAlign: "center",
    marginBottom: "20px"
  }}
>
  <button
    onClick={() =>
      setThemeType("light")
    }
  >
    Light Templates
  </button>

  <button
    onClick={() =>
      setThemeType("dark")
    }
    style={{
      marginLeft: "10px"
    }}
  >
    Dark Templates
  </button>
</div>

<TemplateSelector
  template={template}
  setTemplate={setTemplate}
  themeType={themeType}
  currentIndex={currentIndex}
  setCurrentIndex={setCurrentIndex}
/>
<br /><br />
<button
  onClick={createPortfolio}
>
  Create Portfolio
</button>

    </div>
  );
}

export default CreatePortfolio;