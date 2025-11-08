// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Common/Navbar";
// import AdminPage from "./pages/AdminPage";
// import UserPage from "./pages/UserPage";
// import AdminLogin from "./pages/AdminLogin";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<h2 className="home">Welcome to AI Banking Chatbot 💬</h2>} />
//         <Route path="/admin" element={<AdminPage />} />
//          <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/user" element={<UserPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";
import HomePage from "./components/Home/HomePage";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: "85vh" }}>
        <Routes>
          <Route
            path="/"
            element={<HomePage/>}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
