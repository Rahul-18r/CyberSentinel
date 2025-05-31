import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './MetricCard.css';

const MetricCard = ({ title, value, description, isDeepfake }) => {
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
  
  // Updated scoring logic based on deepfake vs real image patterns
  const getScoreClass = (value, metric) => {
    if (value === null) return '';
    const score = value * 100;

    if (metric === 'AI Analysis') {
      return score > 70 ? 'score-suspicious' : 'score-authentic';
    }

    // Specific thresholds for each metric type
    switch(metric) {
      case 'Error Level Analysis':
        // ELA: Real ~12.6%, Deepfake ~15.8%
        return score < 14 ? 'score-authentic' : 'score-suspicious';
      
      case 'Noise Pattern':
        // Noise: Real ~23.9%, Deepfake ~32.7%
        return score < 28 ? 'score-authentic' : 'score-suspicious';
      
      case 'Facial Analysis':
        // Special handling for facial analysis
        return score < 45 ? 'score-authentic' : 'score-suspicious';
      
      default:
        return score < 30 ? 'score-authentic' : 'score-suspicious';
    }
  };

  return (
    <div className={`metric-card ${getScoreClass(value, title)}`}>
      <h4 className="metric-title">{title}</h4>
      <div className={`metric-value ${isChanged ? 'changed' : ''}`}>
        {formattedValue}
      </div>
      <p className="metric-description">{description}</p>
      <div className="metric-indicator">
        {value !== null && (
          <span className="indicator-dot" 
                title={getScoreClass(value, title) === 'score-authentic' ? 
                       'Indicates authentic pattern' : 
                       'Potential manipulation detected'} 
          />
        )}
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  description: PropTypes.string,
  isDeepfake: PropTypes.bool
};

export default MetricCard;