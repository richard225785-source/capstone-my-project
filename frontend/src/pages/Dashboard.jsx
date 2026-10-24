import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../api';
import { getMatches } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ teams: 0, totalMatches: 0, completedMatches: 0, scheduledMatches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamsRes, matchesRes] = await Promise.all([getTeams(), getMatches()]);
        const teams = teamsRes.data;
        const matches = matchesRes.data;
        setStats({
          teams: teams.length,
          totalMatches: matches.length,
          completedMatches: matches.filter((m) => m.status === 'completed').length,
          scheduledMatches: matches.filter((m) => m.status === 'scheduled').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h2>👋 Welcome back, {admin?.name}!</h2>
        <p>📅 {today}</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.teams}</h3>
              <p>Total Teams</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚽</div>
            <div className="stat-info">
              <h3>{stats.totalMatches}</h3>
              <p>Total Matches</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completedMatches}</h3>
              <p>Completed Matches</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗓️</div>
            <div className="stat-info">
              <h3>{stats.scheduledMatches}</h3>
              <p>Scheduled Matches</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">⚡ Quick Actions</div>
        </div>
        <div className="quick-links">
          <Link to="/teams" className="quick-link-card">
            <div className="quick-link-icon">👥</div>
            <div>
              <h3>Team Management</h3>
              <p>Add or remove teams</p>
            </div>
          </Link>
          <Link to="/matches" className="quick-link-card">
            <div className="quick-link-icon">⚽</div>
            <div>
              <h3>Match Management</h3>
              <p>Schedule matches & enter scores</p>
            </div>
          </Link>
          <Link to="/points-table" className="quick-link-card">
            <div className="quick-link-icon">🏆</div>
            <div>
              <h3>Points Table</h3>
              <p>View current standings</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Info Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">ℹ️ Points System</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: '#e8f5e9', borderRadius: '8px', flex: 1, minWidth: '150px' }}>
            <span style={{ fontSize: '1.5rem' }}>🥇</span>
            <div>
              <div style={{ fontWeight: '700', color: '#2e7d32', fontSize: '1.2rem' }}>3 Points</div>
              <div style={{ fontSize: '0.85rem', color: '#66bb6a' }}>For a Win</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: '#f3e5f5', borderRadius: '8px', flex: 1, minWidth: '150px' }}>
            <span style={{ fontSize: '1.5rem' }}>🤝</span>
            <div>
              <div style={{ fontWeight: '700', color: '#7b1fa2', fontSize: '1.2rem' }}>1 Point</div>
              <div style={{ fontSize: '0.85rem', color: '#ab47bc' }}>For a Draw</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: '#ffebee', borderRadius: '8px', flex: 1, minWidth: '150px' }}>
            <span style={{ fontSize: '1.5rem' }}>❌</span>
            <div>
              <div style={{ fontWeight: '700', color: '#c62828', fontSize: '1.2rem' }}>0 Points</div>
              <div style={{ fontSize: '0.85rem', color: '#ef5350' }}>For a Loss</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
