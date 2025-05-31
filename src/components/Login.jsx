import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateProof } from '../utils/zkpUtils';
import { FaUserPlus, FaLock } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { ParticleBackground } from './ParticleBackground';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import DemoToggle from './DemoToggle';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    pin: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const handleZKPSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (isDemoMode) {
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
      return;
    }

    // Early validation - only check in non-demo mode
    if (!formData.username || !formData.pin) {
      toast.error('All fields are required', {
        hideProgressBar: true,
        closeButton: false,
        autoClose: 2000
      });
      return;
    }

    setLoading(true);
    try {
      const { proof } = generateProof(formData.pin);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          proof
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Invalid credentials', {
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2000
        });
        return;
      }
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        
        toast.success('Login successful!', {
          hideProgressBar: true,
          closeButton: false,
          autoClose: 200,
          pauseOnHover: false,
          draggable: false,
          onClose: () => navigate('/dashboard')
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.', {
        hideProgressBar: true,
        closeButton: false,
        autoClose: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e, buttonEl) => {
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      buttonEl.style.setProperty('--mouse-x', `${x}%`);
      buttonEl.style.setProperty('--mouse-y', `${y}%`);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        closeButton={false}
        theme="dark"
      />
      <ParticleBackground />
      <DemoToggle 
        isDemoMode={isDemoMode} 
        setIsDemoMode={setIsDemoMode}
        playHover={playHover}
        playClick={playClick}
      />
      <div className="login-content">
        <div className="login-box">
          <h2 className="login-title">SECURE LOGIN</h2>
          <form onSubmit={handleZKPSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Username"
                required
                className="auth-input"
                onMouseEnter={() => playHover()}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
                placeholder="PIN"
                required
                className="auth-input"
                onMouseEnter={() => playHover()}
              />
            </div>
            <div className="button-container">
              <button
                type="submit"
                disabled={loading}
                className="auth-button"
                onMouseEnter={() => playHover()}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              >
                <FaLock />
                <span>{loading ? 'Authenticating...' : 'Login'}</span>
              </button>
              <button
                type="button"
                className="auth-button"
                onClick={() => {
                  playClick();
                  navigate('/register');
                }}
                onMouseEnter={() => playHover()}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              >
                <FaUserPlus />
                <span>Register</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;