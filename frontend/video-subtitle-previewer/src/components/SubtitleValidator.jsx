import React, { useState } from "react";

const SubtitleValidator = () => {
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSubtitleFile(e.target.files[0]);
    setValidationResult(null); // Clear previous results
    setError(""); // Clear previous errors
  };

  const handleValidate = async () => {
    if (!subtitleFile) {
      setError("Please upload a subtitle (.srt) file before validating.");
      return;
    }

    const formData = new FormData();
    formData.append("subtitle", subtitleFile);

    try {
      const response = await fetch("http://localhost:5000/validate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setValidationResult(result.message);
        setError(""); // Clear any previous errors
      } else {
        setValidationResult(null);
        setError(result.errors.join(", "));
      }
    } catch (err) {
      setError("An error occurred while validating the subtitle file.");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow-lg">
      <h1 className="text-xl font-bold mb-4">Validate Subtitle File</h1>
      <input
        type="file"
        accept=".srt"
        onChange={handleFileChange}
        className="block mb-4"
      />
      <button
        onClick={handleValidate}
        className="bg-blue text-white px-4==py-2 rounded hover:bg-blue-600"
      >
        Validate
      </button>
      {validationResult && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {validationResult}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}
    </div>
  );
};

export default SubtitleValidator;
