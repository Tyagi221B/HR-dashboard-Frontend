import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";
import { useAuth } from "../context/useAuth.js";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (windowWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const isMobile = windowWidth <= 768;

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobile ? 'mobile' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/icons/logo.svg" alt="logo" width={20} height={20} />
            <div>LOGO</div>
          </div>
          
          {isMobile && (
            <button 
              className="close-sidebar"
              onClick={toggleMobileMenu}
              aria-label="Close navigation menu"
            >
              &times;
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <img src="/icons/search.svg" alt="Search" width={20} height={20} />
          <input type="text" placeholder="Search" />
        </div>

        <div className="addmargin"></div>

        {/* Recruitment */}
        <div className="menu-title">
          <h5>Recruitment</h5>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                onClick={closeMobileMenu}
              >
                <img src="/icons/candidates.svg" alt="Candidates" width={20} height={20} />
                <span>Candidates</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Organization */}
        <div className="menu-title">
          <h5>Organization</h5>
          <ul>
            <li>
              <NavLink
                to="/employees"
                className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                onClick={closeMobileMenu}
              >
                <img src="/icons/employees.svg" alt="Employees" width={20} height={20} />
                <span>Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance"
                className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                onClick={closeMobileMenu}
              >
                <img src="/icons/attendance.svg" alt="Attendance" width={20} height={20} />
                <span>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leaves"
                className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
                onClick={closeMobileMenu}
              >
                <img src="/icons/leaves.svg" alt="Leaves" width={20} height={20} />
                <span>Leaves</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Others */}
        <div className="menu-title">
          <h5>Others</h5>
          <ul>
            <li className="menu-item" onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}>
              <img src="/icons/logout.svg" alt="Logout" width={20} height={20} />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default Sidebar;