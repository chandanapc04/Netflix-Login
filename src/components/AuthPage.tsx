import React, { useState } from 'react';
import authService, { RegisterData, LoginData } from '../services/authService';
import './AuthPage.css';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    userId: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.login(loginData);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        onAuthSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register(registerData);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        onAuthSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    // Reset forms
    setLoginData({ username: '', password: '' });
    setRegisterData({
      userId: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: ''
    });
  };

  return (
    <div className="auth-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="auth-content">
        {/* App Info Section */}
        <div className="app-info">
          <div className="app-info-content">
            <h1 className="app-title">
              🎬 <span>Movie</span>Flix
            </h1>
            <p className="app-description">
              Discover your next favorite movie from our extensive collection. 
              Stream trending, popular, and upcoming movies in stunning quality.
            </p>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">🔥</div>
                <span>Trending Movies</span>
              </div>
              <div className="feature">
                <div className="feature-icon">⭐</div>
                <span>Top Rated</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🎭</div>
                <span>All Genres</span>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <span>Any Device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms Section */}
        <div className="auth-forms">
          <div className="form-container">
            {isLogin ? (
              /* Login Form */
              <div className="form-card">
                <h2>Welcome Back</h2>
                <p>Sign in to continue to MovieFlix</p>
                
                <form onSubmit={handleLoginSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="login-username">Username</label>
                    <input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}
                  
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="form-footer">
                  <p>
                    Don't have an account?{' '}
                    <button type="button" className="link-btn" onClick={toggleForm}>
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* Register Form */
              <div className="form-card">
                <h2>Create Account</h2>
                <p>Join MovieFlix to start watching</p>
                
                <form onSubmit={handleRegisterSubmit} className="auth-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="register-userId">User ID</label>
                      <input
                        id="register-userId"
                        type="text"
                        value={registerData.userId}
                        onChange={(e) => setRegisterData({...registerData, userId: e.target.value})}
                        placeholder="Choose a user ID"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="register-username">Username</label>
                      <input
                        id="register-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-phone">Phone Number</label>
                    <input
                      id="register-phone"
                      type="tel"
                      value={registerData.phoneNumber}
                      onChange={(e) => setRegisterData({...registerData, phoneNumber: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      placeholder="Create a password"
                      required
                      minLength={6}
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}
                  
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                </form>

                <div className="form-footer">
                  <p>
                    Already have an account?{' '}
                    <button type="button" className="link-btn" onClick={toggleForm}>
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
