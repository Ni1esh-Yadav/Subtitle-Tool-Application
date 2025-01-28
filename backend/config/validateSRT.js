import srtParser2 from "srt-parser-2";
import fs from "fs";

// Helper: Validate subtitles
export const validateSRT = (srtFilePath) => {
  const parser = new srtParser2();
  const srtContent = fs.readFileSync(srtFilePath, "utf8");
  let subtitles;

  try {
    subtitles = parser.fromSrt(srtContent);
  } catch (error) {
    return [`Error parsing the SRT file: ${error.message}`];
  }

  const errors = [];
  if (subtitles.length === 0) {
    errors.push("The subtitle file is empty or improperly formatted.");
    return errors;
  }

  for (let i = 0; i < subtitles.length; i++) {
    const current = subtitles[i];
    if (!current.startTime || !current.endTime) {
      errors.push(`Subtitle ${current.id || i + 1} has missing timestamps.`);
    } else {
      const startTimeMs = timeStringToMs(current.startTime);
      const endTimeMs = timeStringToMs(current.endTime);
      if (startTimeMs >= endTimeMs) {
        errors.push(
          `Subtitle ${current.id} has start time greater than or equal to end time.`
        );
      }
    }
  }
  return errors;
};

// Helper: Convert timestamp to milliseconds
const timeStringToMs = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(/[:,]/).map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
};
