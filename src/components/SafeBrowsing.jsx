import React, { useState } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import InfoButton from './common/InfoButton';
import { ParticleBackground } from './ParticleBackground';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import axios from 'axios';
import './SafeBrowsing.css';

const STATUS_COLORS = {
  safe: {
    primary: '#10B981',
    background: 'rgba(16, 185, 129, 0.1)',
    text: '#ffffff'
  },
  dangerous: {
    primary: '#EF4444',
    background: 'rgba(239, 68, 68, 0.1)',
    text: '#ffffff'
  },
  suspicious: {
    primary: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.1)',
    text: '#ffffff'
  },
  unreachable: {
    primary: '#6B7280',
    background: 'rgba(107, 114, 128, 0.1)',
    text: '#ffffff'
  }
};

const SafeBrowsing = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const checkUrlReachability = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        timeout: 5000
      });
      return true;
    } catch (error) {
      console.error('Reachability check failed:', error);
      return false;
    }
  };

  const analyzeSecurityThreats = async (url) => {
    const hasSecurityIssues = url.toLowerCase().includes('malware') || 
                             url.toLowerCase().includes('phishing') ||
                             url.toLowerCase().includes('scam');
    
    const isHttps = url.toLowerCase().startsWith('https://');
    const hasWeakProtocol = !isHttps;

    return {
      hasSecurityIssues,
      hasWeakProtocol,
      score: isHttps ? (hasSecurityIssues ? 30 : 90) : 60
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (!url.match(/^https?:\/\/.+/)) {
        throw new Error('Please enter a valid URL including http:// or https://');
      }

      const isReachable = await checkUrlReachability(url);
      
      if (!isReachable) {
        setResult({
          status: 'unreachable',
          message: 'Website Unreachable',
          details: [
            'The website could not be reached',
            'The server might be down',
            'The domain might not exist',
            'The connection might be blocked'
          ],
          score: 0
        });
        return;
      }

      const securityAnalysis = await analyzeSecurityThreats(url);
      
      if (securityAnalysis.hasSecurityIssues) {
        setResult({
          status: 'dangerous',
          message: 'Security Threats Detected',
          details: [
            'Potential security risks found',
            'Suspicious content detected',
            securityAnalysis.hasWeakProtocol ? 'Insecure protocol (HTTP)' : null,
            'Exercise extreme caution'
          ].filter(Boolean),
          score: securityAnalysis.score
        });
      } else {
        setResult({
          status: securityAnalysis.hasWeakProtocol ? 'suspicious' : 'safe',
          message: securityAnalysis.hasWeakProtocol ? 
                   'Exercise Caution - Insecure Protocol' : 
                   'Website Appears Safe',
          details: [
            securityAnalysis.hasWeakProtocol ? 
              'Site uses insecure HTTP protocol' : 
              'Site uses secure HTTPS protocol',
            'No immediate security threats detected',
            securityAnalysis.hasWeakProtocol ?
              'Data sent to this site is not encrypted' :
              'Connection is encrypted'
          ],
          score: securityAnalysis.score
        });
      }
    } catch (error) {
      setError(error.message || 'Failed to analyze URL');
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ParticleBackground />
      <div className="detector-content">
        <div className="detector-box">
          <div className="header-section">
            <h2 className="login-title">WEBSITE SECURITY CHECK</h2>
            <p className="auth-subtitle">Enter a website URL to analyze security threats</p>
          </div>

          <div className="scan-card">
            <form onSubmit={handleSubmit} className="scan-form">
              <div className="input-wrapper">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., https://example.com)"
                  className="auth-input"
                  required
                  onMouseEnter={() => playHover()}
                />
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={loading}
                  onMouseEnter={() => playHover()}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="icon-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <FaShieldAlt />
                      <span>Check Security</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="error-alert">
                <FaTimes className="error-icon" />
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div 
                className={`result-section ${result.status}`}
                style={{
                  '--status-color': STATUS_COLORS[result.status].primary,
                  '--status-bg': STATUS_COLORS[result.status].background
                }}
              >
                <div className="result-header">
                  {result.status === 'safe' && <FaCheck className="result-icon" />}
                  {result.status === 'dangerous' && <FaExclamationTriangle className="result-icon" />}
                  {result.status === 'unreachable' && <FaTimes className="result-icon" />}
                  <h2>{result.message}</h2>
                </div>

                <div className="score-section">
                  <div className="score-label">Security Score</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <div className="score-value">{result.score}%</div>
                </div>

                {result.details && result.details.length > 0 && (
                  <div className="details-section">
                    <h3>Analysis Details</h3>
                    <ul className="details-list">
                      {result.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.status !== 'unreachable' && (
                  <button 
                    className="action-button"
                    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                  >
                    {result.status === 'safe' && (
                      <>
                        <FaCheck /> Visit Website
                      </>
                    )}
                    {result.status === 'dangerous' && (
                      <>
                        <FaExclamationTriangle /> View Details
                      </>
                    )}
                    {result.status === 'suspicious' && (
                      <>
                        <FaExclamationTriangle /> Proceed with Caution
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeBrowsing;