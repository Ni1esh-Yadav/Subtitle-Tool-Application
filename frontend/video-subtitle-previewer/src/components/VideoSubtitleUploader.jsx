import React, { useState } from "react";
import ReactPlayer from "react-player";

const VideoSubtitleUploader = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [error, setError] = useState("");
  const [srtErrors, setSrtErrors] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "video") {
      setVideoFile(file);
    } else if (type === "subtitle") {
      setSubtitleFile(file);
    }
  };

  const handlePreview = async () => {
    if (!videoFile || !subtitleFile) {
      setError("Both video and subtitle files are required.");
      return;
    }

    setError("");
    setSrtErrors([]);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("subtitle", subtitleFile);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/preview", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle server errors
        if (result.errors && result.errors.length > 0) {
          setSrtErrors(result.errors);
        } else {
          setError(result.message || "An error occurred.");
        }
        return;
      }

      if (result.success) {
        setVideoPath(result.previewPath);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error generating preview:", err);
      setError("Error connecting to the server. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px" }}>Embed Subtitle in Video</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Upload Video:</strong>
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(e, "video")}
          style={{ display: "block", margin: "10px 0" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Upload Subtitle (.srt):</strong>
        </label>
        <input
          type="file"
          accept=".srt"
          onChange={(e) => handleFileChange(e, "subtitle")}
          style={{ display: "block", margin: "10px 0" }}
        />
      </div>
      <button
        onClick={handlePreview}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "laoding" : "Generate Preview"}
      </button>

      {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}

      {srtErrors.length > 0 && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h3>Subtitle Errors:</h3>
          <ul>
            {srtErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {videoPath && (
        <div style={{ marginTop: "30px" }}>
          <h2>Video Preview</h2>
          <ReactPlayer url={videoPath} controls={true} width="100%" />
        </div>
      )}
    </div>
  );
};

export default VideoSubtitleUploader;
