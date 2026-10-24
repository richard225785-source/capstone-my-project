import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { admin } = useAuth();

  return (
    <div className="home-hero">
      <div className="home-trophy">🏆</div>
      <h1>Tournament Management System</h1>
      <p>
        Manage your sports tournament with ease. Add teams, schedule matches, 
        track scores, and view live standings — all in one place.
      </p>

      <div className="home-buttons">
        {admin ? (
          <Link to="/dashboard" className="btn btn-white">
            🏠 Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-white">
              🔑 Admin Login
            </Link>
            <Link to="/signup" className="btn btn-outline-white">
              ✨ Create Account
            </Link>
          </>
        )}
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Team Management</h3>
          <p>Add and manage teams participating in the tournament</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚽</div>
          <h3>Match Scheduling</h3>
          <p>Create and schedule matches between registered teams</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Live Standings</h3>
          <p>Automatic points calculation with live rankings table</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Admin Panel</h3>
          <p>JWT-protected admin access for full tournament control</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
