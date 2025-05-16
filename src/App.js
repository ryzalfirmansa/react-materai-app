import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import MasterUpload from "./components/MasterUpload";
import CustomerDropdown from "./components/CustomerDropdown";
import InputForm from "./components/InputForm";
import HistoryPage from "./components/HistoryPage";
import CustomerManagement from "./components/CustomerManagement";
import "./App.css";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";



// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCgkP84T1GqeMBlcnn-f_H1OkF94rUhdZM",
  authDomain: "react-materai.firebaseapp.com",
  projectId: "react-materai",
  storageBucket: "react-materai.firebasestorage.app",
  messagingSenderId: "50155200415",
  appId: "1:50155200415:web:868941f54de7feb3f1e7aa",
  measurementId: "G-M6DESRJWPG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomerManagement, setShowCustomerManagement] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("guest");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    
    const savedUser = localStorage.getItem("currentUser");
    const savedRole = localStorage.getItem("userRole");
    console.log("Status uploading:", uploading);

    if (savedUser) {
      setCurrentUser(savedUser);
      setUserRole(savedRole || "guest");
    }

    loadCustomerData(); // Ambil data pelanggan dari Firebase saat halaman dimuat
  }, [uploading]);


  
  // Simpan data pelanggan ke Firebase
const handleUpload = async (fileContent) => {
  setUploading(true); // Tampilkan progress bar
  
  try {
    await setDoc(doc(db, "customers", "customerData"), { data: fileContent });

    // Cek apakah halaman sudah direfresh sebelumnya
    if (!sessionStorage.getItem("hasRefreshed")) {
      alert("File templatetest.xlsx berhasil dikonversi ke JSON dan disimpan di Firebase!");
      sessionStorage.setItem("hasRefreshed", "true");

      // Refresh hanya sekali setelah user klik "OK"
      window.location.reload();
    }
  } catch (error) {
    console.error("Error upload:", error);
    alert("Gagal mengunggah data.");
  } finally {
    setUploading(false); // Sembunyikan progress bar setelah selesai
  }
};



  // Ambil data pelanggan dari Firebase
const loadCustomerData = async () => {
  setUploading(true); // Tampilkan progress bar
  
  const docRef = doc(db, "customers", "customerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setCustomerList(docSnap.data().data.map(row => row["Nama Customer"]));
    localStorage.setItem("customerList", JSON.stringify(docSnap.data().data.map(row => row["Nama Customer"])));
    alert("Data customer berhasil dimuat dari Firebase!");
  } else {
    alert("Data tidak ditemukan.");
  }

  setUploading(false); // Sembunyikan progress bar setelah selesai
};


const handleDeleteCustomer = async (index) => {
  if (customerList.length === 0) return;

  const deletedCustomer = customerList[index];

  // Hapus dari Firestore
  const docRef = doc(db, "customers", "customerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const newCustomerList = docSnap.data().data.filter((customer) => customer["Nama Customer"] !== deletedCustomer);
    await updateDoc(docRef, { data: newCustomerList });

    // Hapus dari state dengan benar
    setCustomerList((prevList) => {
      const updatedList = prevList.filter((_, i) => i !== index);
      localStorage.setItem("customerList", JSON.stringify(updatedList));
      return updatedList;
    });
  }
};


const handleDeleteAllCustomers = async () => {
  if (customerList.length === 0) return;

  // Hapus semua data di Firestore
  const docRef = doc(db, "customers", "customerData");
  await setDoc(docRef, { data: [] });

  // Kosongkan dari state dan local storage dengan benar
  setCustomerList([]);
  localStorage.removeItem("customerList");
};


  return (
    <div className="App">
      {!currentUser ? (
        <LoginForm onLogin={(username, role) => {
          setCurrentUser(username);
          setUserRole(role);
          localStorage.setItem("currentUser", username);
          localStorage.setItem("userRole", role);
        }} />
      ) : showHistory ? (
        <HistoryPage currentUser={currentUser} onBack={() => setShowHistory(false)} />
      ) : showCustomerManagement ? (
        <CustomerManagement 
          customerList={customerList} 
          setCustomerList={setCustomerList} // Tambahkan ini!
          onBack={() => setShowCustomerManagement(false)} 
        />

      ) : (

         <>
        {/* Progress Bar */}
        {uploading && (
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
            <p>Proses sedang berlangsung...</p>
          </div>
        )}
          <h2 className="star-wars-title">Selamat datang, ({userRole.toUpperCase()})</h2>

          {userRole === "admin" && <MasterUpload onUpload={handleUpload} onLoad={loadCustomerData} setUploading={setUploading} setCustomerList={setCustomerList} />}


          {customerList.length > 0 && (
            <CustomerDropdown customers={customerList} onSelect={setSelectedCustomer} selectedCustomer={selectedCustomer} />
          )}

          {selectedCustomer && (
            <InputForm selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} currentUser={currentUser} userRole={userRole} customers={customerList} />
          )}

          <div className="user-actions">
            {userRole === "admin" && <button className="manage-button" onClick={() => setShowCustomerManagement(true)}>Kelola Data Customer</button>}
            <button className="history-button" onClick={() => setShowHistory(true)}>Lihat Histori</button>
          </div>

          <div className="logout-section">
            <button className="logout-button" onClick={() => {
              localStorage.removeItem("currentUser");
              localStorage.removeItem("userRole");
              setCurrentUser(null);
              setUserRole("guest");
              setSelectedCustomer("");
            }}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
