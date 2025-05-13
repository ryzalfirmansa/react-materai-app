import React, { useState, useEffect } from "react";

const InputForm = ({ selectedCustomer, onDataSaved }) => {
  const getNextNumber = () => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    return savedData.length + 1;
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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    const newEntry = { ...formData, customer: selectedCustomer };
    savedData.push(newEntry);
    localStorage.setItem("savedData", JSON.stringify(savedData));

    if (onDataSaved) {
      onDataSaved();
    }

    setFormData({
      nomor: getNextNumber(),
      tanggal: new Date().toISOString().slice(0, 10),
      noInvKw: "",
      nilaiInvKw: "",
    });

    alert("Data berhasil disimpan!");
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
