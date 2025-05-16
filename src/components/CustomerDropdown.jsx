import React, { useEffect, useState } from "react";

const CustomerDropdown = ({ customers, onSelect, selectedCustomer }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian

  useEffect(() => {
    if (!selectedCustomer) {
      onSelect(""); // Set kembali ke "-- Pilih Customer --"
    }
  }, [selectedCustomer, onSelect]);

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
