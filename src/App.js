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
  const initializeUser = () => {
    const savedUser = localStorage.getItem("currentUser");
    const savedRole = localStorage.getItem("userRole") || "guest"; // Pastikan default ke 'guest'

    console.log("Status uploading:", uploading);

    if (savedUser) {
      setCurrentUser(savedUser);
      setUserRole(savedRole);
    }
  };

  const fetchCustomerData = async () => {
    try {
      await loadCustomerData(); // Ambil data pelanggan dari Firebase
    } catch (error) {
      console.error("Error mengambil data pelanggan:", error);
    }
  };

  initializeUser();
  fetchCustomerData(); // Pastikan daftar customer selalu diperbarui saat user login
}, []);


  
  // Simpan data pelanggan ke Firebase
const handleUpload = async (fileContent) => {
  setUploading(true); // Tampilkan progress bar
  
  try {
    await setDoc(doc(db, "customers", "customerData"), { data: fileContent });
    alert("File excel berhasil dikonversi ke JSON dan disimpan !");

    // Refresh halaman setelah user klik "OK"
    window.location.reload();
  } catch (error) {
    console.error("Error upload:", error);
    alert("Gagal mengunggah data.");
  } finally {
    setUploading(false); // Sembunyikan progress bar setelah selesai
  }
};

  // Ambil data pelanggan dari Firebase
const loadCustomerData = async () => {
  setUploading(true); // Tampilkan progress bar saat data dimuat

  try {
    const docRef = doc(db, "customers", "customerData");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && Array.isArray(docSnap.data().data)) {
      const rawData = docSnap.data().data;

      // Pastikan setiap entri memiliki field "Nama Customer"
      const customerNames = rawData.map(row => {
        if (row && row["Nama Customer"]) {
          return row["Nama Customer"];
        } else {
          console.warn("Data tidak memiliki field 'Nama Customer':", row);
          return null;
        }
      }).filter(name => name !== null); // Hapus entri yang tidak valid

      if (customerNames.length > 0) {
        setCustomerList(customerNames);
        setSelectedCustomer(customerNames[0]); // Pilih customer pertama sebagai default
        console.log("Data customer berhasil dimuat dari Firebase:", customerNames);
      } else {
        console.warn("Daftar customer kosong.");
        setCustomerList([]);
      }
    } else {
      console.warn("Data customer tidak ditemukan di Firestore.");
      setCustomerList([]);
    }
  } catch (error) {
    console.error("Error mengambil data pelanggan:", error);
    alert("Gagal mengambil data pelanggan dari Firebase.");
  } finally {
    setUploading(false); // Sembunyikan progress bar setelah selesai
  }
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
          <h2 className="welcome-text">Selamat datang, ({currentUser || "User"})</h2>


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
