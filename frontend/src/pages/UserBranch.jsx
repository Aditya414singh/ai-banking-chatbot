import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserBranch.css";

const UserBranch = () => {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [selectedIFSC, setSelectedIFSC] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/branches');
        
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        
        const data = await response.json();
        setBranches(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.ifsc.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (!selectedIFSC) {
      alert("Please select a branch");
      return;
    }
    navigate(`/user/chat?ifsc=${selectedIFSC}`);
  };

  return (
    <div className="branch-page">
      <div className="branch-card">
        <img src="/assets/bank.png" alt="bank" className="branch-icon" />

        <h2>Select Your Bank Branch</h2>
        <p className="subtitle">
          Choose your IFSC code so Astra can give branch-specific answers.
        </p>

        {/* Loading State */}
        {loading && <p className="loading-text">Loading branches...</p>}

        {/* Error State */}
        {error && <p className="error-text">{error}</p>}

        {/* Main UI */}
        {!loading && !error && (
          <>
            <input
              type="text"
              className="search-input"
              placeholder="Search by branch or IFSC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="branch-select"
              value={selectedIFSC}
              onChange={(e) => setSelectedIFSC(e.target.value)}
            >
              <option value="">Choose your branch</option>
              {filteredBranches.map((b) => (
                <option key={b.id} value={b.ifsc}>
                  {b.name} — {b.ifsc}
                </option>
              ))}
            </select>

            <button className="continue-btn ripple" onClick={handleContinue}>
              Continue ➜
            </button>
          </>
        )}

        {/* No branches message */}
        {!loading && !error && branches.length === 0 && (
          <p className="error-text">No branches available.</p>
        )}
      </div>
    </div>
  );
};

export default UserBranch;