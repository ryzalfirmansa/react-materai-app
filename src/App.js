import React, { useState, useEffect } from "react";
import MasterUpload from "./components/MasterUpload";
import CustomerDropdown from "./components/CustomerDropdown";
import InputForm from "./components/InputForm";
import HistoryTable from "./components/HistoryTable";
import "./App.css";

function App() {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Memuat daftar customer dari LocalStorage saat aplikasi pertama kali dijalankan
  useEffect(() => {
    const savedCustomers = localStorage.getItem("customerList");
    if (savedCustomers) {
      setCustomerList(JSON.parse(savedCustomers));
    }
  }, []);

  // Mengambil data dari file Excel yang diunggah
  const handleDataLoaded = (data) => {
    const customers = data.map((row) => row["Nama Customer"]); // Ambil kolom 'Nama Customer'
    setCustomerList(customers);
    localStorage.setItem("customerList", JSON.stringify(customers)); // Simpan daftar customer ke LocalStorage
  };

  return (
    <div className="App">
      <h2>Input Data Materai</h2>

      {/* Komponen Upload File Master */}
      <MasterUpload onDataLoaded={handleDataLoaded} />

      {/* Komponen Dropdown Nama Customer */}
      {customerList.length > 0 && (
        <CustomerDropdown customers={customerList} onSelect={setSelectedCustomer} />
      )}

      {/* Form Input untuk menyimpan data */}
      {selectedCustomer && <InputForm selectedCustomer={selectedCustomer} />}

      {/* Komponen Data Histori */}
      <HistoryTable />
    </div>
  );
}

export default App;
