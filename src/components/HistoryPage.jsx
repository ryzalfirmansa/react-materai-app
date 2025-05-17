import React, { useEffect, useState } from "react"; 
import * as XLSX from "xlsx"; 
import { initializeApp } from "firebase/app"; 
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; 

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
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => { 
    const loadHistory = async () => { 
      if (!currentUser) return; 
      try { 
        let docRef; 
        if (userRole === "admin") { 
          docRef = doc(db, "admin", "data"); 
        } else { 
          docRef = doc(db, "users", currentUser); 
        } 
        const docSnap = await getDoc(docRef); 
        if (docSnap.exists()) { 
          setHistoryData(docSnap.data().data || []); 
        } else { 
          setHistoryData([]); 
        } 
      } catch (error) { 
        console.error("Error mengambil data histori:", error); 
      } 
    }; 
    loadHistory(); 
  }, [currentUser, userRole]); 

  // Format angka agar lebih mudah dibaca
  const formatAngka = (angka) => { 
    return Number(angka).toLocaleString("id-ID"); 
  }; 

  // Filter berdasarkan pencarian user
  const filteredData = historyData.filter(row => Object.values(row).some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()) ) ); 

  const loadAdminHistory = async () => { 
    const adminRef = doc(db, "admin", "data"); 
    try { 
      const adminSnap = await getDoc(adminRef); 
      if (adminSnap.exists()) { 
        setHistoryData(adminSnap.data().data || []); 
        console.log("Histori admin berhasil dimuat."); 
      } else { 
        console.warn("Tidak ada histori di admin."); 
      } 
    } catch (error) { 
      console.error("Error mengambil histori admin:", error); 
    } 
  }; 

const handleExportExcel = async () => {
  if (filteredData.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  // Buat array dengan urutan kolom yang benar
  const formattedData = filteredData.map(data => ({
    nomor: data.nomor,
    tanggal: data.tanggal,
    customer: data.customer,
    noInvKw: data.noInvKw,
    nilaiInvKw: data.nilaiInvKw,
    userPenginput: data.userPenginput,
  }));

  console.log("Data yang akan diekspor:", formattedData); // Cek apakah urutan sudah benar

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set judul kolom sesuai urutan yang diinginkan
  XLSX.utils.sheet_add_aoa(worksheet, [
    ["Nomor", "Tanggal", "Customer", "No Inv/Kw", "Nilai Inv/Kw", "User Penginput"]
  ], { origin: "A1" });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Histori User");

  try {
    XLSX.writeFile(workbook, `Histori_${currentUser}.xlsx`);
    alert("Data histori berhasil diekspor ke Excel!");

    // Hapus histori user dari Firestore
    const docRef = doc(db, "users", currentUser);
    await setDoc(docRef, { data: [] });

    // Kosongkan histori dari tampilan
    setHistoryData([]);
    
    alert("Data histori telah dihapus setelah ekspor.");
  } catch (error) {
    console.error("Error saat ekspor:", error);
    alert("Gagal mengekspor data.");
  }
};



  return ( 
    <div className="history-container"> 
      <h2>Histori Data untuk {currentUser}</h2> 

      {/* Input pencarian */} 
      <input type="text" placeholder="Cari data dalam histori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" /> 

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
                <th>User Penginput</th> 
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
                  <td>{data.userPenginput}</td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
          <button className="export-button" onClick={handleExportExcel}>Export ke Excel</button> 
        </> 
      ) : ( 
        <p>Tidak ada data histori yang sesuai dengan pencarian.</p> 
      )} 
      <button className="back-button" onClick={onBack}>Kembali</button> 
    </div> 
  ); 
}; 

export default HistoryPage;
