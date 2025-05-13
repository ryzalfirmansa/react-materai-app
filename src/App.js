import React, { useState, useEffect } from "react";
import MasterUpload from "./components/MasterUpload";
import CustomerDropdown from "./components/CustomerDropdown";
import InputForm from "./components/InputForm";
import HistoryPage from "./components/HistoryPage";
import "./App.css";

function App() {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [hasData, setHasData] = useState(false); // Cek apakah ada histori inputan

  useEffect(() => {
    const savedCustomers = localStorage.getItem("customerList");
    if (savedCustomers) {
      setCustomerList(JSON.parse(savedCustomers));
    }

    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    setHasData(savedData.length > 0);
  }, []);

  const handleDataLoaded = (data) => {
    const customers = data.map((row) => row["Nama Customer"]);
    setCustomerList(customers);
    localStorage.setItem("customerList", JSON.stringify(customers));
  };

  const handleDataSaved = () => {
    const savedData = JSON.parse(localStorage.getItem("savedData")) || [];
    setHasData(savedData.length > 0);
    setSelectedCustomer(""); // Reset pilihan nama customer setelah menyimpan data
  };

  return (
    <div className="App">
      <h2 className="star-wars-title">Input Data Materai</h2>

      {!showHistory ? (
        <>
          <MasterUpload onDataLoaded={handleDataLoaded} />
          {customerList.length > 0 && (
            <CustomerDropdown customers={customerList} onSelect={setSelectedCustomer} selectedCustomer={selectedCustomer} />
          )}

          {selectedCustomer && <InputForm selectedCustomer={selectedCustomer} onDataSaved={handleDataSaved} />}

          {hasData && <button className="view-data-button" onClick={() => setShowHistory(true)}>View Data</button>}

        </>
      ) : (
        <HistoryPage onBack={() => setShowHistory(false)} />
      )}
    </div>
  );
}

export default App;
