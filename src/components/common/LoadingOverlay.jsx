import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingOverlay = ({ stage, progress }) => (
  <div className="loading-overlay">
    <FaSpinner className="spinner" />
    <div className="loading-text">{stage}</div>
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  </div>
);

export default LoadingOverlay;