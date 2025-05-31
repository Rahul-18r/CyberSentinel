import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FaCloudUploadAlt, 
  FaSpinner, 
  FaCheck, 
  FaTimes,
  FaCheckCircle,
  FaTimesCircle 
} from 'react-icons/fa';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import LoadingOverlay from './common/LoadingOverlay';
import AnalysisResults from './AnalysisResults';
import { performAnalysis } from './utils/imageAnalysis';
import { ParticleBackground } from './ParticleBackground';
import './DeepfakeDetector.css';

const DeepfakeDetector = () => {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const analyzeImage = useCallback(async (imageElement) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      const analysisResults = await performAnalysis(
        imageElement, 
        null, 
        setStage, 
        setProgress
      );
      
      setResults(analysisResults);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze image: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    playClick();
    const file = acceptedFiles[0];
    if (!file) return;

    // Create image element and wait for it to load
    const img = new Image();
    img.onload = () => {
      setImage(img);
      analyzeImage(img);
    };
    img.onerror = () => {
      setError('Failed to load image');
    };
    img.src = URL.createObjectURL(file);
  }, [analyzeImage, playClick]);

  const handleReset = () => {
    playClick();
    setImage(null);
    setResults(null);
    setError(null);
    setProgress(0);
    setStage('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <div className="auth-container">
      <ParticleBackground />
      <div className="detector-content">
        <div className="detector-box">
          <div className="header-section">
            <h2 className="login-title">DEEPFAKE DETECTOR</h2>
            <p className="auth-subtitle">Upload an image to analyze for potential manipulation</p>
          </div>

          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''}`}
            onMouseEnter={() => playHover()}
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt className="upload-icon" />
            <p className="upload-text">Drag & drop an image here</p>
            <p className="upload-subtext">or click to select a file</p>
          </div>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          <div className="results-section">
            {image && (
              <div 
                className="analysis-card"
                onMouseEnter={() => playHover()}
              >
                <img 
                  src={image.src} 
                  alt="Analyzed" 
                  className="preview-image"
                />
              </div>
            )}

            {results && (
              <div 
                className="analysis-card"
                onMouseEnter={() => playHover()}
              >
                <div className="analysis-header">
                  {results.prediction === 'Real' ? (
                    <FaCheckCircle size={24} color="#10b981" />
                  ) : (
                    <FaTimesCircle size={24} color="#ef4444" />
                  )}
                  <h2 className="analysis-title">{results.prediction}</h2>
                </div>

                <div className="metrics-grid">
                  {Object.entries(results.scores).map(([key, data]) => (
                    <div key={key} className="metric-card">
                      <h3 className="metric-title">{data.label}</h3>
                      <div className="metric-value">
                        {(data.value * 100).toFixed(1)}%
                      </div>
                      <p className="metric-description">{data.description}</p>
                    </div>
                  ))}
                </div>

                <div className="confidence-section">
                  <h3 className="confidence-title">Detection Confidence</h3>
                  <div className="confidence-bar">
                    <div 
                      className={`confidence-fill ${results.prediction.toLowerCase()}`}
                      style={{ width: `${results.confidence}%` }}
                    />
                  </div>
                  <p className="analysis-reason">{results.reason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <LoadingOverlay>
          <div className="spinner" />
          <p className="loading-text">{stage}</p>
        </LoadingOverlay>
      )}
    </div>
  );
};

export default DeepfakeDetector;