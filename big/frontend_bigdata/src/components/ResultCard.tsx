import React from 'react';

interface ResultCardProps {
  prediction: number;
  modelVersion: string;
  timestamp: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ prediction, modelVersion, timestamp }) => {
  return (
    <div className="result-card" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}>
      <h3>Prediction Result</h3>
      <p><strong>Prediction:</strong> {prediction}</p>
      <p><strong>Model Version:</strong> {modelVersion}</p>
      <p><strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}</p>
    </div>
  );
};

export default ResultCard;