import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import * as XLSX from "xlsx";
import { initializeApp } from "firebase/app";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCgkP84T1GqeMBlcnn-f_H1OkF94rUhdZM",
  authDomain: "react-materai.firebaseapp.com",
  projectId: "react-materai",
  storageBucket: "react-materai.firebasestorage.app",
  messagingSenderId: "50155200415",
  appId: "1:50155200415:web:868941f54de7feb3f1e7aa",
  measurementId: "G-M6DESRJWPG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const InputForm = ({ selectedCustomer, setSelectedCustomer, currentUser }) => {

  const [formData, setFormData] = useState({
    nomor: 1,
    tanggal: new Date().toISOString().slice(0, 10),
    noInvKw: "",
    nilaiInvKw: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;

      const docRef = doc(db, "users", currentUser);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data().data || [];
        setFormData((prevData) => ({
          ...prevData,
          nomor: userData.length + 1,
        }));
      } else {
        await setDoc(docRef, { username: currentUser, data: [] });
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  if (!currentUser) {
    alert("Anda harus login terlebih dahulu!");
    return;
  }

  if (!selectedCustomer) {
    alert("Pilih customer terlebih dahulu!");
    return;
  }

  const newEntry = { ...formData, customer: selectedCustomer };

  const docRef = doc(db, "users", currentUser);
  await updateDoc(docRef, {
    data: arrayUnion(newEntry),
  });

  // Reset semua input ke default setelah penyimpanan
  setFormData({
    nomor: 1, // Reset nomor ke 1
    tanggal: new Date().toISOString().slice(0, 10), // Reset tanggal ke hari ini
    noInvKw: "",
    nilaiInvKw: "",
  });

  alert("Data berhasil disimpan ke Firebase!");

  // Reset dropdown customer ke "-- Pilih Customer --"
  setSelectedCustomer("");
};


  // Ekspor Data ke File Excel
  const handleExportExcel = async () => {
    const docRef = doc(db, "users", currentUser);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Data tidak ditemukan!");
      return;
    }

    const userData = docSnap.data().data || [];
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data User");

    XLSX.writeFile(workbook, `Data_${currentUser}.xlsx`);
    alert("Data berhasil diekspor ke Excel!");
  };

  return (
    <div className="form-container">
      <h4 className="star-wars-title">Form Input Data (User: {currentUser})</h4>

      <input type="text" name="nomor" value={formData.nomor} disabled placeholder="Nomor Otomatis" />
      <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
      <input type="text" name="noInvKw" value={formData.noInvKw} onChange={handleChange} placeholder="No Inv/Kw" />
      <input type="number" name="nilaiInvKw" value={formData.nilaiInvKw} onChange={handleChange} placeholder="Nilai Inv/Kw" />

      <button className="save-data" onClick={handleSave}>Simpan ke Firebase</button>
    </div>
  );
};

export default InputForm;
