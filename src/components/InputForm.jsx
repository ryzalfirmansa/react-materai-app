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

const InputForm = ({ selectedCustomer, setSelectedCustomer, currentUser, userRole }) => {

  const [formData, setFormData] = useState({
    nomor: 1,
    tanggal: new Date().toISOString().slice(0, 10),
    noInvKw: "",
    nilaiInvKw: "",
  });

  /*useEffect(() => {
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
  }, [currentUser]);*/

  useEffect(() => {
  const loadUserData = async () => {
    if (!currentUser) return;

    try {
      const docRef = doc(db, "users", currentUser);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = Array.isArray(docSnap.data().data) ? docSnap.data().data : [];

        setFormData((prevData) => ({
          ...prevData,
          nomor: userData.length + 1,
        }));
      } else {
        console.warn(`Data user ${currentUser} tidak ditemukan, membuat data baru.`);
        await setDoc(docRef, { username: currentUser, data: [] });
      }
    } catch (error) {
      console.error("Error saat memuat data user:", error);
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

  const newEntry = {
    ...formData,
    customer: selectedCustomer,
    userPenginput: currentUser, // Simpan username yang dimasukkan user saat login
  };

  const docRef = doc(db, "users", currentUser);
  await updateDoc(docRef, {
    data: arrayUnion(newEntry),
  });

  setFormData({
    nomor: 1,
    tanggal: new Date().toISOString().slice(0, 10),
    noInvKw: "",
    nilaiInvKw: "",
  });

  alert("Data berhasil disimpan ke Firebase!");
  setSelectedCustomer("");
};

  // Ekspor Data ke File Excel
  return (
    <div className="form-container">
      <h4 className="star-wars-title">Form Input Data (User: {currentUser})</h4>

      <input type="text" name="nomor" value={formData.nomor} disabled placeholder="Nomor Otomatis" />
      <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
      <input type="text" name="noInvKw" value={formData.noInvKw} onChange={handleChange} placeholder="No Inv/Kw" />
      <input type="number" name="nilaiInvKw" value={formData.nilaiInvKw} onChange={handleChange} placeholder="Nilai Inv/Kw" />

      <button className="save-data" onClick={handleSave}>Simpan ke Database</button>
    </div>
  );
};

export default InputForm;
