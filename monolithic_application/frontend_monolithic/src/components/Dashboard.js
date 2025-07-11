import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          // If no user data in localStorage, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Failed to load user data');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
    
    // Call the onLogout callback if provided
    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Welcome to Your Dashboard</h1>
          <Link to="/" className="back-to-products">
            &larr; Back to Products
          </Link>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <div className="user-profile">
        <h2>Your Profile</h2>
        {userData && (
          <div className="profile-details">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
            {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
          </div>
        )}
      </div>
      
      <div className="dashboard-content">
        <h2>Your Data</h2>
        <div className="data-grid">
          {/* Add your data visualization components here */}
          <div className="data-card">
            <h3>Recent Activity</h3>
            <p>No recent activity to display.</p>
          </div>
          <div className="data-card">
            <h3>Statistics</h3>
            <p>No statistics available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
