import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";

const HistoryPage = ({ currentUser, onBack }) => {
  const [historyData, setHistoryData] = useState([]);

    /*useEffect(() => {
    if (!currentUser) return;

    const usersData = JSON.parse(localStorage.getItem("userData")) || {};
    const userRole = localStorage.getItem("userRole");

    // Semua user termasuk Guest bisa melihat histori mereka sendiri
    setHistoryData(usersData[currentUser]?.data || []);
    }, [currentUser]);*/


    useEffect(() => {
        handleLoadHistory();
    if (!currentUser) return;

    const usersData = JSON.parse(localStorage.getItem("userData")) || {};
    const userRole = localStorage.getItem("userRole");

    if (userRole === "admin") {
        setHistoryData(Object.values(usersData).flatMap(user => user.data)); // Admin melihat semua histori
    } else {
        setHistoryData(usersData[currentUser]?.data || []); // User & Guest hanya melihat histori mereka sendiri
    }
}, [currentUser, localStorage.getItem("userData")]); // Tambahkan dependensi agar histori diperbarui jika data berubah



const handleExport = async () => {
  if (historyData.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Data - ${currentUser}`);

  // Menambahkan informasi user di bagian atas file Excel
  const exportDate = new Date().toLocaleString();
  worksheet.addRow([`Histori Data untuk User: ${currentUser}`]);
  worksheet.addRow([`Tanggal Export: ${exportDate}`]);
  worksheet.addRow([]);

  // Tambahkan header kolom
  worksheet.addRow(["Nomor", "Tanggal", "Nama Customer", "No Inv/Kw", "Nilai Inv/Kw"]);

  // Masukkan data user
  historyData.forEach((data, index) => {
    worksheet.addRow([index + 1, data.tanggal, data.customer, data.noInvKw, data.nilaiInvKw]);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `materai_data_${currentUser}.xlsx`;
  link.click();

  // Hapus data setelah ekspor
  const usersData = JSON.parse(localStorage.getItem("userData")) || {};
  usersData[currentUser].data = []; // Kosongkan histori untuk user saat ini
  localStorage.setItem("userData", JSON.stringify(usersData));

  setHistoryData([]); // Update UI agar halaman histori kosong

  alert(`Data berhasil diekspor dan semua histori telah dihapus untuk ${currentUser}`);
};

const handleLoadHistory = () => {
  const currentUser = localStorage.getItem("currentUser");
  const userRole = localStorage.getItem("userRole");

  const savedData = JSON.parse(localStorage.getItem("userData")) || {};

  if (userRole === "admin") {
    setHistoryData(Object.values(savedData).flatMap(user => user.data)); // Admin melihat semua histori
  } else {
    setHistoryData(savedData[currentUser]?.data || []); // User dan Guest melihat histori mereka sendiri
  }
};


  return (
    <div className="history-container">
      <h2>Histori Data untuk {currentUser}</h2>
      {historyData.length > 0 ? (
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
              {historyData.map((data, index) => (
                <tr key={index}>
                  <td>{data.nomor}</td>
                  <td>{data.tanggal}</td>
                  <td>{data.customer}</td>
                  <td>{data.noInvKw}</td>
                  <td>{data.nilaiInvKw}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="reload-history" onClick={handleLoadHistory}>Muat Ulang Histori</button>
          <button className="export-button" onClick={handleExport}>Export ke Excel</button>
        </>
      ) : (
        <p>Tidak ada data histori.</p>
      )}
      <button className="back-button" onClick={onBack}>Kembali</button>
    </div>
  );
};

export default HistoryPage;
