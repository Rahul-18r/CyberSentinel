import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaBrain, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import './MetricCard.css';

const AIMetricCard = ({ value, description }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isChanged, setIsChanged] = useState(false);
  
  useEffect(() => {
    if (value !== prevValue) {
      setIsChanged(true);
      setPrevValue(value);
      setTimeout(() => setIsChanged(false), 300);
    }
  }, [value, prevValue]);

  const formattedValue = value !== null ? `${(value * 100).toFixed(1)}%` : 'N/A';
  const confidenceLevel = value !== null ? getConfidenceLevel(value * 100) : 'unknown';
  
  return (
    <div className={`metric-card ai-metric ${confidenceLevel}`}>
      <div className="ai-header">
        <FaBrain className="ai-icon" />
        <h4 className="metric-title">AI Analysis</h4>
      </div>
      
      <div className={`metric-value ${isChanged ? 'changed' : ''}`}>
        {formattedValue}
      </div>
      
      <div className="confidence-indicator">
        {value !== null && (
          <>
            <div className="confidence-bar">
              <div 
                className="confidence-fill" 
                style={{ width: `${value * 100}%` }}
              />
            </div>
            <div className="confidence-label">
              {value * 100 > 70 ? (
                <span className="warning">
                  <FaExclamationTriangle /> High Risk of Deepfake
                </span>
              ) : (
                <span className="authentic">
                  <FaCheck /> Likely Authentic
                </span>
              )}
            </div>
          </>
        )}
      </div>
      
      <p className="metric-description">
        {description}
      </p>
    </div>
  );
};

const getConfidenceLevel = (score) => {
  if (score >= 90) return 'very-high-risk';
  if (score >= 70) return 'high-risk';
  if (score >= 50) return 'medium-risk';
  if (score >= 30) return 'low-risk';
  return 'very-low-risk';
};

AIMetricCard.propTypes = {
  value: PropTypes.number,
  description: PropTypes.string
};

export default AIMetricCard;