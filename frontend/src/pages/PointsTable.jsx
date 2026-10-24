import React, { useEffect, useState } from 'react';
import { getPointsTable } from '../api';

const PointsTable = () => {
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const { data } = await getPointsTable();
        setTable(data);
      } catch (err) {
        setError('Failed to load points table');
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, []);

  const getRankBadge = (rank) => {
    const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
    const icon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    return <span className={`rank-badge ${cls}`}>{icon}</span>;
  };

  return (
    <div className="page-container">
      <div className="page-title">🏆 Points Table</div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">📊 Current Standings</div>
          <div style={{ fontSize: '0.85rem', color: '#90a4ae' }}>
            Win = 3 pts | Draw = 1 pt | Loss = 0 pts
          </div>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : table.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No Data Available</h3>
            <p>Add teams and play some matches to see the standings</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, index) => (
                  <tr key={row.team.id} style={index === 0 ? { background: '#fff8e1' } : {}}>
                    <td>{getRankBadge(index + 1)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="team-badge" style={{ width: '40px', height: '40px', fontSize: '0.65rem' }}>
                          {row.team.shortName}
                        </span>
                        <strong>{row.team.name}</strong>
                      </div>
                    </td>
                    <td>{row.played}</td>
                    <td style={{ color: '#2e7d32', fontWeight: '600' }}>{row.won}</td>
                    <td style={{ color: '#6a1b9a', fontWeight: '600' }}>{row.drawn}</td>
                    <td style={{ color: '#c62828', fontWeight: '600' }}>{row.lost}</td>
                    <td>{row.goalsFor}</td>
                    <td>{row.goalsAgainst}</td>
                    <td style={{ color: row.goalDifference >= 0 ? '#2e7d32' : '#c62828', fontWeight: '600' }}>
                      {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                    </td>
                    <td><span className="points-highlight">{row.points}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📖 Legend</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.875rem', color: '#546e7a' }}>
          <span><strong>P</strong> = Played</span>
          <span><strong>W</strong> = Won</span>
          <span><strong>D</strong> = Drawn</span>
          <span><strong>L</strong> = Lost</span>
          <span><strong>GF</strong> = Goals For</span>
          <span><strong>GA</strong> = Goals Against</span>
          <span><strong>GD</strong> = Goal Difference</span>
          <span><strong>Pts</strong> = Points</span>
        </div>
      </div>
    </div>
  );
};

export default PointsTable;
