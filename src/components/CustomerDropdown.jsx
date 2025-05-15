import React from "react";

const CustomerDropdown = ({ customers, onSelect, selectedCustomer }) => {
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
