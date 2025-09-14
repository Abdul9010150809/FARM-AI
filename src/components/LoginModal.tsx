import React, { useState } from 'react';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onShowRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onLogin, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <div className="text-center mt-3">
              <div id="google-signin-button"></div>
              <p className="mt-3">Don't have an account? <a href="#" onClick={onShowRegister}>Register</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;