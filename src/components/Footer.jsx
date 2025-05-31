import React from 'react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaDiscord, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';

const Footer = () => {
  const [playHover] = useSound(hoverSound, { volume: 0.5 });

  return (
    <div className="footer-wrapper">
      <footer className="cyber-footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="#" onMouseEnter={() => playHover()}>
                <FaGithub />
              </a>
              <a href="#" onMouseEnter={() => playHover()}>
                <FaLinkedin />
              </a>
              <a href="#" onMouseEnter={() => playHover()}>
                <FaTwitter />
              </a>
              <a href="#" onMouseEnter={() => playHover()}>
                <FaDiscord />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaEnvelope />
                <span>contact@ecorp.security</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+1 (234) 567-890</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Tech City, TC 12345</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="quick-links">
              <a href="#" onMouseEnter={() => playHover()}>About</a>
              <a href="#" onMouseEnter={() => playHover()}>Services</a>
              <a href="#" onMouseEnter={() => playHover()}>Privacy</a>
              <a href="#" onMouseEnter={() => playHover()}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;