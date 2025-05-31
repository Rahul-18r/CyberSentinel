import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RiAiGenerate, 
  RiShieldKeyholeFill, 
  RiMailLockFill,
  RiImageEditFill,
  RiLogoutCircleRFill
} from 'react-icons/ri';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import { TypeAnimation } from 'react-type-animation';
import { ParticleBackground } from './ParticleBackground';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [playHover] = useSound(hoverSound, { volume: 3.9 }); // Increased from 0.3
  const [playClick] = useSound(clickSound, { volume: 3.9 }); // Increased from 0.4
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  const tools = [
    {
      icon: <RiAiGenerate />,
      title: 'Deepfake Detection',
      description: 'Advanced AI-powered detection of manipulated images and videos',
      path: '/detect',
      color: '#6366f1'
    },
    {
      icon: <RiShieldKeyholeFill />,
      title: 'Safe Browsing',
      description: 'Check websites for potential security threats',
      path: '/safe-browsing',
      color: '#ec4899'
    },
    {
      icon: <RiMailLockFill />,
      title: 'Email Scanner',
      description: 'Analyze emails for spam and phishing attempts',
      path: '/emailscanner',
      color: '#14b8a6'
    },
    {
      icon: <RiImageEditFill />,
      title: 'Steganography',
      description: 'Detect hidden content in images',
      path: '/steganography',
      color: '#f59e0b'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!token || isAuthenticated !== 'true') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authType');
    localStorage.removeItem('loginTime');

    // Force navigation to login page
    navigate('/login', { replace: true });
  };

  // Create floating particles
  useEffect(() => {
    const createParticle = () => {
      const particles = document.querySelector('.floating-particles');
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.setProperty('--random-x', Math.random());
      particle.style.setProperty('--random-y', Math.random() * -1);
      
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = '100vh';
      
      particles.appendChild(particle);
      
      particle.addEventListener('animationend', () => particle.remove());
    };

    const particleInterval = setInterval(createParticle, 200);
    return () => clearInterval(particleInterval);
  }, []);

  // Particle mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('.particle');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        if (distance < 300) {
          const angle = Math.atan2(distY, distX);
          const force = (300 - distance) / 300;
          const moveX = Math.cos(angle) * force * 50;
          const moveY = Math.sin(angle) * force * 50;
          
          particle.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        } else {
          particle.style.transform = '';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add smooth scroll handling
  useEffect(() => {
    let currentScroll = 0;
    let isScrolling = false;
    let requestId = null;

    const smoothScroll = () => {
      currentScroll += (window.scrollY - currentScroll) * 0.1;
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;
      }

      if (Math.abs(window.scrollY - currentScroll) < 0.1) {
        isScrolling = false;
        cancelAnimationFrame(requestId);
        return;
      }

      requestId = requestAnimationFrame(smoothScroll);
    };

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestId = requestAnimationFrame(smoothScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestId);
    };
  }, []);

  // Modify card hover effect
  const handleCardHover = (e, card, index) => {
    if (!card) return;
    
    setActiveCard(index);
    playHover();

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate relative position for gradient
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angleX = (x - centerX) / centerX;
    const angleY = (y - centerY) / centerY;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--rotate-x', `${angleY * 10}deg`);
    card.style.setProperty('--rotate-y', `${-angleX * 10}deg`);
  };

  const handleBackgroundMove = (e) => {
    const bg = document.querySelector('.cyber-background');
    if (bg) {
      const rect = bg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      bg.style.setProperty('--mouse-x', `${x}%`);
      bg.style.setProperty('--mouse-y', `${y}%`);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div className="dashboard-new">
      <ParticleBackground />
      <div className="cyber-grid">
        <div className="split-layout">
          <div className="tools-section">
            <div className="cyber-tools">
              {tools.map((tool, index) => (
                <div
                  key={tool.title}
                  className="cyber-card"
                  onMouseMove={(e) => handleMouseMove(e)}
                  onMouseEnter={() => playHover()}
                  onClick={() => {
                    playClick();
                    navigate(tool.path);
                  }}
                >
                  <div className="card-overlay" />
                  <div className="card-content">
                    <div className="icon-container">
                      {tool.icon}
                    </div>
                    <h2>{tool.title}</h2>
                    <p>{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <img 
              src="/ECorp.png" 
              alt="E-CORP" 
              className="company-logo"
            />
            <div className="company-description">
              <TypeAnimation
                sequence={[
                  'Advanced Threat Detection',
                  1000,
                  'Comprehensive Security',
                  1000,
                  'Enterprise Protection',
                  1000,
                ]}
                wrapper="p"
                speed={50}
                className="typing-text"
                repeat={Infinity}
              />
              <div className="static-text-container">
                <p className="static-text">
                  Pioneering the future of cybersecurity with cutting-edge detection.
                </p>
                <p className="static-text">
                  Our advanced AI-powered tools provide real-time threat prevention.
                </p>
                <p className="static-text">
                  Protecting digital assets with next-generation security solutions.
                </p>
              </div>
              <button 
                className="cyber-logout"
                onClick={handleLogout}
                onMouseEnter={() => playHover()}
                onMouseMove={(e) => handleMouseMove(e)}
              >
                <div className="card-overlay" />
                <RiLogoutCircleRFill />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;