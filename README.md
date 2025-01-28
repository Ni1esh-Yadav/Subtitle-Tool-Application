# Subtitle Tool Application

A web app for where user can embed subtitles in video they can validate their subtitle that is subtitle is present in correct format or not and they can edit the subtitle using dynamic subtitle editor

## Features

### Core Features
1. **Upload Video Files:**
   - Supports formats like `.mp4`, `.mkv`, `.avi`.
   - Plays videos using a custom player (e.g., `react-player`).

2. **Upload Subtitle Files:**
   - Supports `.srt` and `.vtt` formats.
   - Parses and synchronizes subtitles with video playback.

3. **Subtitle Validation:**
   - Detects and highlights errors like timing overlaps, formatting issues, or file corruption.
   - Inline suggestions for corrections in a text editor.


4. **Export Functionality:**
   - Download corrected subtitle files.
   - Option to export videos with embedded subtitles (using FFmpeg).

### Additional Features
- **Error Reporting:** Downloadable reports of subtitle issues.
- **FFmpeg Integration:** Dynamically merge video and subtitles for previews or export.

---

## Technical Stack

### Frontend
- **React.js**: For building the user interface.
- **react-player**: For embedding and controlling video playback.
- **react-codemirror**: For inline subtitle editing.
- **CSS (Tailwind)**: For styling the app.

### Backend
- **Node.js + Express.js**: For handling file uploads and API endpoints.
- **Multer**: For handling video and subtitle file uploads.
- **FFmpeg**: For processing video files and embedding subtitles.


---

### Prerequisites
- Node.js (version 14 or above)
- npm or yarn
- FFmpeg (for video export functionality)

### Reference::

![subtitle](https://github.com/user-attachments/assets/b6435c7c-3082-4041-9bbe-b224a997e7b5)


