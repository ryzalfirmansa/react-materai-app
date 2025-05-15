import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import MasterUpload from "./components/MasterUpload";
import CustomerDropdown from "./components/CustomerDropdown";
import InputForm from "./components/InputForm";
import HistoryPage from "./components/HistoryPage";
import CustomerManagement from "./components/CustomerManagement";
import "./App.css";

function App() {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomerManagement, setShowCustomerManagement] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedRole = localStorage.getItem("userRole");

    if (savedUser) {
      setCurrentUser(savedUser);
      setUserRole(savedRole || "guest");
    }

    const savedCustomers = localStorage.getItem("customerList");
    if (savedCustomers) {
      setCustomerList(JSON.parse(savedCustomers));
    }

    if (savedUser) {
      const usersData = JSON.parse(localStorage.getItem("userData")) || {};
      setHasData(usersData[savedUser]?.data?.length > 0);
    }
  }, []);

  const handleLogin = (username, role) => {
    setCurrentUser(username);
    setUserRole(role);
    localStorage.setItem("currentUser", username);
    localStorage.setItem("userRole", role);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
    setUserRole("guest");
    setSelectedCustomer("");
  };

  const handleDataLoaded = (data) => {
    const customers = data.map((row) => row["Nama Customer"]);
    setCustomerList(customers);
    localStorage.setItem("customerList", JSON.stringify(customers));
  };

const handleDataSaved = () => {
  if (!currentUser) return;

  const usersData = JSON.parse(localStorage.getItem("userData")) || {};
  setHasData(usersData[currentUser]?.data?.length > 0);
};


  const handleDeleteCustomer = (index) => {
    const updatedCustomers = [...customerList];
    updatedCustomers.splice(index, 1);
    setCustomerList(updatedCustomers);
    localStorage.setItem("customerList", JSON.stringify(updatedCustomers));
    alert("Customer berhasil dihapus!");
  };

  const handleDeleteAllCustomers = () => {
    setCustomerList([]); // Reset daftar customer di state
    localStorage.removeItem("customerList"); // Hapus dari localStorage
    alert("Semua data customer telah dihapus!");
  };


  const handleAddCustomer = (customerName) => {
    if (!customerName.trim()) {
      alert("Nama customer tidak boleh kosong!");
      return;
    }

    const updatedCustomers = [...customerList, customerName];
    setCustomerList(updatedCustomers);
    localStorage.setItem("customerList", JSON.stringify(updatedCustomers));
    alert(`Customer "${customerName}" berhasil ditambahkan!`);
  };

  const [customers, setCustomers] = useState([]); // Pastikan daftar customer ada di App.js


  return (
    <div className="App">
      {!currentUser ? (
        <LoginForm onLogin={handleLogin} />
      ) : showHistory ? (
        <HistoryPage 
          currentUser={currentUser} 
           
          onBack={() => setShowHistory(false)} 
        />
      ) : showCustomerManagement ? (
        <CustomerManagement
          customerList={customerList}
          onAddCustomer={handleAddCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onDeleteAllCustomers={handleDeleteAllCustomers} // Pastikan fungsi dikirim
          onBack={() => setShowCustomerManagement(false)}
        />
      ) : (
        <>
          <h2 className="star-wars-title">
            Selamat datang, ({userRole.toUpperCase()})
          </h2>

          {userRole === "admin" && <MasterUpload onDataLoaded={handleDataLoaded} />}

          {customerList.length > 0 && (
            <CustomerDropdown
              customers={customerList}
              onSelect={setSelectedCustomer}
              selectedCustomer={selectedCustomer}
            />
          )}

          {selectedCustomer && (
            <InputForm
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer} // Kirim fungsi reset ke InputForm.jsx
              currentUser={currentUser}
              userRole={userRole}
              customers={customers} // Kirim daftar customer
              onDataSaved={() => setSelectedCustomer("")} // Reset customer setelah data disimpan
            />

          )}

          <div className="user-actions">
            {userRole === "admin" && (
              <button className="manage-button" onClick={() => setShowCustomerManagement(true)}>Kelola Data Customer</button>
            )}
            <button className="history-button" onClick={() => setShowHistory(true)}>Lihat Histori</button>
            
          </div>

          <div className="logout-section">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
