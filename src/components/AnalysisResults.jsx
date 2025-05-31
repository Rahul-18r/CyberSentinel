import React from 'react';
import MetricCard from './common/MetricCard';

const AnalysisResults = ({ results }) => {
  if (!results) return null;

  const { scores, prediction, confidence, reason } = results;

  return (
    <div className="analysis-results">
      <div className="prediction-header">
        <h2 className={`prediction ${prediction.toLowerCase()}`}>
          {prediction}
        </h2>
        <p className="confidence">
          Confidence: {confidence}%
        </p>
        <p className="reason">{reason}</p>
      </div>

      <div className="metrics-grid">
        {Object.entries(scores).map(([key, data]) => (
          <MetricCard
            key={key}
            title={data.label}
            value={data.value}
            description={data.description}
          />
        ))}
      </div>

      <style jsx>{`
        .analysis-results {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          margin-top: 2rem;
        }

        .prediction-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .prediction {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .prediction.real {
          color: #10B981;
        }

        .prediction.deepfake {
          color: #EF4444;
        }

        .confidence {
          font-size: 1.25rem;
          color: #6B7280;
          margin-bottom: 0.5rem;
        }

        .reason {
          color: #4B5563;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AnalysisResults;