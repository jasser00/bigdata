import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMachinePredictions, PredictionHistory } from '../api/prediction';

export default function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachineData = async () => {
      if (!id) return;
      
      try {
        const data = await getMachinePredictions(id);
        setPredictions(data.reverse()); // Most recent first
      } catch (err) {
        setError('Failed to load machine data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachineData();
  }, [id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStats = () => {
    if (predictions.length === 0) return null;
    
    const maintenanceNeeded = predictions.filter(p => p.needs_maintenance).length;
    const maintenanceOk = predictions.length - maintenanceNeeded;
    
    return { maintenanceNeeded, maintenanceOk };
  };

  const stats = getStats();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/machines" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            ← Back
          </Link>
          <div>
            <h1 className="page-title">🔧 Machine: {id}</h1>
            <p className="page-subtitle">Detailed prediction history and statistics</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">📊</div>
            <div className="stat-value">{predictions.length}</div>
            <div className="stat-label">Total Predictions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon danger">🔧</div>
            <div className="stat-value">{stats.maintenanceNeeded}</div>
            <div className="stat-label">Maintenance Needed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">✅</div>
            <div className="stat-value">{stats.maintenanceOk}</div>
            <div className="stat-label">Operating OK</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">📈</div>
            <div className="stat-value">{predictions.length > 0 ? ((stats.maintenanceNeeded / predictions.length) * 100).toFixed(1) : 0}%</div>
            <div className="stat-label">Maintenance Rate</div>
          </div>
        </div>
      )}

      {/* Predictions Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Prediction History</h2>
          <Link to="/predict" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            + New Prediction
          </Link>
        </div>

        {predictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No predictions for this machine</h3>
            <p>Make a prediction to see data here</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Status</th>
                  <th>Model</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred.id}>
                    <td>#{pred.id}</td>
                    <td>{pred.features?.temperature?.toFixed(1) || 'N/A'}°C</td>
                    <td>{pred.features?.humidity?.toFixed(1) || 'N/A'}%</td>
                    <td>
                      <span className={`badge ${pred.needs_maintenance ? 'badge-danger' : 'badge-success'}`}>
                        {pred.needs_maintenance ? '🔧 Maintenance' : '✅ OK'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{pred.model_version}</span>
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
}