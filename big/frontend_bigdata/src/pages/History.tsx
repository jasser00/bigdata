import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, PredictionHistory } from '../api/prediction';

const History = () => {
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setPredictions(data.reverse()); // Most recent first
      } catch (err) {
        setError('Failed to load prediction history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const filteredPredictions = predictions.filter(pred =>
    pred.machine_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="page-title">📜 Prediction History</h1>
        <p className="page-subtitle">View all past predictions and their results</p>
      </div>

      {error && (
        <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Predictions ({filteredPredictions.length})</h2>
          <input
            type="text"
            placeholder="Search by Machine ID..."
            className="form-input"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPredictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>{searchTerm ? 'No matching predictions' : 'No predictions yet'}</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Make your first prediction to see data here'}</p>
            {!searchTerm && (
              <Link to="/predict" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
                Make First Prediction
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Machine ID</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Status</th>
                  <th>Model</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.map((pred) => (
                  <tr key={pred.id}>
                    <td>#{pred.id}</td>
                    <td>
                      <Link 
                        to={`/machine/${encodeURIComponent(pred.machine_id)}`} 
                        style={{ color: 'var(--primary-color)', fontWeight: 600 }}
                      >
                        {pred.machine_id}
                      </Link>
                    </td>
                    <td>{pred.features?.temperature?.toFixed(1) || 'N/A'}°C</td>
                    <td>{pred.features?.humidity?.toFixed(1) || 'N/A'}%</td>
                    <td>
                      <span className={`badge ${pred.needs_maintenance ? 'badge-warning' : 'badge-success'}`}>
                        {pred.needs_maintenance ? '⚠️ Maintenance Needed' : '✅ OK'}
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
};

export default History;