import React, { useEffect, useState } from "react";

const HistoryTable = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    setHistoryData(savedData);
  }, []);

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
                <td>{data.nilaiInvKw}</td>
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
