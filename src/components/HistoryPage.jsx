import React, { useEffect, useState } from "react"; 
import * as XLSX from "xlsx"; 
import { initializeApp, getApps } from "firebase/app"; 
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app); 

const HistoryPage = ({ currentUser, userRole, onBack }) => { 
  const [historyData, setHistoryData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => { 
    const loadHistory = async () => { 
      if (!currentUser) return; 
      let docRef = userRole === "admin" ? doc(db, "admin", "data") : doc(db, "users", currentUser);
      const docSnap = await getDoc(docRef); 
      if (docSnap.exists()) { 
        setHistoryData(docSnap.data().data || []); 
      } else { 
        setHistoryData([]); 
      } 
    }; 
    loadHistory(); 
  }, [currentUser, userRole]);

  // Fungsi filter berdasarkan input pengguna
  const filteredData = historyData.filter(row => 
    Object.values(row).some(value => 
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Fungsi ekspor data ke Excel
const handleExportExcel = async () => {
  if (filteredData.length === 0) {
    alert("⚠️ Tidak ada data untuk diekspor!");
    return;
  }

  /* Peringatan sebelum ekspor */
  const confirmExport = window.confirm("⚠️ PROSES EKSPOR AKAN MENGHAPUS SEMUA DATA INPUTAN.\n\nMohon pastikan data sudah sesuai sebelum melanjutkan.\n\nKlik OK untuk ekspor, atau Cancel untuk membatalkan.");

  if (!confirmExport) {
    alert("⛔ Ekspor dibatalkan. Data tetap aman!");
    return;
  }

  /* Konversi data tanpa header otomatis */
  const formattedData = filteredData.map(data => [
    data.nomor,
    data.tanggal,
    data.customer,
    data.noInvKw,
    data.nilaiInvKw,
    data.userPenginput,
  ]);

  /* Membuat workbook dan worksheet */
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([ 
    ["No.", "Tanggal", "Customer", "No. Invoice/Kwitansi", "Nilai Invoice/Kwitansi", "User Input"], 
    ...formattedData 
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Histori User");

  try {
    XLSX.writeFile(workbook, `Histori_${currentUser}.xlsx`);
    alert("✅ Data histori berhasil diekspor ke Excel!");

    // Kosongkan histori user setelah ekspor
    await setDoc(doc(db, "users", currentUser), { data: [] });
    setHistoryData([]);

    alert("✅ Data histori telah dihapus setelah ekspor.");
  } catch (error) {
    console.error("❌ Error saat ekspor:", error);
    alert("❌ Gagal mengekspor data.");
  }
};



  // Fungsi edit dan simpan data
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

  // Fungsi hapus data
  const handleDelete = async (index) => {
    const updatedHistory = historyData.filter((_, i) => i !== index);

    await setDoc(doc(db, "users", currentUser), { data: updatedHistory });

    setHistoryData(updatedHistory);
    alert("Data berhasil dihapus!");
  };

  return ( 
    <div className="history-container"> 
      <h2>Histori Data untuk {currentUser}</h2> 
      {/* Input pencarian */}
      <input type="text" placeholder="Cari data..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" /> 
      {filteredData.length > 0 ? ( 
          <> 
          <table className="history-table"> 
            <thead> 
              <tr> 
                <th>No</th> 
                <th>Tanggal</th> 
                <th>Nama Customer</th> 
                <th>No Inv/Kw</th> 
                <th>Nilai Inv/Kw</th> 
                <th>User Penginput</th> 
                <th>Aksi</th> {/* Kolom aksi untuk tombol */}
              </tr> 
            </thead> 
            <tbody> 
              {filteredData.map((data, index) => ( 
                <tr key={index}> 
                  <td>{data.nomor}</td> 
                  <td>{data.tanggal}</td> 
                  <td>{data.customer}</td> 
                  <td>{data.noInvKw}</td>  
                  <td>{Number(data.nilaiInvKw).toLocaleString("id-ID")}</td> {/* Format angka */}
                  <td>{data.userPenginput}</td> 
                  <td>
                    <button onClick={() => handleEditClick(index)} className="edit-button">Edit</button>
                  </td>
                </tr> 
              ))} 
            </tbody> 
          </table> 
          {/* Form Edit */}
          {editingIndex !== null && (
            <div className="edit-form">
              <input type="text" value={editedData.customer} onChange={(e) => setEditedData({ ...editedData, customer: e.target.value })} />
              <input type="text" value={editedData.noInvKw} onChange={(e) => setEditedData({ ...editedData, noInvKw: e.target.value })} />
              <input type="number" value={editedData.nilaiInvKw} onChange={(e) => setEditedData({ ...editedData, nilaiInvKw: e.target.value })} />  
              <button onClick={handleSaveEdit} className="save-edit-button">Simpan</button>
              <button onClick={() => setEditingIndex(null)} className="cancel-edit-button">Batal</button>
            </div>
          )}
        </>
      ) : ( 
        <p>Tidak ada data histori.</p> 
      )} 
          {/* Tombol Ekspor */}
          <button className="export-button" onClick={handleExportExcel}>Export ke Excel</button>
      <button className="back-button" onClick={onBack}>Kembali</button> 
    </div> 
  ); 
}; 

export default HistoryPage;
