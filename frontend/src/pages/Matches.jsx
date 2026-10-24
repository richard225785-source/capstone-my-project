import React, { useEffect, useState } from 'react';
import { getTeams, getMatches, createMatch, updateScore, deleteMatch } from '../api';

const Matches = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ teamA: '', teamB: '', matchDate: '' });
  const [scores, setScores] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([getTeams(), getMatches()]);
      setTeams(teamsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.teamA || !form.teamB) {
      return setError('Please select both teams');
    }
    if (form.teamA === form.teamB) {
      return setError('Please select two different teams');
    }

    setSubmitting(true);
    try {
      const payload = { teamA: form.teamA, teamB: form.teamB };
      if (form.matchDate) payload.matchDate = form.matchDate;
      const { data } = await createMatch(payload);
      setMatches([data, ...matches]);
      setForm({ teamA: '', teamB: '', matchDate: '' });
      setSuccess('✅ Match created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScoreChange = (matchId, field, value) => {
    setScores({ ...scores, [matchId]: { ...scores[matchId], [field]: value } });
  };

  const handleUpdateScore = async (matchId) => {
    const matchScore = scores[matchId];
    if (!matchScore || matchScore.scoreA === undefined || matchScore.scoreB === undefined ||
        matchScore.scoreA === '' || matchScore.scoreB === '') {
      return setError('Please enter scores for both teams');
    }

    setUpdatingId(matchId);
    setError('');
    try {
      const { data } = await updateScore(matchId, {
        scoreA: Number(matchScore.scoreA),
        scoreB: Number(matchScore.scoreB),
      });
      setMatches(matches.map((m) => (m._id === matchId ? data : m)));
      setScores({ ...scores, [matchId]: {} });
      setSuccess('✅ Score updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update score');
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMatch(deleteId);
      setMatches(matches.filter((m) => m._id !== deleteId));
      setSuccess('✅ Match deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete match');
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-title">⚽ Match Management</div>

      {/* Create Match Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">➕ Schedule New Match</div>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {teams.length < 2 ? (
          <div className="alert alert-error">
            ⚠️ You need at least 2 teams to create a match. Please add teams first.
          </div>
        ) : (
          <form onSubmit={handleCreateMatch}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Team A</label>
                <select name="teamA" value={form.teamA} onChange={handleFormChange}>
                  <option value="">Select Team A</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Team B</label>
                <select name="teamB" value={form.teamB} onChange={handleFormChange}>
                  <option value="">Select Team B</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Match Date (Optional)</label>
                <input
                  type="date"
                  name="matchDate"
                  value={form.matchDate}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '⏳ Creating...' : '➕ Create Match'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Matches List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 All Matches ({matches.length})</div>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <h3>No Matches Yet</h3>
            <p>Create your first match using the form above</p>
          </div>
        ) : (
          <div>
            {matches.map((match) => (
              <div key={match._id} className={`match-card ${match.status === 'completed' ? 'completed' : ''}`}>
                {/* Match Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`badge badge-${match.status}`}>
                      {match.status === 'completed' ? '✅ Completed' : '🗓️ Scheduled'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#90a4ae' }}>
                      {new Date(match.matchDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div className="match-teams">
                  <div className="match-team">
                    <div className="match-team-name">{match.teamA?.name}</div>
                    <span className="match-team-badge">{match.teamA?.shortName}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {match.status === 'completed' ? (
                      <div className="match-score">
                        {match.scoreA} - {match.scoreB}
                      </div>
                    ) : (
                      <div className="match-vs">VS</div>
                    )}
                    {match.status === 'completed' && (
                      <div className="match-result-badge">
                        {match.isDraw ? (
                          <span className="badge badge-draw">🤝 Draw</span>
                        ) : (
                          <span className="badge badge-winner">🏆 {match.winner?.name} wins!</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="match-team">
                    <div className="match-team-name">{match.teamB?.name}</div>
                    <span className="match-team-badge">{match.teamB?.shortName}</span>
                  </div>
                </div>

                {/* Score Entry (for scheduled matches) */}
                {match.status === 'scheduled' && (
                  <div className="score-form">
                    <div className="score-input-group">
                      <label>{match.teamA?.shortName} Score:</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={scores[match._id]?.scoreA ?? ''}
                        onChange={(e) => handleScoreChange(match._id, 'scoreA', e.target.value)}
                      />
                    </div>
                    <div className="score-input-group">
                      <label>{match.teamB?.shortName} Score:</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={scores[match._id]?.scoreB ?? ''}
                        onChange={(e) => handleScoreChange(match._id, 'scoreB', e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateScore(match._id)}
                      disabled={updatingId === match._id}
                    >
                      {updatingId === match._id ? '⏳ Saving...' : '✅ Save Score'}
                    </button>
                  </div>
                )}

                {/* Delete Button */}
                <div className="match-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmDelete(match._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Confirm Delete</h3>
            <p style={{ color: '#546e7a', marginBottom: '8px' }}>
              Are you sure you want to delete this match?
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

export default Matches;
