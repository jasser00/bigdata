import { useState } from 'react';
import { postPredict, PredictResponse } from '../api/prediction';

interface FormState {
  machineId: string;
  temperature: string;
  humidity: string;
}

export default function Predict() {
  const [formState, setFormState] = useState<FormState>({
    machineId: '',
    temperature: '',
    humidity: '',
  });
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await postPredict(formState);
      setResult(response);
    } catch (err) {
      console.error('Error making prediction:', err);
      setError('Failed to make prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormState({ machineId: '', temperature: '', humidity: '' });
    setResult(null);
    setError(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎯 New Prediction</h1>
        <p className="page-subtitle">Enter machine parameters to predict maintenance needs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Input Parameters</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Machine ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., machine-001"
                value={formState.machineId}
                onChange={(e) => setFormState({ ...formState, machineId: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Temperature (°C)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 75.5"
                step="0.1"
                value={formState.temperature}
                onChange={(e) => setFormState({ ...formState, temperature: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Humidity (%)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 45.0"
                step="0.1"
                min="0"
                max="100"
                value={formState.humidity}
                onChange={(e) => setFormState({ ...formState, humidity: e.target.value })}
                required
              />
            </div>

            {error && (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '8px', 
                padding: '1rem',
                marginBottom: '1rem',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Processing...' : '🎯 Predict'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                🔄 Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result Card */}
        <div>
          {result ? (
            <div 
              className="result-card" 
              style={{ 
                background: result.needs_maintenance 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
            >
              <h3>{result.needs_maintenance ? '⚠️ Maintenance Required' : '✅ No Maintenance Needed'}</h3>
              <div className="result-value" style={{ fontSize: '4rem' }}>
                {result.needs_maintenance ? '1' : '0'}
              </div>
              <div style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                {result.needs_maintenance ? '🔧 Schedule maintenance soon!' : '👍 Machine is healthy'}
              </div>
              <div className="result-meta">
                <p>🔧 Machine: {formState.machineId}</p>
                <p>📊 Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                <p>🏷️ Model Version: {result.model_version}</p>
                <p>🕐 Timestamp: {formatDate(result.timestamp)}</p>
                <p>📡 Kafka: {result.kafka_sent ? '✅ Sent' : '❌ Not sent'}</p>
              </div>
            </div>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <h3>Ready to Predict</h3>
                <p>Fill in the form and click Predict to see results</p>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h2 className="card-title">ℹ️ How it works</h2>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>1.</strong> Enter the machine ID and current sensor readings
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>2.</strong> The AI model analyzes temperature and humidity
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>3.</strong> Returns <strong>0</strong> (no maintenance) or <strong>1</strong> (maintenance needed)
              </p>
              <p>
                <strong>4.</strong> Results are saved and sent to Kafka for processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}