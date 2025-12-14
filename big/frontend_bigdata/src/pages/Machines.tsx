import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMachines, MachineInfo } from '../api/prediction';

export default function Machines() {
  const [machines, setMachines] = useState<MachineInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
      } catch (err) {
        setError('Failed to load machines');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
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
        <h1 className="page-title">⚙️ Machines</h1>
        <p className="page-subtitle">Monitor all registered machines and their prediction history</p>
      </div>

      {error && (
        <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {machines.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⚙️</div>
            <h3>No machines found</h3>
            <p>Make a prediction to register a machine</p>
            <Link to="/predict" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
              Make First Prediction
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {machines.map((machine) => (
            <Link 
              to={`/machine/${encodeURIComponent(machine.machine_id)}`} 
              key={machine.machine_id}
              style={{ textDecoration: 'none' }}
            >
              <div className="machine-card">
                <div className="machine-id">🔧 {machine.machine_id}</div>
                <div className="machine-meta">
                  <p><strong>Predictions:</strong> {machine.prediction_count}</p>
                  <p><strong>Last Value:</strong> {machine.last_prediction?.toFixed(4) || 'N/A'}</p>
                  <p><strong>Last Updated:</strong> {formatDate(machine.last_timestamp)}</p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <span className="badge badge-primary">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
