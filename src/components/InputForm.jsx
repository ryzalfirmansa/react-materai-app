import React, { useState, useEffect } from "react";
import MasterUpload from "./MasterUpload"; // Tambahkan komponen upload

//const InputForm = ({ selectedCustomer, currentUser, userRole, onDataSaved, onDataLoaded }) => {
const InputForm = ({ selectedCustomer, setSelectedCustomer, currentUser, userRole, customers, onDataSaved }) => {

  const getNextNumber = () => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userEntries = users[currentUser]?.data || [];
    return userEntries.length + 1;
  };

  const [formData, setFormData] = useState({
    nomor: getNextNumber(),
    tanggal: new Date().toISOString().slice(0, 10),
    noInvKw: "",
    nilaiInvKw: "",
  });

  const [fileUploaded, setFileUploaded] = useState(false); // Cek apakah file sudah diunggah

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
    nomor: JSON.parse(localStorage.getItem("userData"))?.[currentUser]?.data.length + 1 || 1,
  }));
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmUpload = () => {
    const uploadedData = JSON.parse(localStorage.getItem("uploadedData")) || [];

    if (uploadedData.length === 0) {
      alert("Belum ada file yang diunggah!");
      return;
    }

    localStorage.setItem("confirmedData", JSON.stringify(uploadedData));
    setFileUploaded(true); // Tandai bahwa file sudah dikonfirmasi
    alert("Data dari file yang diunggah telah dikonfirmasi dan disimpan!");
  };

/*const handleSave = () => {
  if (!currentUser) {
    alert("Anda harus login terlebih dahulu!");
    return;
  }

  const usersData = JSON.parse(localStorage.getItem("userData")) || {};
  if (!usersData[currentUser]) usersData[currentUser] = { data: [] };

  const newEntry = { ...formData, customer: selectedCustomer };
  usersData[currentUser].data.push(newEntry);
  localStorage.setItem("userData", JSON.stringify(usersData));

  if (onDataSaved) {
    onDataSaved();
  }

  alert(`Data berhasil disimpan untuk user: ${currentUser}`);
};*/

const handleSave = () => {
  if (!currentUser) {
    alert("Anda harus login terlebih dahulu!");
    return;
  }

  const usersData = JSON.parse(localStorage.getItem("userData")) || {};
  if (!usersData[currentUser]) usersData[currentUser] = { data: [] };

  const newEntry = { ...formData, customer: selectedCustomer };
  usersData[currentUser].data.push(newEntry);
  localStorage.setItem("userData", JSON.stringify(usersData));

  setFormData({
    nomor: usersData[currentUser].data.length + 1, // Nomor bertambah otomatis
    tanggal: "",
    noInvKw: "",
    nilaiInvKw: "",
  });

  setSelectedCustomer(""); // Reset dropdown customer setelah penyimpanan

  alert("Data berhasil disimpan! Semua input telah direset.");
};



  /*const handleAddData = () => {
    if (!selectedCustomer) {
      alert("Pilih customer terlebih dahulu!");
      return;
    }

    const usersData = JSON.parse(localStorage.getItem("userData")) || {};
    if (!usersData[currentUser]) usersData[currentUser] = { data: [] };

    const newEntry = {
      nomor: usersData[currentUser].data.length + 1,
      tanggal: new Date().toISOString().slice(0, 10),
      customer: selectedCustomer,
      noInvKw: "INV999",
      nilaiInvKw: "500000",
    };

    usersData[currentUser].data.push(newEntry);
    localStorage.setItem("userData", JSON.stringify(usersData));

    alert(`Data baru berhasil ditambahkan ke customer ${selectedCustomer}`);
  };

  const handleDeleteData = () => {
    if (!selectedCustomer) {
      alert("Pilih customer terlebih dahulu!");
      return;
    }

    const usersData = JSON.parse(localStorage.getItem("userData")) || {};
    if (!usersData[currentUser]) return;

    usersData[currentUser].data = usersData[currentUser].data.filter(
      (entry) => entry.customer !== selectedCustomer
    );

    localStorage.setItem("userData", JSON.stringify(usersData));

    alert(`Semua data untuk customer ${selectedCustomer} telah dihapus!`);
  };


const handleExportData = () => {
  // Ambil data dari localStorage
  const usersData = JSON.parse(localStorage.getItem("userData")) || {};
  if (!usersData[currentUser] || usersData[currentUser].data.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  // Simpan data dalam format JSON (bisa juga ke file)
  const exportedData = JSON.stringify(usersData[currentUser].data, null, 2);
  console.log("Data yang diekspor:", exportedData);

  // Hapus semua data user setelah ekspor
  usersData[currentUser].data = [];
  localStorage.setItem("userData", JSON.stringify(usersData));

  // Reset nomor otomatis ke 0
  setFormData((prevData) => ({
    ...prevData,
    nomor: 0, // Reset nomor setelah ekspor
  }));

  alert("Data telah diekspor, semua data telah dihapus, dan nomor otomatis direset!");
};*/


  return (
    <div className="form-container">
      <h4 className="star-wars-title">Form Input Data</h4>

      {/* Hanya Admin yang bisa mengunggah data dan mengelola customer */}
      

      {fileUploaded && <p style={{ color: "green" }}>✅ File telah dikonfirmasi dan disimpan.</p>}

      <input type="text" name="nomor" value={formData.nomor} disabled placeholder="Nomor Otomatis" />
      <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
      <input type="text" name="noInvKw" value={formData.noInvKw} onChange={handleChange} placeholder="No Inv/Kw" />
      <input type="number" name="nilaiInvKw" value={formData.nilaiInvKw} onChange={handleChange} placeholder="Nilai Inv/Kw" />

      <button className="save-data" onClick={handleSave}>Simpan Data</button>
    </div>
  );
};

export default InputForm;
