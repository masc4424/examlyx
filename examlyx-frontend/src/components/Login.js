import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password, rememberMe);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Use absolute paths for images in public folder
  const authIllustration = '/assets/img/illustrations/auth-login-illustration-light.png';
  const bgShapeImage = '/assets/img/illustrations/bg-shape-image-light.png';

  return (
    <div className="authentication-wrapper authentication-cover">
      {/* Logo */}
      <a href="/" className="app-brand auth-cover-brand">
        <span className="app-brand-logo demo">
          <span className="text-primary">
            <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                fill="currentColor" />
              <path
                opacity="0.06"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                fill="#161616" />
              <path
                opacity="0.06"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                fill="#161616" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="app-brand-text demo text-heading fw-bold">Examlyx</span>
      </a>
      {/* /Logo */}
      
      <div className="authentication-inner row m-0">
        {/* /Left Text */}
        <div className="d-none d-xl-flex col-xl-8 p-0">
          <div className="auth-cover-bg d-flex justify-content-center align-items-center position-relative">
            <img
              src={authIllustration}
              alt="auth-login-cover"
              className="my-5 auth-illustration"
              data-app-light-img="illustrations/auth-login-illustration-light.png"
              data-app-dark-img="illustrations/auth-login-illustration-dark.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                parent.innerHTML = `
                  <div class="text-center p-5">
                    <div class="mb-4">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="120" height="120" rx="20" fill="#696cff" fill-opacity="0.1"/>
                        <path d="M60 30C42.43 30 28 44.43 28 62C28 79.57 42.43 94 60 94C77.57 94 92 79.57 92 62C92 44.43 77.57 30 60 30Z" fill="#696cff"/>
                        <path d="M60 40C48.954 40 40 48.954 40 60C40 71.046 48.954 80 60 80C71.046 80 80 71.046 80 60C80 48.954 71.046 40 60 40Z" fill="white"/>
                      </svg>
                    </div>
                    <h4 className="mb-2 text-white">Exam Analysis Platform</h4>
                    <p className="text-white-50 mb-0">Your intelligent exam analysis solution</p>
                  </div>
                `;
              }}
            />
            <img
              src={bgShapeImage}
              alt="auth-login-cover"
              className="platform-bg position-absolute w-100 h-100"
              data-app-light-img="illustrations/bg-shape-image-light.png"
              data-app-dark-img="illustrations/bg-shape-image-dark.png"
              style={{ objectFit: 'cover', zIndex: -1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
        {/* /Left Text */}

        {/* Login */}
        <div className="d-flex col-12 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
          <div className="w-px-400 mx-auto mt-12 pt-5">
            <h4 className="mb-1">Welcome to Examlyx! 👋</h4>
            <p className="mb-6">Please sign-in to your account and start the adventure</p>

            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}

            <form id="formAuthentication" className="mb-6" onSubmit={handleSubmit}>
              <div className="mb-6 form-control-validation">
                <label htmlFor="username" className="form-label">Email or Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your email or username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-6 form-password-toggle form-control-validation">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-group input-group-merge">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    name="password"
                    placeholder="••••••••••••"
                    aria-describedby="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <span 
                    className="input-group-text cursor-pointer" 
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`icon-base ti ${showPassword ? 'tabler-eye' : 'tabler-eye-off'}`}></i>
                  </span>
                </div>
              </div>
              <div className="my-8">
                <div className="d-flex justify-content-between">
                  <div className="form-check mb-0 ms-2">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="remember-me" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="remember-me">
                      Remember Me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-decoration-none">
                    <p className="mb-0">Forgot Password?</p>
                  </a>
                </div>
              </div>
              <button 
                className="btn btn-primary d-grid w-100" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="text-center">
              <span>New on our platform?</span>
              <a href="/register" className="text-decoration-none ms-1">
                <span>Create an account</span>
              </a>
            </p>

            <div className="divider my-6">
              <div className="divider-text">or</div>
            </div>

            <div className="d-flex justify-content-center">
              <a href="#" className="btn btn-icon rounded-circle btn-text-facebook me-1_5">
                <i className="icon-base ti tabler-brand-facebook-filled icon-20px"></i>
              </a>

              <a href="#" className="btn btn-icon rounded-circle btn-text-twitter me-1_5">
                <i className="icon-base ti tabler-brand-twitter-filled icon-20px"></i>
              </a>

              <a href="#" className="btn btn-icon rounded-circle btn-text-github me-1_5">
                <i className="icon-base ti tabler-brand-github-filled icon-20px"></i>
              </a>

              <a href="#" className="btn btn-icon rounded-circle btn-text-google-plus">
                <i className="icon-base ti tabler-brand-google-filled icon-20px"></i>
              </a>
            </div>
          </div>
        </div>
        {/* /Login */}
      </div>
    </div>
  );
};

export default Login;