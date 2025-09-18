// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userDropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserDropdown(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    auth?.logout();
    setShowUserDropdown(false);
  };

  const isActiveLink = (path: string) => location.pathname === path ? 'active' : '';
  const navClass = isScrolled 
    ? 'navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow' 
    : 'navbar navbar-expand-lg navbar-dark bg-success bg-gradient sticky-top';

  return (
    <nav className={navClass}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          CropYieldPro
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/')}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/prediction')}`} to="/prediction">
                Prediction
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto align-items-center">
            {auth?.isAuthenticated ? (
              <li className="nav-item dropdown" ref={userDropdownRef}>
                <button 
                  className="btn btn-outline-light" 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  {auth.user?.name || 'User'}
                </button>
                <div className={`dropdown-menu dropdown-menu-end ${showUserDropdown ? 'show' : ''}`}>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <button 
                  className="btn btn-warning" 
                  onClick={() => auth?.showLoginModal && auth.showLoginModal()}
                >
                  Login / Register
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;