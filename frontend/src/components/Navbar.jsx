import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaDashcube, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close menu on outside click, escape key, and scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} className="navbar navbar-expand-lg navbar-light navbar-custom fixed-top py-3 glass-premium shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center" to="/" style={{ letterSpacing: '-0.5px' }}>
          Namma<span className="text-accent">Service</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3 d-flex align-items-center gap-1" to="/search">
                <FaSearch className="mb-1 text-muted" /> Find Professionals
              </Link>
            </li>
            
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle fw-semibold d-flex align-items-center gap-2 px-3" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <Avatar 
                    src={user.avatar} 
                    alt="Avatar" 
                    size="sm"
                    className="border-2 border-accent" 
                  />
                  <span>{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2" aria-labelledby="navbarDropdown" style={{ borderRadius: '12px', minWidth: '200px' }}>
                  <li>
                    <div className="px-3 py-2 border-bottom mb-2">
                      <div className="fw-bold text-truncate">{user.name}</div>
                      <small className="text-muted text-truncate d-block">{user.email}</small>
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded py-2 d-flex align-items-center gap-2" to="/dashboard">
                      <FaDashcube className="text-muted" /> My Dashboard
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item rounded py-2 d-flex align-items-center gap-2" to="/admin">
                        <FaUserCircle className="text-primary" /> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item rounded py-2 text-danger d-flex align-items-center gap-2 w-100 text-start border-0 bg-transparent" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-premium btn-premium-primary btn-premium-sm px-4" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
