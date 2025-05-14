import React, { useState } from "react";
import * as XLSX from "xlsx";

const MasterUpload = ({ onDataLoaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      alert("Silakan pilih file dengan format .xlsx!");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu sebelum mengunggah!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      localStorage.setItem("uploadedData", JSON.stringify(sheetData));
      alert(`File ${fileName} berhasil diunggah dan disimpan!`);

      if (onDataLoaded) {
        onDataLoaded(sheetData);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div>
      <h3>Upload File Master</h3>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {fileName && (
        <>
          <p>File Terpilih: {fileName}</p>
          <button className="upload-button" onClick={handleUpload}>Upload File</button>
        </>
      )}
    </div>
  );
};

export default MasterUpload;
