import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const HistoryTable = ({ currentUser }) => {
  const [historyData, setHistoryData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

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

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedData(historyData[index]);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;

    const updatedHistory = [...historyData];
    updatedHistory[editingIndex] = editedData;

    await updateDoc(doc(db, "users", currentUser), { data: updatedHistory });

    setHistoryData(updatedHistory);
    setEditingIndex(null);
    alert("Data berhasil diperbarui!");
  };

  return (
    <div>
      <h4>Data Histori</h4>
      {historyData.length > 0 ? (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Customer</th>
                <th>No Inv/Kw</th>
                <th>Nilai Inv/Kw</th>
                <th>Aksi</th> {/* Tambahkan kolom aksi */}
              </tr>
            </thead>
            <tbody>
              {historyData.map((data, index) => (
                <tr key={index}>
                  <td>{data.nomor}</td>
                  <td>{data.tanggal}</td>
                  <td>{data.customer}</td>
                  <td>{data.noInvKw}</td>
                  <td>{formatRupiah(data.nilaiInvKw)}</td>
                  <td>
                    <button onClick={() => handleEditClick(index)} className="edit-button">Edit</button>
                    <button className="delete-button">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Form edit untuk mengubah data */}
          {editingIndex !== null && (
            <div className="edit-form">
              <h3>Edit Data</h3>
              <input
                type="text"
                value={editedData.customer}
                onChange={(e) => setEditedData({ ...editedData, customer: e.target.value })}
              />
              <input
                type="text"
                value={editedData.noInvKw}
                onChange={(e) => setEditedData({ ...editedData, noInvKw: e.target.value })}
              />
              <input
                type="number"
                value={editedData.nilaiInvKw}
                onChange={(e) => setEditedData({ ...editedData, nilaiInvKw: e.target.value })}
              />
              <button onClick={handleSaveEdit} className="save-edit-button">Simpan</button>
              <button onClick={() => setEditingIndex(null)} className="cancel-edit-button">Batal</button>
            </div>
          )}
        </>
      ) : (
        <p>Tidak ada data histori.</p>
      )}
    </div>
  );
};

export default HistoryTable;
