import React, { useState, useEffect, useRef } from "react";

const SubtitleEditor = ({ subtitleContent }) => {
  const [subtitles, setSubtitles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [previewContent, setPreviewContent] = useState("");

  const previewRef = useRef(null);
  const editorRef = useRef(null);

  function parseSubtitles(content) {
    if (typeof content !== "string") {
      console.error("Invalid subtitle content:", content);
      return [];
    }

    const lines = content.split(/\r?\n/);
    const parsed = [];
    let currentSubtitle = { id: "", time: "", text: "" };

    lines.forEach((line) => {
      if (/^\d+$/.test(line)) {
        currentSubtitle.id = line.trim();
      } else if (
        /^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line)
      ) {
        currentSubtitle.time = line.trim();
      } else if (line.trim() === "") {
        if (currentSubtitle.id && currentSubtitle.time) {
          parsed.push({ ...currentSubtitle });
        }
        currentSubtitle = { id: "", time: "", text: "" };
      } else {
        currentSubtitle.text += `${line.trim()} `;
      }
    });

    return parsed;
  }

  function validateSubtitles(subtitles) {
    return subtitles.map((subtitle) => {
      const errors = [];
      if (!subtitle.id || isNaN(Number(subtitle.id))) {
        errors.push("Missing or invalid ID.");
      }
      if (
        !/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/.test(
          subtitle.time
        )
      ) {
        errors.push("Invalid timestamp format.");
      }
      if (!subtitle.text.trim()) {
        errors.push("Subtitle text is empty.");
      }
      return { ...subtitle, errors };
    });
  }

  useEffect(() => {
    const parsedSubtitles = parseSubtitles(subtitleContent);
    setSubtitles(parsedSubtitles);
    setErrors(validateSubtitles(parsedSubtitles));
    setPreviewContent(generatePreview(parsedSubtitles));
  }, [subtitleContent]);

  const generatePreview = (subtitles) =>
    subtitles
      .map(
        (subtitle) =>
          `${subtitle.id}\n${subtitle.time}\n${subtitle.text.trim()}\n`
      )
      .join("\n");

  const handleChange = (index, field, value) => {
    const updatedSubtitles = [...subtitles];
    updatedSubtitles[index][field] = value;

    const updatedErrors = validateSubtitles(updatedSubtitles);

    setSubtitles(updatedSubtitles);
    setErrors(updatedErrors);
    setPreviewContent(generatePreview(updatedSubtitles));
  };

  // Save and Download Changes
  const handleSave = () => {
    console.log("Updated Subtitle Content:", previewContent);

    // Create a Blob from the updated content
    const blob = new Blob([previewContent], { type: "text/plain" });

    // Create a link to download the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "updated_subtitles.srt"; // Default filename
    link.click();

    alert("Subtitles saved and downloaded successfully!");
  };

  // Sync scrolling between preview and editor
  const handleScrollSync = (e, source) => {
    const previewEl = previewRef.current;
    const editorEl = editorRef.current;

    if (previewEl && editorEl) {
      const sourceEl = source === "preview" ? previewEl : editorEl;
      const targetEl = source === "preview" ? editorEl : previewEl;

      const scrollRatio =
        sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight);

      targetEl.scrollTop =
        scrollRatio * (targetEl.scrollHeight - targetEl.clientHeight);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left: Real-Time Preview */}
      <div
        ref={previewRef}
        onScroll={(e) => handleScrollSync(e, "preview")}
        style={{
          flex: 1,
          paddingRight: "10px",
          maxHeight: "80vh",
          overflowY: "auto",
          border: "1px solid lightgray",
          borderRadius: "5px",
          background: "#f8f8f8",
        }}
      >
        <h2
          style={{
            position: "sticky",
            top: 0,
            background: "#f8f8f8",
            color: "black",
          }}
        >
          Subtitle Preview
        </h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            padding: "10px",
            color: "black",
          }}
        >
          {previewContent || "No subtitle loaded yet."}
        </pre>
      </div>

      {/* Right: Editable Subtitles */}
      <div
        ref={editorRef}
        onScroll={(e) => handleScrollSync(e, "editor")}
        style={{
          flex: 1,
          paddingLeft: "10px",
          maxHeight: "80vh",
          overflowY: "auto",
          border: "1px solid lightgray",
          borderRadius: "5px",
        }}
      >
        <h2
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            color: "black",
          }}
        >
          Editable Subtitles
        </h2>
        {subtitles.length === 0 ? (
          <p style={{ color: "black" }}>No subtitles to edit.</p>
        ) : (
          subtitles.map((subtitle, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid lightgray",
                borderRadius: "5px",
                backgroundColor:
                  errors[index]?.errors.length > 0 ? "#ffe6e6" : "#e6ffe6",
              }}
            >
              <label>
                <strong style={{ color: "black" }}>ID:</strong>
                <input
                  type="text"
                  value={subtitle.id}
                  onChange={(e) => handleChange(index, "id", e.target.value)}
                  style={{ marginLeft: "10px", width: "50px" }}
                />
              </label>
              <br />
              <label>
                <strong style={{ color: "black" }}>Time:</strong>
                <input
                  type="text"
                  value={subtitle.time}
                  onChange={(e) => handleChange(index, "time", e.target.value)}
                  style={{ marginLeft: "10px", width: "300px" }}
                />
              </label>
              <br />
              <label>
                <strong style={{ color: "black" }}>Text:</strong>
                <textarea
                  value={subtitle.text}
                  onChange={(e) => handleChange(index, "text", e.target.value)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    height: "50px",
                    resize: "none",
                  }}
                />
              </label>
              {errors[index]?.errors.length > 0 && (
                <ul style={{ color: "red", marginTop: "10px" }}>
                  {errors[index].errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
        <button
          onClick={handleSave}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Save and Download
        </button>
      </div>
    </div>
  );
};

export default SubtitleEditor;
