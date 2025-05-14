import React, { useState } from "react";

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("Username dan password tidak boleh kosong!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      alert("Username sudah digunakan, pilih yang lain!");
      return;
    }

    users[username] = { password, data: [] }; // Simpan user dengan histori kosong
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registrasi berhasil! Silakan login.");
    onRegister(username);
  };

  return (
    <div className="register-container">
      <h2>Registrasi User</h2>
      <input 
        type="text" 
        placeholder="Masukkan Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Masukkan Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Daftar</button>
    </div>
  );
};

export default RegisterForm;
