import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
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

  const [customerList, setCustomerList] = useState([]);
  const [resetDropdown, setResetDropdown] = useState(false);

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

  // Muat daftar customer dari Firestore
  useEffect(() => {
    const loadCustomerList = async () => {
      const isFirstLoad = sessionStorage.getItem("firstLoad");
      try {
        const docRef = doc(db, "customers", "customerData");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const updatedCustomerList = docSnap.data().data.map(row => row["Nama Customer"]);
          setCustomerList(updatedCustomerList);
          localStorage.setItem("customerList", JSON.stringify(updatedCustomerList));

          if (!selectedCustomer) {
            setSelectedCustomer(updatedCustomerList[0]); // Pilih default customer pertama
          }
        } else {
          console.warn("Data pelanggan tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error saat mengambil daftar pelanggan:", error);
      }
    };

    loadCustomerList();
  }, [selectedCustomer]);

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
    userPenginput: currentUser,
  };

  const docRef = doc(db, "users", currentUser);
  await updateDoc(docRef, {
    data: arrayUnion(newEntry),
  });

  alert("Data berhasil disimpan ke Firebase!");
  
  setSelectedCustomer(""); // Reset dropdown ke default
  setResetDropdown(prev => !prev); // Trigger reset untuk pencarian dan dropdown
};


  return (
    <div className="form-container">
      <h2 className="star-wars-title">Form Input Data </h2>
      <input type="text" name="nomor" value={formData.nomor} disabled placeholder="Nomor Otomatis" />
      <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
      <input type="text" name="noInvKw" value={formData.noInvKw} onChange={handleChange} placeholder="No. Invoice/Kwitansi" />
      <input type="number" name="nilaiInvKw" value={formData.nilaiInvKw} onChange={handleChange} placeholder="Nilai Invoice/Kwitansi" />

      <button className="save-data" onClick={handleSave}>Simpan ke Database</button>
    </div>
  );
};

export default InputForm;
