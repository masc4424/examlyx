import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Home from './pages/Home';
// Users
import Teachers from '../users/Teachers';
import Teachers_Create from '../users/Teachers_Create';
import Student from '../users/Student';
import Student_Create from '../users/Student_Create';
import Admin from '../users/Admin';
import Admin_Create from '../users/Admin_Create';

// Clients
import Client from '../users/Client';
import Client_Create from '../users/Client_Create';

// User Profile View
import User_Profile_View from '../users/User_profile_View';

import { loadCSRFToken } from '../services/csrf';


const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const toggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);
    setSidebarHovered(false);
    
    // Get the HTML element to add/remove classes
    const htmlElement = document.documentElement;
    
    if (newCollapsedState) {
      htmlElement.classList.add('layout-menu-collapsed');
      htmlElement.classList.remove('layout-menu-expanded');
    } else {
      htmlElement.classList.remove('layout-menu-collapsed');
      htmlElement.classList.add('layout-menu-expanded');
    }
    
    // Also toggle class on layout-menu element
    const layoutMenu = document.getElementById('layout-menu');
    if (layoutMenu) {
      if (newCollapsedState) {
        layoutMenu.classList.add('menu-collapsed');
        layoutMenu.classList.remove('menu-expanded');
      } else {
        layoutMenu.classList.remove('menu-collapsed');
        layoutMenu.classList.add('menu-expanded');
      }
    }
  };

  const handleSidebarHover = (isHovering) => {
    if (sidebarCollapsed) {
      if (isHovering) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        
        setSidebarHovered(true);
        const layoutMenu = document.getElementById('layout-menu');
        const htmlElement = document.documentElement;
        
        if (layoutMenu) {
          layoutMenu.classList.add('menu-hover');
          layoutMenu.classList.add('menu-expanded');
        }
        htmlElement.classList.remove('layout-menu-collapsed');
      } else {
        hoverTimeoutRef.current = setTimeout(() => {
          setSidebarHovered(false);
          const layoutMenu = document.getElementById('layout-menu');
          const htmlElement = document.documentElement;
          
          if (layoutMenu) {
            layoutMenu.classList.remove('menu-hover');
            layoutMenu.classList.remove('menu-expanded');
          }
          htmlElement.classList.add('layout-menu-collapsed');
        }, 300);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    // Initialize Vuexy scripts after component mounts
    const initializeVuexy = () => {
      loadCSRFToken();
      // Menu initialization
      if (window.Menu) {
        const layoutMenuEl = document.querySelectorAll('#layout-menu');
        layoutMenuEl.forEach(menu => {
          new window.Menu(menu, {
            orientation: 'vertical',
            closeChildren: false
          });
        });
      }

      // Perfect Scrollbar
      if (window.PerfectScrollbar) {
        const menuInner = document.querySelectorAll('.menu-inner');
        menuInner.forEach(element => {
          new window.PerfectScrollbar(element, {
            suppressScrollX: true,
            wheelPropagation: false
          });
        });
      }

      // Tooltips initialization
      if (window.bootstrap && window.bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(
          document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
      }
    };

    setTimeout(initializeVuexy, 100);

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      document.documentElement.classList.remove('layout-menu-collapsed');
    };
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          hovered={sidebarHovered}
          toggleSidebar={toggleSidebar}
          onMouseEnter={() => handleSidebarHover(true)}
          onMouseLeave={() => handleSidebarHover(false)}
        />

        {/* Mobile Menu Toggler */}
        <div className="menu-mobile-toggler d-xl-none rounded-1">
          <a
            href="#"
            className="layout-menu-toggle menu-link text-large text-bg-secondary p-2 rounded-1"
            onClick={(e) => {
              e.preventDefault();
              toggleSidebar();
            }}>
            <i className="ti tabler-menu icon-base"></i>
            <i className="ti tabler-chevron-right icon-base"></i>
          </a>
        </div>

        {/* Layout Page */}
        <div className="layout-page">
          {/* Navbar */}
          <Navbar 
            toggleSidebar={toggleSidebar} 
            user={user} 
            onLogout={handleLogout} 
          />

          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              <Routes>
                {/* Default */}
                <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

                {/* Dashboard */}
                <Route path="/home" element={<Home />} />

                {/* Clients */}
                <Route path="/users/client" element={<Client />} />
                <Route path="/users/client/create" element={<Client_Create />} />

                {/* Teachers */}
                <Route path="/users/teachers" element={<Teachers />} />
                <Route path="/users/teachers/create" element={<Teachers_Create />} />

                {/* Students */}
                <Route path="/users/students" element={<Student />} />
                <Route path="/users/students/create" element={<Student_Create />} />

                {/* Admin */}
                <Route path="/users/admin" element={<Admin />} />
                <Route path="/users/admin/create" element={<Admin_Create />} />

                {/* User Profile View */}
                <Route path="/users/user_profile_view/:userId" element={<User_Profile_View />}/>
              </Routes>
            </div>
            {/* / Content */}

            {/* Footer */}
            <footer className="content-footer footer bg-footer-theme">
              <div className="container-xxl">
                <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                  <div className="text-body">
                    © {new Date().getFullYear()}, made by{' '}
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link">
                      Arkya Santra
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            {/* / Footer */}

            <div className="content-backdrop fade"></div>
          </div>
          {/* Content wrapper */}
        </div>
        {/* / Layout page */}
      </div>

      {/* Overlay */}
      <div className="layout-overlay layout-menu-toggle" onClick={toggleSidebar}></div>

      {/* Drag Target Area To SlideIn Menu On Small Screens */}
      <div className="drag-target"></div>
    </div>
  );
};

export default Dashboard;