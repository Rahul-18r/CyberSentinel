import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from './ParticleBackground';
import { FaUpload, FaSearch, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import './Steganography.css';

const Steganography = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const extractMessageFromImage = (imageData) => {
    let binaryMessage = '';
    let bytes = [];
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      binaryMessage += imageData.data[i] & 1;
    }
    
    for (let i = 0; i < binaryMessage.length; i += 8) {
      let byte = binaryMessage.substr(i, 8);
      let charCode = parseInt(byte, 2);
      if (charCode === 0 || charCode > 127) break;
      bytes.push(charCode);
    }
    
    return String.fromCharCode(...bytes);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setShowResults(false); // Reset results when new file is selected
  };

  const handleScan = async () => {
    playClick();
    if (!selectedFile) {
      alert('Please select an image file first');
      return;
    }

    setIsScanning(true);
    setShowResults(false);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const extractedText = extractMessageFromImage(imageData);
        
        const isMalicious = extractedText.length > 0;
        
        setResult({
          isMalicious,
          message: isMalicious ? 'Malicious Content Detected' : 'Image is Safe',
          details: isMalicious 
            ? 'Hidden text content was detected in this image. The file may be compromised.'
            : 'No hidden content detected in this image'
        });
        
        setShowResults(true);
        setIsScanning(false);
      };

      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
    }
  };

  return (
    <div className="auth-container">
      <ParticleBackground />
      <div className="detector-content">
        <div className="detector-box">
          <div className="header-section">
            <h2 className="login-title">STEGANOGRAPHY SCANNER</h2>
            <p className="auth-subtitle">Check images for hidden malicious content</p>
          </div>

          <div className="scan-interface">
            <div className="file-input-container">
              <input
                type="file"
                id="imageUploader"
                className="file-input"
                accept="image/*"
                onChange={handleImageUpload}
                onMouseEnter={() => playHover()}
              />
              {selectedFile && (
                <p className="selected-file">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            
            <div className="button-container">
              <button 
                onClick={handleScan}
                className="auth-button"
                disabled={!selectedFile || isScanning}
                onMouseEnter={() => playHover()}
              >
                <FaSearch />
                <span>{isScanning ? 'Scanning...' : 'Scan Image'}</span>
              </button>
              <button 
                onClick={() => {
                  playClick();
                  navigate('/dashboard');
                }}
                className="auth-button"
                onMouseEnter={() => playHover()}
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </button>
            </div>

            {showResults && result && (
              <div className="results-section">
                <div className={`analysis-card ${result.isMalicious ? 'danger' : 'safe'}`}>
                  <div className="result-header">
                    <h3 className="result-title">SCAN RESULTS</h3>
                  </div>
                  <div className="status-indicator">
                    <span className="status-icon">
                      {result.isMalicious ? 
                        <FaTimesCircle color="#ef4444" size={24} /> : 
                        <FaCheckCircle color="#10b981" size={24} />
                      }
                    </span>
                    <div className="result-content">
                      <h4 className={`status-message ${result.isMalicious ? 'danger' : 'safe'}`}>
                        {result.message}
                      </h4>
                      <p className="status-details">
                        {result.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
};

export default Steganography;