import React, { useState } from "react";
import VideoSubtitleUploader from "./components/VideoSubtitleUploader";
import SubtitleValidator from "./components/SubtitleValidator";
import SubtitleEditor from "./components/SubtitleEditor";

const App = () => {
  const [subtitleContent, setSubtitleContent] = useState("");
  const [isSubtitleLoaded, setIsSubtitleLoaded] = useState(false);

  const handleSubtitleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSubtitleContent(event.target.result);
        setIsSubtitleLoaded(true);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9fafb",
        fontFamily: "'Roboto', sans-serif",
        color: "#333",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            padding: "20px",
            backgroundColor: "#007BFF",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", margin: 0 }}>
            Subtitle Tool Application
          </h1>
        </header>

        <main style={{ padding: "20px" }}>
          {/* Video Subtitle Uploader */}
          <section style={{ marginBottom: "20px" }}>
            <VideoSubtitleUploader />
          </section>

          <hr className="border " />

          {/* Subtitle Validator */}
          <section style={{ marginBottom: "20px" }}>
            <SubtitleValidator />
          </section>

          <hr className="border " />

          {/* Load Subtitle Section */}
          <section style={{ marginBottom: "20px" }}>
            <h1 className="text-xl font-bold mb-4">Subtitle Editor</h1>
            <label
              style={{
                fontSize: "1rem",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Upload Subtitle File (.srt):
            </label>
            <input
              type="file"
              accept=".srt"
              onChange={handleSubtitleUpload}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "5px",
                outline: "none",
                marginTop: "10px",
              }}
            />
          </section>

          {/* Subtitle Editor */}
          <section>
            {isSubtitleLoaded ? (
              <SubtitleEditor subtitleContent={subtitleContent} />
            ) : (
              <p style={{ fontSize: "1rem", color: "#555" }}>
                No subtitle loaded yet. Please upload a subtitle file to edit.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
