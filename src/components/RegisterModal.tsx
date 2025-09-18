import React, { useState } from 'react';

interface RegistrationModalProps {
  show: boolean;
  onClose: () => void;
  onRegister: (name: string, email: string, password: string, confirmPassword: string) => void;
  onShowLogin: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ show, onClose, onRegister, onShowLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    await onRegister(name, email, password, confirmPassword);
    setIsLoading(false);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  if (!show) return null;

  return (
    <>
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            padding: 20px;
          }
          
          .modal-content {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 450px;
            overflow: hidden;
            animation: modalSlideIn 0.3s ease-out;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .modal-header {
            background: linear-gradient(135deg, #2e7d32 0%, #7cb342 100%);
            color: white;
            padding: 24px;
            position: relative;
          }
          
          .modal-title {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
          }
          
          .modal-subtitle {
            margin: 8px 0 0 0;
            font-size: 1rem;
            opacity: 0.9;
            font-weight: 400;
          }
          
          .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
          }
          
          .modal-body {
            padding: 32px;
          }
          
          .form-group {
            margin-bottom: 20px;
            position: relative;
          }
          
          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2d3748;
            font-size: 0.9rem;
          }
          
          .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.2s ease;
            background-color: #fafafa;
          }
          
          .form-input:focus {
            outline: none;
            border-color: #7cb342;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(124, 179, 66, 0.1);
          }
          
          .form-input.error {
            border-color: #e53e3e;
          }
          
          .error-message {
            color: #e53e3e;
            font-size: 0.8rem;
            margin-top: 6px;
            display: block;
          }
          
          .password-strength {
            margin-top: 8px;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
          }
          
          .password-strength-fill {
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 3px;
          }
          
          .password-weak {
            background: #e53e3e;
            width: 33%;
          }
          
          .password-medium {
            background: #dd6b20;
            width: 66%;
          }
          
          .password-strong {
            background: #38a169;
            width: 100%;
          }
          
          .password-hint {
            font-size: 0.8rem;
            color: #718096;
            margin-top: 6px;
          }
          
          .register-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #2e7d32 0%, #7cb342 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            margin-top: 16px;
          }
          
          .register-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(124, 179, 66, 0.4);
          }
          
          .register-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .btn-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          
          .divider {
            display: flex;
            align-items: center;
            margin: 24px 0;
            color: #a0aec0;
          }
          
          .divider::before,
          .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: #e2e8f0;
          }
          
          .divider-text {
            padding: 0 16px;
            font-size: 0.9rem;
          }
          
          .google-btn {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-weight: 600;
            color: #2d3748;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .google-btn:hover {
            border-color: #7cb342;
            transform: translateY(-1px);
          }
          
          .login-link {
            text-align: center;
            margin-top: 24px;
            color: #718096;
          }
          
          .login-link a {
            color: #2e7d32;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s ease;
          }
          
          .login-link a:hover {
            color: #7cb342;
            text-decoration: underline;
          }
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .terms-text {
            font-size: 0.8rem;
            color: #718096;
            text-align: center;
            margin-top: 16px;
          }
          
          .terms-text a {
            color: #2e7d32;
            text-decoration: none;
          }
          
          .terms-text a:hover {
            text-decoration: underline;
          }
        `}
      </style>
      
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Create Account</h2>
            <p className="modal-subtitle">Join CropYield Pro to unlock all features</p>
            <button className="close-btn" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={name}
                  onChange={handleInputChange(setName, 'name')}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={email}
                  onChange={handleInputChange(setEmail, 'email')}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={password}
                  onChange={handleInputChange(setPassword, 'password')}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                {password && (
                  <div className="password-strength">
                    <div className={`password-strength-fill ${
                      password.length < 6 ? 'password-weak' :
                      password.length < 10 ? 'password-medium' : 'password-strong'
                    }`}></div>
                  </div>
                )}
                {errors.password ? (
                  <span className="error-message">{errors.password}</span>
                ) : (
                  <span className="password-hint">Use at least 6 characters with a mix of letters and numbers</span>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              
              <button 
                type="submit" 
                className="register-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="btn-loading">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            
            <p className="terms-text">
              By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
            
            <div className="divider">
              <span className="divider-text">Or sign up with</span>
            </div>
            
            <button className="google-btn" disabled={isLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 9.20455C16.5 8.56636 16.4318 7.95273 16.3064 7.36364H9V10.845H13.1932C13.0386 11.97 12.4023 12.9232 11.4034 13.5614V15.8195H14.0284C15.6182 14.3523 16.5 12.2332 16.5 9.20455Z" fill="#4285F4"/>
                <path d="M9 17C11.2159 17 13.1023 16.2443 14.4284 14.9477L11.8034 12.6895C11.0023 13.2523 9.93864 13.6136 9 13.6136C6.87955 13.6136 5.10227 12.2205 4.46591 10.33H1.74773V12.6477C3.06591 15.2332 5.78455 17 9 17Z" fill="#34A853"/>
                <path d="M4.46591 10.33C4.28409 9.82955 4.18182 9.29318 4.18182 8.73864C4.18182 8.18409 4.28409 7.64773 4.46591 7.14727V4.82955H1.74773C1.17045 5.94773 0.863636 7.20455 0.863636 8.73864C0.863636 10.2727 1.17045 11.5295 1.74773 12.6477L4.46591 10.33Z" fill="#FBBC05"/>
                <path d="M9 3.88636C10.4477 3.88636 11.7341 4.37727 12.7523 5.33636L14.4864 3.60227C13.0932 2.31136 11.2068 1.5 9 1.5C5.78455 1.5 3.06591 3.26682 1.74773 5.85227L4.46591 8.17C5.10227 6.27955 6.87955 4.88636 9 4.88636V3.88636Z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            
            <div className="login-link">
              <p>Already have an account? <a href="#" onClick={onShowLogin}>Sign in</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationModal;