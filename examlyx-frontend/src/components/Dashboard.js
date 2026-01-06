import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Home from './pages/Home';

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`layout-wrapper layout-content-navbar ${sidebarCollapsed ? 'layout-menu-collapsed' : ''}`}>
      <div className="layout-container">
        <Sidebar collapsed={sidebarCollapsed} />
        
        <div className="layout-page">
          <Navbar toggleSidebar={toggleSidebar} />
          
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
              </Routes>
            </div>
            
            <footer className="content-footer footer bg-footer-theme">
              <div className="container-xxl">
                <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                  <div className="text-body">
                    &#169;
                    <script>
                      document.write(new Date().getFullYear());
                    </script>
                    {new Date().getFullYear()}, made with ❤️ by <a href="https://pixinvent.com" target="_blank" rel="noopener noreferrer" className="footer-link">Pixinvent</a>
                  </div>
                  <div className="d-none d-lg-inline-block">
                    <a href="https://themeforest.net/licenses/standard" className="footer-link me-4" target="_blank" rel="noopener noreferrer">License</a>
                    <a href="https://themeforest.net/user/pixinvent/portfolio" target="_blank" rel="noopener noreferrer" className="footer-link me-4">More Themes</a>
                    <a href="https://demos.pixinvent.com/vuexy-html-admin-template/documentation/" target="_blank" rel="noopener noreferrer" className="footer-link me-4">Documentation</a>
                    <a href="https://pixinvent.ticksy.com/" target="_blank" rel="noopener noreferrer" className="footer-link d-none d-sm-inline-block">Support</a>
                  </div>
                </div>
              </div>
            </footer>
            
            <div className="content-backdrop fade"></div>
          </div>
        </div>
        
        <div className="layout-overlay layout-menu-toggle"></div>
        <div className="drag-target"></div>
      </div>
    </div>
  );
};

export default Dashboard;