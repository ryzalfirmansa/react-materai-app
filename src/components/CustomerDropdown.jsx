import React, { useState } from "react";
import "./CustomerDropdown.css"; // Tambahkan CSS untuk tampilan dropdown

const CustomerDropdown = ({ customers, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk status dropdown terbuka

  // Filter daftar customer berdasarkan input pencarian
  const filteredCustomers = customers.filter(customer =>
    customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dropdown-container">
      <label>Pilih Nama Customer:</label>
      
      {/* Tombol untuk membuka dropdown */}
      <div className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {searchTerm || "-- Pilih Customer --"}
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="dropdown-menu">
          {/* Input Pencarian di dalam dropdown */}
          <input 
            type="text"
            placeholder="Cari Nama Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Daftar hasil pencarian */}
          <ul>
            {filteredCustomers.map((customer, index) => (
              <li key={index} onClick={() => { 
                onSelect(customer); 
                setSearchTerm(customer); 
                setDropdownOpen(false); // Tutup dropdown setelah dipilih
              }}>
                {customer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;
