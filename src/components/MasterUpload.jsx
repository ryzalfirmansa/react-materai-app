import React, { useState } from "react";
import * as XLSX from "xlsx";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";


// Konfigurasi Firebase dari `firebaseConfig`
const firebaseConfig = {
  apiKey: "AIzaSyCgkP84T1GqeMBlcnn-f_H1OkF94rUhdZM",
  authDomain: "react-materai.firebaseapp.com",
  projectId: "react-materai",
  storageBucket: "react-materai.firebasestorage.app",
  messagingSenderId: "50155200415",
  appId: "1:50155200415:web:868941f54de7feb3f1e7aa",
  measurementId: "G-M6DESRJWPG"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MasterUpload = ({ setUploading, setCustomerList }) => {
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

const handleUploadAndLoadData = async () => {
  if (!selectedFile) {
    alert("Pilih file terlebih dahulu sebelum mengunggah!");
    return;
  }

  setUploading(true); // Tampilkan progress bar

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Ambil data lama dari Firestore sebelum menyimpan yang baru
      const docRef = doc(db, "customers", "customerData");
      const docSnap = await getDoc(docRef);

      let existingData = docSnap.exists() ? docSnap.data().data || [] : [];
      
      // Pastikan setiap entri memiliki "Nama Customer"
      let updatedData = [...existingData, ...sheetData.filter(row => row["Nama Customer"])];

      // Simpan data gabungan ke Firestore
      await setDoc(docRef, { data: updatedData });

      alert(`File ${fileName} berhasil dikonversi ke JSON dan ditambahkan ke database!`);

      // Ambil data langsung dari Firestore, bukan localStorage
      const refreshedSnap = await getDoc(docRef);
      if (refreshedSnap.exists()) {
        setCustomerList(refreshedSnap.data().data.map(row => row["Nama Customer"]));
      } else {
        setCustomerList([]);
        console.warn("Data customer kosong setelah upload.");
      }
    } catch (error) {
      console.error("Error mengunggah dan memuat data:", error);
      alert("Gagal mengunggah dan memuat data.");
    } finally {
      setUploading(false); // Sembunyikan progress bar setelah selesai
    }
  };
  reader.readAsArrayBuffer(selectedFile);
};

  return (
    <div>
      <h3>Upload Template XLSX</h3>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {fileName && (
        <>
          <p>File Terpilih: {fileName}</p>
          <button onClick={handleUploadAndLoadData}>convert to json & save </button>
        </>
      )}

    </div>
  );
};

export default MasterUpload;
