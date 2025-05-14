import React, { useState, useEffect } from "react";

const InputForm = ({ selectedCustomer, currentUser, userRole, onDataSaved }) => {
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

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      nomor: getNextNumber(),
    }));
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[currentUser]) users[currentUser] = { password: users[currentUser]?.password || "", data: [] };

    const newEntry = { ...formData, customer: selectedCustomer };
    users[currentUser].data.push(newEntry);
    localStorage.setItem("users", JSON.stringify(users));

    if (onDataSaved) {
      onDataSaved();
    }

    setFormData({
      nomor: getNextNumber(),
      tanggal: new Date().toISOString().slice(0, 10),
      noInvKw: "",
      nilaiInvKw: "",
    });

    alert(`Data berhasil disimpan untuk user: ${currentUser}`);
  };

  const handleAddData = () => {
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
    nilaiInvKw: "500000"
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


  return (
    <div className="form-container">
      <h4 className="star-wars-title">Form Input Data</h4>
      <input type="text" name="nomor" value={formData.nomor} disabled placeholder="Nomor Otomatis" />
      <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
      <input type="text" name="noInvKw" value={formData.noInvKw} onChange={handleChange} placeholder="No Inv/Kw" />
      <input type="number" name="nilaiInvKw" value={formData.nilaiInvKw} onChange={handleChange} placeholder="Nilai Inv/Kw" />

      <button onClick={handleSave}>Simpan Data</button>
    </div>
  );
};

export default InputForm;
