import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import MasterUpload from "./components/MasterUpload";
import CustomerDropdown from "./components/CustomerDropdown";
import InputForm from "./components/InputForm";
import HistoryPage from "./components/HistoryPage";
import CustomerManagement from "./components/CustomerManagement"; // Tambahkan halaman baru
import "./App.css";

function App() {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomerManagement, setShowCustomerManagement] = useState(false); // State untuk halaman manajemen
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
    setSelectedCustomer("");
  };

  const handleDeleteCustomer = (index) => {
    const updatedCustomers = [...customerList];
    updatedCustomers.splice(index, 1);
    setCustomerList(updatedCustomers);
    localStorage.setItem("customerList", JSON.stringify(updatedCustomers));
    alert("Customer berhasil dihapus!");
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

  const handleDeleteAllCustomers = () => {
  const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus semua data customer?");
  if (!confirmDelete) return;

  setCustomerList([]);
  localStorage.removeItem("customerList");

  alert("Semua data customer telah dihapus!");
};


  return (
    <div className="App">
      {!currentUser ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <h2 className="star-wars-title">
            Selamat datang, {currentUser} ({userRole.toUpperCase()})
          </h2>

          {!showCustomerManagement ? (
            <>
              {userRole === "admin" && (
                <button className="manage-button" onClick={() => setShowCustomerManagement(true)}>
                  Kelola Data Customer
                </button>
              )}

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
                  currentUser={currentUser}
                  userRole={userRole}
                  onDataSaved={handleDataSaved}
                />
              )}

              {hasData && <button className="view-data-button" onClick={() => setShowHistory(true)}>View Data</button>}
              <button className="spaced-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <CustomerManagement 
              customerList={customerList} 
              onAddCustomer={handleAddCustomer} // Fungsi untuk menambah customer
              onDeleteCustomer={handleDeleteCustomer} // Fungsi untuk menghapus customer
               onDeleteAllCustomers={handleDeleteAllCustomers} // Kirim fungsi hapus semua
              onBack={() => setShowCustomerManagement(false)} 
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
