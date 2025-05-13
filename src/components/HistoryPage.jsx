import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";

const HistoryPage = ({ onBack }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    setHistoryData(savedData);
  }, []);

  const handleExport = async () => {
    if (historyData.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Materai Data");

    worksheet.addRow(["Nomor", "Tanggal", "Nama Customer", "No Inv/Kw", "Nilai Inv/Kw"]);

    historyData.forEach((data, index) => {
      worksheet.addRow([index + 1, data.tanggal, data.customer, data.noInvKw, data.nilaiInvKw]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "materai_data.xlsx";
    link.click();

    alert("Data berhasil diekspor ke Excel!");

    // Reset histori setelah ekspor
    localStorage.removeItem("savedData");
    setHistoryData([]);

    alert("Histori data telah direset!");
  };

  return (
    <div className="history-container">
      <h2>Histori Data</h2>
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
