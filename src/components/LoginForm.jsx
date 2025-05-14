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
    localStorage.setItem("userRole", role); // Simpan peran user
    onLogin(username, role);
  };

  return (
    <div className="login-container">
      <h2>Masuk sebagai</h2>
      
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="user">User Biasa</option>
        <option value="guest">Guest</option>
      </select>

      <input 
        type="text" 
        placeholder="Masukkan Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Tampilkan input password hanya jika user memilih Admin */}
      {role === "admin" && (
        <input 
          type="password" 
          placeholder="Masukkan Password Admin" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <button className="spaced-button" onClick={handleLogin}>Masuk</button>
    </div>
  );
};

export default LoginForm;
