import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";

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

const HistoryPage = ({ currentUser, userRole, onBack }) => {
  const [historyData, setHistoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Tambahkan state untuk pencarian

  useEffect(() => {
    const loadHistory = async () => {
      if (!currentUser) return;

      if (userRole === "admin") {
        const adminRef = doc(db, "admin", "data");
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setHistoryData(adminSnap.data().data || []);
        } else {
          setHistoryData([]);
        }
      } else {
        const docRef = doc(db, "users", currentUser);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHistoryData(docSnap.data().data || []);
        } else {
          setHistoryData([]);
        }
      }
    };

    loadHistory();
  }, [currentUser, userRole]);

  const formatAngka = (angka) => {
    return Number(angka).toLocaleString("id-ID");
  };

  // Fungsi untuk menyaring data berdasarkan pencarian user
const filteredData = historyData.filter(row => 
  Object.values(row).some(value => 
    value.toString().toLowerCase().includes(searchQuery.toLowerCase())
  )
);


  return (
    <div className="history-container">
      <h2>Histori Data untuk {currentUser}</h2>

      {/* Input pencarian */}
<input
  type="text"
  placeholder="Cari data dalam histori..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="search-input"
/>


      {filteredData.length > 0 ? (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>Nomor</th>
                <th>Tanggal</th>
                <th>Nama Customer</th>
                <th>No Inv/Kw</th>
                <th>Nilai Inv/Kw</th>
              </tr>
            </thead>
<tbody>
  {filteredData.map((data, index) => (
    <tr key={index}>
      <td>{data.nomor}</td>
      <td>{data.tanggal}</td>
      <td>{data.customer}</td>
      <td>{data.noInvKw}</td>
      <td>{formatAngka(data.nilaiInvKw)}</td>
    </tr>
  ))}
</tbody>

          </table>
          <button className="export-button">Export ke Excel</button>
        </>
      ) : (
        <p>Tidak ada data histori yang sesuai dengan pencarian.</p>
      )}

      <button className="back-button" onClick={onBack}>Kembali</button>
    </div>
  );
};

export default HistoryPage;
