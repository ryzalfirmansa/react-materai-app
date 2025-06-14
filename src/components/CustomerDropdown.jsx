import React, { useEffect, useState } from "react";

const CustomerDropdown = ({ customers, onSelect, selectedCustomer, resetDropdown }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian

  // Reset dropdown dan pencarian setelah halaman di-refresh atau data disimpan
  useEffect(() => {
    if (resetDropdown) {
      setSearchTerm(""); // Reset kolom pencarian
      onSelect(""); // Reset pilihan customer ke default
    }
  }, [resetDropdown]);

  // Filter daftar customer berdasarkan input pencarian
  const filteredCustomers = customers.filter(customer =>
    customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dropdown-container">
      <label>Pilih Nama Customer:</label>
      {/* Input untuk pencarian di atas dropdown */}
      <input 
        type="text"
        placeholder="Cari Nama Customer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {/* Dropdown dengan hasil pencarian */}
      <select value={selectedCustomer} onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Pilih Customer --</option>
        {filteredCustomers.map((customer, index) => (
          <option key={index} value={customer}>{customer}</option>
        ))}
      </select>
    </div>
  );
};

export default CustomerDropdown;
