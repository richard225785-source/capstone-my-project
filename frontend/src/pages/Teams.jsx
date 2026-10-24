import React, { useEffect, useState } from 'react';
import { getTeams, addTeam, deleteTeam } from '../api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', shortName: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTeams = async () => {
    try {
      const { data } = await getTeams();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.shortName.trim()) {
      return setError('Both team name and short name are required');
    }
    if (form.shortName.trim().length > 5) {
      return setError('Short name must be 5 characters or less');
    }

    setSubmitting(true);
    try {
      const { data } = await addTeam({
        name: form.name.trim(),
        shortName: form.shortName.trim(),
      });
      setTeams([data, ...teams]);
      setForm({ name: '', shortName: '' });
      setSuccess(`✅ Team "${data.name}" added successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add team');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTeam(deleteId);
      setTeams(teams.filter((t) => t._id !== deleteId));
      setSuccess('✅ Team deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete team');
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-title">👥 Team Management</div>

      {/* Add Team Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">➕ Add New Team</div>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Team Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Manchester United"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Short Name (max 5 chars)</label>
              <input
                type="text"
                name="shortName"
                placeholder="e.g. MUN"
                value={form.shortName}
                onChange={handleChange}
                maxLength={5}
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Adding...' : '➕ Add Team'}
            </button>
          </div>
        </form>
      </div>

      {/* Teams List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 All Teams ({teams.length})</div>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Teams Yet</h3>
            <p>Add your first team using the form above</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Short Name</th>
                  <th>Added On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{team.name}</strong>
                    </td>
                    <td>
                      <span className="team-badge">{team.shortName}</span>
                    </td>
                    <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => confirmDelete(team._id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Confirm Delete</h3>
            <p style={{ color: '#546e7a', marginBottom: '8px' }}>
              Are you sure you want to delete this team?
            </p>
            <p style={{ color: '#c62828', fontSize: '0.85rem' }}>
              ⚠️ This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
