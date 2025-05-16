import React, { useEffect } from "react";

const CustomerDropdown = ({ customers, onSelect, selectedCustomer }) => {
  // Reset dropdown setelah penyimpanan
  useEffect(() => {
    if (!selectedCustomer) {
      onSelect(""); // Set kembali ke "-- Pilih Customer --"
    }
  }, [selectedCustomer, onSelect]);

  return (
    <div className="dropdown-container">
      <label>Pilih Nama Customer:</label>
      <select value={selectedCustomer} onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Pilih Customer --</option>
        {customers.map((customer, index) => (
          <option key={index} value={customer}>{customer}</option>
        ))}
      </select>
    </div>
  );
};

export default CustomerDropdown;
