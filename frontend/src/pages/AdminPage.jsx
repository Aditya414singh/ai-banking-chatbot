// // src/pages/AdminPage.jsx
// import React, { useState } from "react";
// import UploadDocs from "../components/Admin/UploadDocs";
// import BranchForm from "../components/Admin/BranchForm";
// import "./AdminPage.css";

// const AdminPage = () => {
//   const [activeTab, setActiveTab] = useState("docs");

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     window.location.href = "/admin/login";
//   };

//   return (
//     <div className="admin-dashboard">
//       <div className="dashboard-header">
//         <h2>Admin Dashboard</h2>
//         <button className="logout-btn" onClick={handleLogout}>Logout</button>
//       </div>

//       <div className="tab-buttons">
//         <button
//           className={activeTab === "docs" ? "active" : ""}
//           onClick={() => setActiveTab("docs")}
//         >
//           Upload Docs
//         </button>
//         <button
//           className={activeTab === "branch" ? "active" : ""}
//           onClick={() => setActiveTab("branch")}
//         >
//           Branch Info
//         </button>
//       </div>

//       <div className="tab-content">
//         {activeTab === "docs" ? <UploadDocs /> : <BranchForm />}
//       </div>
//     </div>
//   );
// };

// export default AdminPage;







// src/pages/AdminPage.jsx
import React, { useState } from "react";
// Components from your original file
import UploadDocs from "../components/Admin/UploadDocs";
import BranchForm from "../components/Admin/BranchForm";
// New components for the enhanced dashboard
import AnalyticsDashboard from "../components/Admin/AnalyticsDashboard"; // New!

import "./AdminPage.css";

const AdminPage = () => {
  // Set the default active tab to "stats" (the main analytics view)
  const [activeTab, setActiveTab] = useState("stats");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <AnalyticsDashboard />;
      case "docs":
        return <UploadDocs />;
      case "branch":
        return <BranchForm />;
      // You can add more tabs here, e.g., "settings" or "logs"
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="admin-container">
      {/* Optional: Use a sidebar instead of top tabs for better UI space 
        If you stick to top tabs, replace AdminSidebar with a simple wrapper div
      */}
      <div className="admin-sidebar-nav">
        <div className="sidebar-header">
          <h2>Banking AI Admin</h2>
        </div>
        <div className="tab-buttons">
          <button
            className={activeTab === "stats" ? "active" : ""}
            onClick={() => setActiveTab("stats")}
          >
            📊 Analytics Overview
          </button>
          <button
            className={activeTab === "docs" ? "active" : ""}
            onClick={() => setActiveTab("docs")}
          >
            📑 Knowledge Base
          </button>
          <button
            className={activeTab === "branch" ? "active" : ""}
            onClick={() => setActiveTab("branch")}
          >
            🏦 Branch Configuration
          </button>
        </div>
      </div>

      <div className="admin-dashboard-main">
        <div className="dashboard-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
