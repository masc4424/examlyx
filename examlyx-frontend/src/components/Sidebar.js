import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, hovered, toggleSidebar, onMouseEnter, onMouseLeave }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    // Auto-open menu based on current path
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      setOpenMenus(prev => ({ ...prev, dashboards: true }));
    }
    if (path.includes('/users')) {
      setOpenMenus(prev => ({ ...prev, users: true }));
    }
  }, [location]);

  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || 
           location.pathname.startsWith(`${path}/`);
  };

  // FIXED: Dashboard should only be active on the exact dashboard home page
  const isDashboardActive = () => {
    // Only active when on exactly '/dashboard' or '/dashboard/home'
    // Not active on '/dashboard/users/*' or other subpaths
    return location.pathname === '/dashboard' || 
           location.pathname === '/dashboard/home' ||
           location.pathname === '/dashboard/' ||
           (location.pathname === '/dashboard' && location.pathname.endsWith('/'));
  };

  // FIXED: Users should be active on any users subpath
  const isUsersActive = () => {
    return location.pathname.includes('/users') ||
           location.pathname.includes('/teachers') ||
           location.pathname.includes('/students');
  };

  return (
    <aside 
      id="layout-menu" 
      className={`layout-menu menu-vertical menu bg-menu-theme ${
        collapsed ? 'menu-collapsed' : 'menu-expanded'
      } ${hovered ? 'menu-hover' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="app-brand demo">
        <Link to="/dashboard/home" className="app-brand-link">
          <span className="app-brand-logo demo">
            <span className="text-primary">
              <span className="app-brand-logo demo">
                <img src="/assets/img/logos/examlyx.png" alt="Logo" width="32" height="32" />
              </span>
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-3">
            Examlyx
          </span>
        </Link>

        {/* Use the toggleSidebar from props */}
        <a
          href="#"
          className="layout-menu-toggle menu-link text-large ms-auto"
          onClick={(e) => {
            e.preventDefault();
            toggleSidebar();
          }}>
          <i className={`icon-base ti menu-toggle-icon d-none d-xl-block ${
            collapsed ? 'ti-chevron-right' : 'ti-chevron-left'
          }`}></i>
          <i className="icon-base ti tabler-x d-block d-xl-none"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {/* Dashboard menu item */}
        <li className={`menu-item ${isDashboardActive() ? 'active' : ''}`}>
          <Link 
            to="/dashboard/home"  // Changed to home page
            className="menu-link"
          >
            <i className="menu-icon icon-base ti tabler-smart-home"></i>
            <div data-i18n="Dashboard" className="menu-title">Dashboard</div>
          </Link>
        </li>

        {/* Users menu with sub-items */}
        <li className={`menu-item ${openMenus.users ? 'open' : ''} ${isUsersActive() ? 'active' : ''}`}>
          <a
            href="#"
            className="menu-link menu-toggle"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('users');
            }}>
            <i className="menu-icon icon-base ti tabler-users"></i>
            <div data-i18n="Users" className="menu-title">Users</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item ${isActive('/dashboard/users/teachers') ? 'active' : ''}`}>
              <Link to="/dashboard/users/teachers" className="menu-link">
                <div data-i18n="Teachers">Teachers</div>
              </Link>
            </li>
            <li className={`menu-item ${isActive('/dashboard/users/students') ? 'active' : ''}`}>
              <Link to="/dashboard/users/students" className="menu-link">
                <div data-i18n="Students">Students</div>
              </Link>
            </li>
          </ul>
        </li>
        
        {/* Add more menu items as needed */}
      </ul>
    </aside>
  );
};

export default Sidebar;