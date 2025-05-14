import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user"); // Default sebagai User Biasa
  const [password, setPassword] = useState(""); // Tambahkan input password

const handleLogin = () => {
  if (username.trim() === "") {
    alert("Masukkan username!");
    return;
  }

  // Jika user memilih "Admin", maka password wajib diisi
  if (role === "admin" && password !== "admin123") {
    alert("Password salah! Silakan coba lagi.");
    return;
  }

  localStorage.setItem("currentUser", username);
  localStorage.setItem("userRole", role); // Simpan peran user dengan benar
  onLogin(username, role);
};

  return (
    <div className="login-container">
      <h3>Masuk sebagai</h3>
      
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Kasir</option>
        <option value="user">Collector</option>
        <option value="guest">Guest</option>
      </select>

      <input className="user-name"
        type="text" 
        placeholder="Masukkan Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Tampilkan input password hanya jika user memilih Admin */}
      {role === "admin" && (
        <input className="pass-word"
          type="password" 
          placeholder="Masukkan Password Admin" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <button className="login-button" onClick={handleLogin}>Masuk</button>
    </div>
  );
};

export default LoginForm;
