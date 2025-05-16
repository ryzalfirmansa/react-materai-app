import React from "react";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

const CustomerManagement = ({ customerList, setCustomerList, onBack }) => {
const handleDeleteCustomer = async (index) => {
  if (customerList.length === 0) return;

  const docRef = doc(db, "customers", "customerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const newCustomerList = customerList.filter((_, i) => i !== index);
    await updateDoc(docRef, { data: newCustomerList });

    setCustomerList(newCustomerList);
    localStorage.setItem("customerList", JSON.stringify(newCustomerList));
  }
};


  const handleDeleteAllCustomers = async () => {
    if (customerList.length === 0) return;

    // Hapus semua data di Firestore
    const docRef = doc(db, "customers", "customerData");
    await setDoc(docRef, { data: [] });

    // Kosongkan dari state dan Local Storage
    setCustomerList([]);
    localStorage.removeItem("customerList");
  };

  return (
    <div className="customer-management-container">
      <h2>Manajemen Data Customer</h2>

      {customerList.length > 0 ? (
        <>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Nomor</th>
                <th>Nama Customer</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((customer, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{customer}</td>
                    <td>
                      <button className="delete-button" onClick={() => handleDeleteCustomer(index)}>Hapus</button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button className="delete-all-button" onClick={handleDeleteAllCustomers}>Hapus Semua Data</button>
        </>
      ) : (
        <p>Tidak ada data customer yang tersimpan.</p>
      )}

      <button className="back-button" onClick={onBack}>Kembali</button>
    </div>
  );
};

export default CustomerManagement;
