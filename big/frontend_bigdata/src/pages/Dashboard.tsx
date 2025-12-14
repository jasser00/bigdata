import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getHistory, StatsResponse, PredictionHistory } from '../api/prediction';

const Dashboard = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          getStats(),
          getHistory()
        ]);
        setStats(statsData);
        // Get last 5 predictions
        setRecentPredictions(historyData.slice(-5).reverse());
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="page-subtitle">Overview of your machine maintenance predictions</p>
      </div>

      {error && (
        <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📈</div>
          <div className="stat-value">{stats?.total_predictions || 0}</div>
          <div className="stat-label">Total Predictions</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">⚙️</div>
          <div className="stat-value">{stats?.unique_machines || 0}</div>
          <div className="stat-label">Unique Machines</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">📊</div>
          <div className="stat-value">{stats?.avg_prediction?.toFixed(2) || '0.00'}</div>
          <div className="stat-label">Average Prediction</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon secondary">🕐</div>
          <div className="stat-value" style={{ fontSize: '1rem' }}>
            {stats?.latest_prediction ? formatDate(stats.latest_prediction) : 'No data'}
          </div>
          <div className="stat-label">Latest Prediction</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/predict" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            🎯 New Prediction
          </Link>
          <Link to="/history" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            📜 View History
          </Link>
          <Link to="/machines" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            ⚙️ View Machines
          </Link>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Predictions</h2>
          <Link to="/history" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            View All
          </Link>
        </div>
        
        {recentPredictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No predictions yet</h3>
            <p>Make your first prediction to see data here</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Machine ID</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map((pred) => (
                  <tr key={pred.id}>
                    <td>
                      <Link to={`/machine/${encodeURIComponent(pred.machine_id)}`} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                        {pred.machine_id}
                      </Link>
                    </td>
                    <td>{pred.features?.temperature?.toFixed(1) || 'N/A'}°</td>
                    <td>{pred.features?.humidity?.toFixed(1) || 'N/A'}%</td>
                    <td>
                      <span className={`badge ${pred.needs_maintenance ? 'badge-warning' : 'badge-success'}`}>
                        {pred.needs_maintenance ? '⚠️ Maintenance' : '✅ OK'}
                      </span>
                    </td>
                    <td>{formatDate(pred.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;