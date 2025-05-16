import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

const HistoryTable = ({ currentUser }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!currentUser) return;

      const docRef = doc(db, "users", currentUser);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHistoryData(docSnap.data().data || []);
      } else {
        setHistoryData([]);
      }
    };

    loadHistory();
  }, [currentUser]);

  const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);
};


  return (
    <div>
      <h4>Data Histori</h4>
      {historyData.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Nama Customer</th>
              <th>No Inv/Kw</th>
              <th>Nilai Inv/Kw</th>
            </tr>
          </thead>
          <tbody>
  {historyData.map((data, index) => (
    <tr key={index}>
      <td>{data.nomor}</td>
      <td>{data.tanggal}</td>
      <td>{data.customer}</td>
      <td>{data.noInvKw}</td>
      <td>{formatRupiah(data.nilaiInvKw)}</td> {/* Format Rupiah */}
    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <p>Tidak ada data histori.</p>
      )}
    </div>
  );
};

export default HistoryTable;
