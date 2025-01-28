import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedVideoTypes = /mp4|mov|avi/;
    const allowedSubtitleTypes = /srt/;

    if (
      file.fieldname === "video" &&
      allowedVideoTypes.test(path.extname(file.originalname))
    ) {
      return cb(null, true);
    } else if (
      file.fieldname === "subtitle" &&
      allowedSubtitleTypes.test(path.extname(file.originalname))
    ) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type"));
  },
});
