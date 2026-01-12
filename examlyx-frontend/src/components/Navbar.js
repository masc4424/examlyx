import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, user, onLogout }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Congratulation Lettie 🎉',
      description: 'Won the monthly best seller gold badge',
      time: '1h ago',
      read: false,
      avatar: '/assets/img/avatars/1.png'
    },
    {
      id: 2,
      text: 'Charles Franklin',
      description: 'Accepted your connection',
      time: '12hr ago',
      read: false,
      initials: 'CF',
      color: 'danger'
    },
    {
      id: 3,
      text: 'New Message ✉️',
      description: 'You have new message from Natalie',
      time: '1h ago',
      read: true,
      avatar: '/assets/img/avatars/2.png'
    },
    {
      id: 4,
      text: 'Whoo! You have new order 🛒',
      description: 'ACME Inc. made new order $1,154',
      time: '1 day ago',
      read: false,
      icon: 'ti-shopping-cart',
      color: 'success'
    },
    {
      id: 5,
      text: 'Application has been approved 🚀',
      description: 'Your ABC project application has been approved.',
      time: '2 days ago',
      read: true,
      avatar: '/assets/img/avatars/9.png'
    },
    {
      id: 6,
      text: 'Monthly report is generated',
      description: 'July monthly financial report is generated',
      time: '3 days ago',
      read: true,
      icon: 'ti-chart-pie',
      color: 'success'
    },
    {
      id: 7,
      text: 'Send connection request',
      description: 'Peter sent you connection request',
      time: '4 days ago',
      read: true,
      avatar: '/assets/img/avatars/5.png'
    },
    {
      id: 8,
      text: 'New message from Jane',
      description: 'Your have new message from Jane',
      time: '5 days ago',
      read: false,
      avatar: '/assets/img/avatars/6.png'
    },
    {
      id: 9,
      text: 'CPU is running high',
      description: 'CPU Utilization Percent is currently at 88.63%,',
      time: '5 days ago',
      read: true,
      icon: 'ti-alert-triangle',
      color: 'warning'
    }
  ]);

  const [theme, setTheme] = useState('light');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationScrollRef = useRef(null);
  const perfectScrollbarRef = useRef(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-bs-theme', savedTheme);
  }, []);

  // Initialize Perfect Scrollbar for notifications
  useEffect(() => {
    const initPerfectScrollbar = () => {
      if (notificationScrollRef.current && window.PerfectScrollbar) {
        // Destroy existing instance if any
        if (perfectScrollbarRef.current) {
          perfectScrollbarRef.current.destroy();
        }
        
        // Create new instance
        perfectScrollbarRef.current = new window.PerfectScrollbar(notificationScrollRef.current, {
          wheelPropagation: false,
          suppressScrollX: true
        });
      }
    };

    // Wait for dropdown to be rendered
    const timer = setTimeout(initPerfectScrollbar, 100);

    return () => {
      clearTimeout(timer);
      if (perfectScrollbarRef.current) {
        perfectScrollbarRef.current.destroy();
      }
    };
  }, [notifications.length]);

  // Reinitialize scrollbar when dropdown opens
  useEffect(() => {
    const dropdownElement = document.querySelector('.dropdown-notifications');
    
    const handleDropdownShown = () => {
      if (notificationScrollRef.current && window.PerfectScrollbar) {
        if (perfectScrollbarRef.current) {
          perfectScrollbarRef.current.update();
        } else {
          perfectScrollbarRef.current = new window.PerfectScrollbar(notificationScrollRef.current, {
            wheelPropagation: false,
            suppressScrollX: true
          });
        }
      }
    };

    if (dropdownElement) {
      dropdownElement.addEventListener('shown.bs.dropdown', handleDropdownShown);
      
      return () => {
        dropdownElement.removeEventListener('shown.bs.dropdown', handleDropdownShown);
      };
    }
  }, []);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const markAllAsRead = (e) => {
    e.preventDefault();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id, e) => {
    e.preventDefault();
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id, e) => {
    e.preventDefault();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'John Doe';
  };

  const formatRole = (role) => {
    if (!role) return 'Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && !event.target.closest('.navbar-search-wrapper')) {
        setShowSearch(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSearch]);

  return (
    <>
      {/* Navbar - Match Vuexy original structure */}
      <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
        {/* Mobile Menu Toggle */}
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
          <button
            className="nav-link hide-arrow p-0 border-0 bg-transparent"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="icon-base ti tabler-menu-2 icon-22px"></i>
          </button>
        </div>

        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          {/* Desktop Search */}
          <div className="navbar-nav align-items-center d-none d-xl-flex me-3">
            <div className="nav-item">
              <form className="search-form" onSubmit={handleSearch}>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="icon-base ti tabler-search icon-22px"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search"
                  />
                </div>
              </form>
            </div>
          </div>

          <ul className="navbar-nav flex-row align-items-center ms-auto">
            {/* Language Dropdown */}
            <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
              <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                <i className="icon-base ti tabler-language icon-22px text-heading"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#" data-language="en" data-text-direction="ltr">
                    <span>English</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" data-language="fr" data-text-direction="ltr">
                    <span>French</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" data-language="ar" data-text-direction="rtl">
                    <span>Arabic</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" data-language="de" data-text-direction="ltr">
                    <span>German</span>
                  </a>
                </li>
              </ul>
            </li>
            {/*/ Language */}

            {/* Style Switcher */}
            <li className="nav-item dropdown me-2 me-xl-0">
              <a
                className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                id="nav-theme"
                href="#"
                data-bs-toggle="dropdown">
                <i className={`icon-base ti ${theme === 'light' ? 'tabler-sun' : theme === 'dark' ? 'tabler-moon-stars' : 'tabler-device-desktop-analytics'} icon-22px theme-icon-active text-heading`}></i>
                <span className="d-none ms-2" id="nav-theme-text">Toggle theme</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="nav-theme-text">
                <li>
                  <button
                    type="button"
                    className={`dropdown-item align-items-center ${theme === 'light' ? 'active' : ''}`}
                    data-bs-theme-value="light"
                    onClick={() => changeTheme('light')}>
                    <span><i className="icon-base ti tabler-sun icon-22px me-3" data-icon="sun"></i>Light</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`dropdown-item align-items-center ${theme === 'dark' ? 'active' : ''}`}
                    data-bs-theme-value="dark"
                    onClick={() => changeTheme('dark')}>
                    <span><i className="icon-base ti tabler-moon-stars icon-22px me-3" data-icon="moon-stars"></i>Dark</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`dropdown-item align-items-center ${theme === 'system' ? 'active' : ''}`}
                    data-bs-theme-value="system"
                    onClick={() => changeTheme('system')}>
                    <span><i className="icon-base ti tabler-device-desktop-analytics icon-22px me-3" data-icon="device-desktop-analytics"></i>System</span>
                  </button>
                </li>
              </ul>
            </li>
            {/* / Style Switcher*/}

            {/* Quick links */}
            <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown me-2 me-xl-0">
              <a
                className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                href="#"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false">
                <i className="icon-base ti tabler-layout-grid-add icon-22px text-heading"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-end p-0">
                <div className="dropdown-menu-header border-bottom">
                  <div className="dropdown-header d-flex align-items-center py-3">
                    <h6 className="mb-0 me-auto">Shortcuts</h6>
                    <a
                      href="#"
                      className="dropdown-shortcuts-add py-2 btn btn-text-secondary rounded-pill btn-icon"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Add shortcuts">
                      <i className="icon-base ti tabler-plus icon-20px text-heading"></i>
                    </a>
                  </div>
                </div>
                <div className="dropdown-shortcuts-list scrollable-container">
                  <div className="row row-bordered overflow-visible g-0">
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-calendar icon-26px text-heading"></i>
                      </span>
                      <Link to="/app/calendar" className="stretched-link">Calendar</Link>
                      <small>Appointments</small>
                    </div>
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-file-dollar icon-26px text-heading"></i>
                      </span>
                      <Link to="/app/invoice/list" className="stretched-link">Invoice App</Link>
                      <small>Manage Accounts</small>
                    </div>
                  </div>
                  <div className="row row-bordered overflow-visible g-0">
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-user icon-26px text-heading"></i>
                      </span>
                      <Link to="/app/user/list" className="stretched-link">User App</Link>
                      <small>Manage Users</small>
                    </div>
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-users icon-26px text-heading"></i>
                      </span>
                      <Link to="/app/access/roles" className="stretched-link">Role Management</Link>
                      <small>Permission</small>
                    </div>
                  </div>
                  <div className="row row-bordered overflow-visible g-0">
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-device-desktop-analytics icon-26px text-heading"></i>
                      </span>
                      <Link to="/dashboard" className="stretched-link">Dashboard</Link>
                      <small>User Dashboard</small>
                    </div>
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-settings icon-26px text-heading"></i>
                      </span>
                      <Link to="/pages/account/settings/account" className="stretched-link">Setting</Link>
                      <small>Account Settings</small>
                    </div>
                  </div>
                  <div className="row row-bordered overflow-visible g-0">
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-help-circle icon-26px text-heading"></i>
                      </span>
                      <Link to="/pages/faq" className="stretched-link">FAQs</Link>
                      <small>FAQs & Articles</small>
                    </div>
                    <div className="dropdown-shortcuts-item col">
                      <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                        <i className="icon-base ti tabler-square icon-26px text-heading"></i>
                      </span>
                      <Link to="/modal/examples" className="stretched-link">Modals</Link>
                      <small>Useful Popups</small>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* Quick links */}

            {/* Notification */}
            <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-2">
              <a
                className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
                href="#"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false">
                <span className="position-relative">
                  <i className="icon-base ti tabler-bell icon-22px text-heading"></i>
                  {unreadCount > 0 && (
                    <span className="badge rounded-pill bg-danger badge-dot badge-notifications border"></span>
                  )}
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end p-0">
                <li className="dropdown-menu-header border-bottom">
                  <div className="dropdown-header d-flex align-items-center py-3">
                    <h6 className="mb-0 me-auto">Notification</h6>
                    <div className="d-flex align-items-center h6 mb-0">
                      {unreadCount > 0 && (
                        <span className="badge bg-label-primary me-2">{unreadCount} New</span>
                      )}
                      <a
                        href="#"
                        className="dropdown-notifications-all p-2 btn btn-icon"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Mark all as read"
                        onClick={markAllAsRead}>
                        <i className="icon-base ti tabler-mail-opened text-heading"></i>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="dropdown-notifications-list scrollable-container ps" 
                    ref={notificationScrollRef}
                    style={{ maxHeight: '21rem', position: 'relative' }}>
                  <ul className="list-group list-group-flush">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`list-group-item list-group-item-action dropdown-notifications-item ${
                          notification.read ? 'marked-as-read' : ''
                        }`}
                      >
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              {notification.avatar ? (
                                <img
                                  src={notification.avatar}
                                  alt=""
                                  className="rounded-circle"
                                />
                              ) : notification.initials ? (
                                <span className={`avatar-initial rounded-circle bg-label-${notification.color}`}>
                                  {notification.initials}
                                </span>
                              ) : (
                                <span className={`avatar-initial rounded-circle bg-label-${notification.color}`}>
                                  <i className={`icon-base ti ${notification.icon}`}></i>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-grow-1">
                            <h6 className="small mb-1">{notification.text}</h6>
                            <small className="mb-1 d-block text-body">{notification.description}</small>
                            <small className="text-body-secondary">{notification.time}</small>
                          </div>

                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a
                              href="#"
                              className="dropdown-notifications-read"
                              onClick={(e) => markAsRead(notification.id, e)}
                            >
                              <span className="badge badge-dot"></span>
                            </a>
                            <a
                              href="#"
                              className="dropdown-notifications-archive"
                              onClick={(e) => deleteNotification(notification.id, e)}
                            >
                              <span className="icon-base ti tabler-x"></span>
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="border-top">
                  <div className="d-grid p-4">
                    <a className="btn btn-primary btn-sm d-flex" href="#">
                      <small className="align-middle">View all notifications</small>
                    </a>
                  </div>
                </li>
              </ul>
            </li>
            {/*/ Notification */}

            {/* User */}
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                className="nav-link dropdown-toggle hide-arrow p-0"
                href="#"
                data-bs-toggle="dropdown">
                <div className="avatar avatar-online">
                  <img 
                    src="/assets/img/avatars/1.png" 
                    alt="" 
                    className="rounded-circle"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=random`;
                    }}
                  />
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item mt-0" href="/pages/account/settings/account">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <div className="avatar avatar-online">
                          <img
                            src="/assets/img/avatars/1.png"
                            alt=""
                            className="rounded-circle"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=random`;
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{getUserDisplayName()}</h6>
                        <small className="text-body-secondary">{formatRole(user?.role)}</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider my-1 mx-n2"></div>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pages/profile/user">
                    <i className="icon-base ti tabler-user me-3 icon-md"></i>
                    <span className="align-middle">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pages/account/settings/account">
                    <i className="icon-base ti tabler-settings me-3 icon-md"></i>
                    <span className="align-middle">Settings</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pages/account/settings/billing">
                    <span className="d-flex align-items-center align-middle">
                      <i className="flex-shrink-0 icon-base ti tabler-file-dollar me-3 icon-md"></i>
                      <span className="flex-grow-1 align-middle">Billing</span>
                      <span className="flex-shrink-0 badge bg-danger d-flex align-items-center justify-content-center">4</span>
                    </span>
                  </Link>
                </li>
                <li>
                  <div className="dropdown-divider my-1 mx-n2"></div>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pages/pricing">
                    <i className="icon-base ti tabler-currency-dollar me-3 icon-md"></i>
                    <span className="align-middle">Pricing</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/pages/faq">
                    <i className="icon-base ti tabler-question-mark me-3 icon-md"></i>
                    <span className="align-middle">FAQ</span>
                  </Link>
                </li>
                <li>
                  <div className="d-grid px-2 pt-2 pb-1">
                    <button className="btn btn-sm btn-danger d-flex" onClick={handleLogout}>
                      <small className="align-middle">Logout</small>
                      <i className="icon-base ti tabler-logout ms-2 icon-14px"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </li>
            {/*/ User */}
          </ul>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="navbar-search-wrapper search-input-wrapper d-block d-xl-none">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <i className="icon-base ti tabler-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="input-group-text bg-transparent border-0"
                onClick={() => setShowSearch(false)}
              >
                <i className="icon-base ti tabler-x"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Navbar;