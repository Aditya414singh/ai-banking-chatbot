import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">🏦 AI Banking Chatbot</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/user/">User</Link>
      </div>
    </nav>
  );
};

export default Navbar;
