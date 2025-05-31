import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateProof } from '../utils/zkpUtils';
import { FaInfoCircle, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { ParticleBackground } from './ParticleBackground';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import './Login.css';
import DemoToggle from './DemoToggle';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    pin: ''
  });
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (isDemoMode) {
      // Set demo authentication state
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard', { replace: true });
      return;
    }

    if (!formData.username || !formData.pin) {
      toast.error('All fields are required', {
        hideProgressBar: true,
        closeButton: false,
        autoClose: 2000
      });
      return;
    }

    if (!/^\d{4}$/.test(formData.pin)) {
      toast.error('PIN must be exactly 4 digits', {
        hideProgressBar: true,
        closeButton: false,
        autoClose: 2000
      });
      return;
    }

    setLoading(true);
    try {
      const { proof } = generateProof(formData.pin);

      const response = await fetch('http://localhost:5000/api/auth/register', {
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
        toast.error(data.message || 'Registration failed', {
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2000
        });
        return;
      }

      if (data.success) {
        toast.success('Registration successful!', {
          hideProgressBar: true,
          closeButton: false,
          autoClose: 200,
          pauseOnHover: false,
          draggable: false,
          onClose: () => navigate('/login')
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.', {
        hideProgressBar: true,
        closeButton: false,
        autoClose: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e, target) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--x', `${x}px`);
    target.style.setProperty('--y', `${y}px`);
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
          <h2 className="login-title">SECURE REGISTER</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                disabled={loading}
                minLength={3}
                maxLength={20}
                className="auth-input"
                onMouseEnter={() => playHover()}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="pin"
                placeholder="Enter 4-digit PIN"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
                required
                disabled={loading}
                pattern="[0-9]{4}"
                maxLength="4"
                className="auth-input"
                title="Please enter a 4-digit PIN"
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
                <FaUserPlus />
                <span>{loading ? 'Creating Account...' : 'Register'}</span>
              </button>

              <button 
                type="button"
                className="auth-button"
                onClick={() => {
                  playClick();
                  navigate('/login');
                }}
                onMouseEnter={() => playHover()}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              >
                <FaArrowLeft />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;