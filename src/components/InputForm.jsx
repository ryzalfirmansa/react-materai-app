import React, { useState } from "react";
import ExcelJS from "exceljs";

const InputForm = ({ selectedCustomer }) => {
  // Fungsi untuk mendapatkan nomor otomatis berdasarkan jumlah data yang telah tersimpan
  const getNextNumber = () => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    return savedData.length + 1; // Nomor selalu bertambah 1 berdasarkan jumlah data
  };

  const [formData, setFormData] = useState({
    nomor: getNextNumber(), // Nomor otomatis pertama kali berdasarkan jumlah data
    tanggal: new Date().toISOString().slice(0, 10),
    noInvKw: "",
    nilaiInvKw: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    const newEntry = { ...formData, customer: selectedCustomer };
    savedData.push(newEntry);
    localStorage.setItem("savedData", JSON.stringify(savedData));

    // Reset input setelah penyimpanan, dan buat nomor otomatis baru
    setFormData({
      nomor: getNextNumber(),
      tanggal: new Date().toISOString().slice(0, 10),
      noInvKw: "",
      nilaiInvKw: "",
    });

    alert("Data berhasil disimpan!");
  };

  const handleExport = async () => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    if (savedData.length === 0) {
        alert("Tidak ada data untuk diekspor!");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Materai Data");

    // Tambahkan header
    worksheet.addRow(["Nomor", "Tanggal", "Nama Customer", "No Inv/Kw", "Nilai Inv/Kw"]);

    // Tambahkan data
    savedData.forEach((data, index) => {
        worksheet.addRow([index + 1, data.tanggal, data.customer, data.noInvKw, data.nilaiInvKw]);
    });

    // Simpan file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "materai_data.xlsx";
    link.click();

    alert("Data berhasil diekspor ke Excel!");

    // Reset histori setelah ekspor
    localStorage.removeItem("savedData");

    // Perbarui state agar histori kosong
    setFormData({
        nomor: getNextNumber(),
        tanggal: new Date().toISOString().slice(0, 10),
        noInvKw: "",
        nilaiInvKw: "",
    });

    alert("Histori data telah direset!");
};

  return (
    <div className="form-container">
      <h4>Form Input Data</h4>
      <input type="text" name="nomor" value={formData.nomor} disabled placeholder="Nomor Otomatis" />
      <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
      <input type="text" name="noInvKw" value={formData.noInvKw} onChange={handleChange} placeholder="No Inv/Kw" />
      <input type="number" name="nilaiInvKw" value={formData.nilaiInvKw} onChange={handleChange} placeholder="Nilai Inv/Kw" />

      <button onClick={handleSave}>Simpan Data</button>
      <button onClick={handleExport}>Export ke Excel</button>
    </div>
  );
};

export default InputForm;
