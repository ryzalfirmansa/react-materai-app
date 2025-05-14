import React from "react";

const CustomerManagement = ({ customerList, onDeleteCustomer, onDeleteAllCustomers, onBack }) => {
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
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{customer}</td>
                  <td>
                    <button className="delete-button" onClick={() => onDeleteCustomer(index)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="delete-all-button" onClick={onDeleteAllCustomers}>Hapus Semua Data</button>
        </>
      ) : (
        <p>Tidak ada data customer yang tersimpan.</p>
      )}

      <button className="back-button" onClick={onBack}>Kembali</button>
    </div>
  );
};

export default CustomerManagement;
