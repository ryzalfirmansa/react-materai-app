import React, { useState } from "react";
import * as XLSX from "xlsx";

const MasterUpload = ({ onDataLoaded }) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      onDataLoaded(sheetData); // Kirim data ke parent component
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h3>Upload File Master</h3>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {fileName && <p>File Terpilih: {fileName}</p>}
    </div>
  );
};

export default MasterUpload;
