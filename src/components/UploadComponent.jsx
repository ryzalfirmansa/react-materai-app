import React, { useState } from "react";

const UploadComponent = ({ onUpload, onLoad }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Fungsi menangani pemilihan file JSON
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      alert("Harap pilih file berformat .json!");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("File siap diunggah.");
  };

  // Fungsi mengunggah file ke Google Drive melalui API backend
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Harap pilih file sebelum mengunggah!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = JSON.parse(e.target.result);

      try {
        await onUpload(fileData);
        setUploadStatus("File berhasil diunggah ke Google Drive!");
      } catch (error) {
        setUploadStatus("Gagal mengunggah file.");
        console.error("Error upload:", error);
      }
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div>
      <h2>Upload & Load Customer Data</h2>
      <input type="file" accept=".json" onChange={handleFileSelect} />
      <button onClick={handleUpload} disabled={!selectedFile}>Unggah ke Google Drive</button>
      <button onClick={onLoad}>Lihat Data Customer</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadComponent;
