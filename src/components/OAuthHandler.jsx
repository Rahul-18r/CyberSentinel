import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthHandler = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const name = params.get('name');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email || '');
      localStorage.setItem('userName', name || 'Google User');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authType', 'Google');
      
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
};

export default OAuthHandler;