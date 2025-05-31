import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaUserShield } from 'react-icons/fa';
import useSound from 'use-sound';
import Header from './Header';
import Footer from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';
import hoverSound from './assets/sounds/hover.mp3';
import clickSound from './assets/sounds/click.mp3';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const handleGetStarted = () => {
    playClick();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <ParticleBackground />
      <main className="main-content">
        <div className="title-container">
          <h1>SECURE YOUR DIGITAL WORLD WITH</h1>
          <h1>E-CORP</h1>
        </div>
        <section className="hero-section">
          <p className="hero-description">
            Advanced security tools powered by AI to protect your online presence.
            From email protection to secure browsing, we've got you covered.
          </p>
          <div className="cta-section">
            <button 
              className="cyber-logout"
              onClick={handleGetStarted}
              onMouseEnter={() => playHover()}
            >
              <div className="card-overlay" />
              Get Started
            </button>
          </div>
        </section>

        <section className="features-grid">
          {[
            {
              icon: <FaShieldAlt className="feature-icon" />,
              title: "Advanced Protection",
              description: "AI-powered security analysis for real-time threat detection"
            },
            {
              icon: <FaLock className="feature-icon" />,
              title: "Secure Browsing",
              description: "Safe browsing with phishing and malware protection"
            },
            {
              icon: <FaUserShield className="feature-icon" />,
              title: "Email Security",
              description: "Spam detection and email content analysis"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="cyber-card"
              onMouseEnter={() => playHover()}
            >
              <div className="card-overlay" />
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
