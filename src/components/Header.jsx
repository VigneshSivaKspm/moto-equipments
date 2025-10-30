import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  // Categories with modern icons (using emojis as fallback)
  const categories = [
    { label: 'Casques moto', path: '/helmets', icon: '🪖' },
    { label: 'Équipements motard', path: '/biker-equipments', icon: '🧥' },
    { label: 'Airbag & Protection', path: '/airbag-protection', icon: '🛡️' },
    { label: 'Pièces détachées', path: '/spare-parts-accessories', icon: '⚙️' },
    { label: 'Vêtements de sport', path: '/sportswear', icon: '👕' },
    { label: 'Équipement scooter', path: '/scooter-equipment', icon: '🛵' },
  ];

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') closeSidebar();
  };

  return (
    <header 
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
      ref={headerRef}
    >
      <div className="header__container">
        <div className="header__content">
          {/* Mobile Menu Button */}
          <button 
            className="header__menu-btn"
            onClick={toggleSidebar}
            onKeyDown={handleKeyDown}
            aria-label="Ouvrir le menu"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-navigation"
          >
            <span className="header__menu-icon"></span>
          </button>

          {/* Logo */}
          <Link to="/" className="header__logo">
            <span className="header__logo-text">ÉQUIPEMENT MOTO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav" aria-label="Navigation principale">
            <Link 
              to="/" 
              className={`header__nav-link ${location.pathname === '/' ? 'header__nav-link--active' : ''}`}
            >
              Accueil
            </Link>
            <Link 
              to="/contact" 
              className={`header__nav-link ${location.pathname === '/contact' ? 'header__nav-link--active' : ''}`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={closeSidebar}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={-1}
        aria-label="Fermer le menu"
      >
        <nav 
          className="sidebar"
          id="sidebar-navigation"
          onClick={e => e.stopPropagation()}
          aria-label="Menu de navigation mobile"
        >
          <div className="sidebar__header">
            <button 
              className="sidebar__close-btn"
              onClick={closeSidebar}
              aria-label="Fermer le menu"
            >
              <span className="sidebar__close-icon"></span>
            </button>
          </div>

          <div className="sidebar__content">
            <ul className="sidebar__nav">
              <li className="sidebar__nav-item">
                <Link 
                  to="/" 
                  className="sidebar__nav-link"
                  onClick={closeSidebar}
                >
                  Accueil
                </Link>
              </li>
              
              <li className="sidebar__nav-section">
                <span className="sidebar__section-label">Catégories</span>
              </li>
              
              {categories.map((category) => (
                <li key={category.path} className="sidebar__nav-item">
                  <Link 
                    to={category.path}
                    className="sidebar__nav-link sidebar__nav-link--category"
                    onClick={closeSidebar}
                  >
                    <span className="sidebar__nav-icon">{category.icon}</span>
                    <span className="sidebar__nav-text">{category.label}</span>
                  </Link>
                </li>
              ))}
              
              <li className="sidebar__nav-section">
                <span className="sidebar__section-label">Informations</span>
              </li>
              
              <li className="sidebar__nav-item">
                <Link to="/categories" className="sidebar__nav-link" onClick={closeSidebar}>
                  Toutes les catégories
                </Link>
              </li>
              <li className="sidebar__nav-item">
                <Link to="/offers" className="sidebar__nav-link" onClick={closeSidebar}>
                  Offres spéciales
                </Link>
              </li>
              <li className="sidebar__nav-item">
                <Link to="/contact" className="sidebar__nav-link" onClick={closeSidebar}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;