import express from "express";
import fluentFFmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import cors from "cors";
import { upload, __filename, __dirname } from "./upload.js";
import { validateSRT } from "./config/validateSRT.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint: Validate subtitles
app.post("/validate", upload.single("subtitle"), (req, res) => {
  const subtitleFile = req.file;

  if (!subtitleFile) {
    return res.status(400).json({ message: "Subtitle file is required." });
  }

  const errors = validateSRT(subtitleFile.path);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  res.json({ success: true, message: "Subtitle file is valid." });
});

// Endpoint: Generate preview with multiple subtitles
app.post(
  "/preview",
  upload.fields([{ name: "video" }, { name: "subtitle" }]),
  (req, res) => {
    const videoFile = req.files?.video?.[0];
    const subtitleFiles = req.files?.subtitle;

    if (!videoFile || !subtitleFiles || subtitleFiles.length === 0) {
      return res.status(400).json({
        message: "Video and at least one subtitle file are required.",
      });
    }

    const errors = subtitleFiles.map((file) => validateSRT(file.path)).flat();

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Subtitle validation failed.",
        errors,
      });
    }

    const outputPath = path
      .join(__dirname, "uploads", "preview.mp4")
      .replace(/\\/g, "/");
    console.log(__dirname);

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    const videoPath = path.resolve(videoFile.path).replace(/\\/g, "/");
    const subtitlePath = path
      .relative(__dirname, subtitleFiles[0].path)
      .replace(/\\/g, "/");

    fluentFFmpeg(videoPath)
      .outputOptions([
        "-vf",
        `subtitles=${subtitlePath}`,
        "-c:v",
        "libx264",
        "-y",
      ])
      .on("start", (commandLine) => console.log("FFmpeg command:", commandLine))
      .on("end", () => {
        res.json({
          success: true,
          previewPath: `http://localhost:${PORT}/uploads/preview.mp4`,
        });
      })
      .on("error", (err) =>
        res.status(500).json({ success: false, error: err.message })
      )
      .save(outputPath);
  }
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
