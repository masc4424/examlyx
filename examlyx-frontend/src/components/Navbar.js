import React, { useState } from 'react';

const Navbar = ({ toggleSidebar, user, onLogout }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Congratulation Lettie 🎉',
      description: 'Won the monthly best seller gold badge',
      time: '1h ago',
      read: false,
      avatar: '../../assets/img/avatars/1.png'
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
      avatar: '../../assets/img/avatars/2.png'
    },
    {
      id: 4,
      text: 'Whoo! You have new order 🛒',
      description: 'ACME Inc. made new order $1,154',
      time: '1 day ago',
      read: false,
      icon: 'tabler-shopping-cart',
      color: 'success'
    },
    {
      id: 5,
      text: 'Application has been approved 🚀',
      description: 'Your ABC project application has been approved.',
      time: '2 days ago',
      read: true,
      avatar: '../../assets/img/avatars/9.png'
    },
    {
      id: 6,
      text: 'Monthly report is generated',
      description: 'July monthly financial report is generated',
      time: '3 days ago',
      read: true,
      icon: 'tabler-chart-pie',
      color: 'success'
    },
    {
      id: 7,
      text: 'Send connection request',
      description: 'Peter sent you connection request',
      time: '4 days ago',
      read: true,
      avatar: '../../assets/img/avatars/5.png'
    },
    {
      id: 8,
      text: 'New message from Jane',
      description: 'Your have new message from Jane',
      time: '5 days ago',
      read: false,
      avatar: '../../assets/img/avatars/6.png'
    },
    {
      id: 9,
      text: 'CPU is running high',
      description: 'CPU Utilization Percent is currently at 88.63%,',
      time: '5 days ago',
      read: true,
      icon: 'tabler-alert-triangle',
      color: 'warning'
    }
  ]);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
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

  return (
    <nav className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme" id="layout-navbar">
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a className="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)" onClick={toggleSidebar}>
          <i className="icon-base ti tabler-menu-2 icon-md"></i>
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
        {/* Search */}
        <div className="navbar-nav align-items-center">
          <div className="nav-item navbar-search-wrapper px-md-0 px-2 mb-0">
            <a className="nav-item nav-link search-toggler d-flex align-items-center px-0" href="javascript:void(0)">
              <span className="d-inline-block text-body-secondary fw-normal" id="autocomplete"></span>
            </a>
          </div>
        </div>

        <ul className="navbar-nav flex-row align-items-center ms-md-auto">
          {/* Language Dropdown */}
          <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
            <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0)" data-bs-toggle="dropdown">
              <i className="icon-base ti tabler-language icon-22px text-heading"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="javascript:void(0)" data-language="en" data-text-direction="ltr">
                  <span>English</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="javascript:void(0)" data-language="fr" data-text-direction="ltr">
                  <span>French</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="javascript:void(0)" data-language="ar" data-text-direction="rtl">
                  <span>Arabic</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="javascript:void(0)" data-language="de" data-text-direction="ltr">
                  <span>German</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Style Switcher */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
              id="nav-theme"
              href="javascript:void(0)"
              data-bs-toggle="dropdown">
              <i className="icon-base ti tabler-sun icon-22px theme-icon-active text-heading"></i>
              <span className="d-none ms-2" id="nav-theme-text">Toggle theme</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="nav-theme-text">
              <li>
                <button
                  type="button"
                  className="dropdown-item align-items-center active"
                  data-bs-theme-value="light"
                  aria-pressed="false">
                  <span><i className="icon-base ti tabler-sun icon-22px me-3" data-icon="sun"></i>Light</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item align-items-center"
                  data-bs-theme-value="dark"
                  aria-pressed="true">
                  <span><i className="icon-base ti tabler-moon-stars icon-22px me-3" data-icon="moon-stars"></i>Dark</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item align-items-center"
                  data-bs-theme-value="system"
                  aria-pressed="false">
                  <span><i className="icon-base ti tabler-device-desktop-analytics icon-22px me-3" data-icon="device-desktop-analytics"></i>System</span>
                </button>
              </li>
            </ul>
          </li>

          {/* Quick links */}
          <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown">
            <a
              className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
              href="javascript:void(0)"
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
                    href="javascript:void(0)"
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
                    <a href="app-calendar.html" className="stretched-link">Calendar</a>
                    <small>Appointments</small>
                  </div>
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-file-dollar icon-26px text-heading"></i>
                    </span>
                    <a href="app-invoice-list.html" className="stretched-link">Invoice App</a>
                    <small>Manage Accounts</small>
                  </div>
                </div>
                <div className="row row-bordered overflow-visible g-0">
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-user icon-26px text-heading"></i>
                    </span>
                    <a href="app-user-list.html" className="stretched-link">User App</a>
                    <small>Manage Users</small>
                  </div>
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-users icon-26px text-heading"></i>
                    </span>
                    <a href="app-access-roles.html" className="stretched-link">Role Management</a>
                    <small>Permission</small>
                  </div>
                </div>
                <div className="row row-bordered overflow-visible g-0">
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-device-desktop-analytics icon-26px text-heading"></i>
                    </span>
                    <a href="index.html" className="stretched-link">Dashboard</a>
                    <small>User Dashboard</small>
                  </div>
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-settings icon-26px text-heading"></i>
                    </span>
                    <a href="pages-account-settings-account.html" className="stretched-link">Setting</a>
                    <small>Account Settings</small>
                  </div>
                </div>
                <div className="row row-bordered overflow-visible g-0">
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-help-circle icon-26px text-heading"></i>
                    </span>
                    <a href="pages-faq.html" className="stretched-link">FAQs</a>
                    <small>FAQs & Articles</small>
                  </div>
                  <div className="dropdown-shortcuts-item col">
                    <span className="dropdown-shortcuts-icon rounded-circle mb-3">
                      <i className="icon-base ti tabler-square icon-26px text-heading"></i>
                    </span>
                    <a href="modal-examples.html" className="stretched-link">Modals</a>
                    <small>Useful Popups</small>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Notification */}
          <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-2">
            <a
              className="nav-link dropdown-toggle hide-arrow btn btn-icon btn-text-secondary rounded-pill"
              href="javascript:void(0)"
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
                    <span className="badge bg-label-primary me-2">{unreadCount} New</span>
                    <a
                      href="javascript:void(0)"
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
              <li className="dropdown-notifications-list scrollable-container">
                <ul className="list-group list-group-flush">
                  {notifications.map((notification) => (
                    <li key={notification.id} className={`list-group-item list-group-item-action dropdown-notifications-item ${notification.read ? 'marked-as-read' : ''}`}>
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="avatar">
                            {notification.avatar ? (
                              <img src={notification.avatar} alt="" className="rounded-circle" />
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
                          <a href="javascript:void(0)" className="dropdown-notifications-read" onClick={() => markAsRead(notification.id)}>
                            <span className="badge badge-dot"></span>
                          </a>
                          <a href="javascript:void(0)" className="dropdown-notifications-archive" onClick={() => deleteNotification(notification.id)}>
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
                  <a className="btn btn-primary btn-sm d-flex" href="javascript:void(0)">
                    <small className="align-middle">View all notifications</small>
                  </a>
                </div>
              </li>
            </ul>
          </li>

          {/* User */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a
              className="nav-link dropdown-toggle hide-arrow p-0"
              href="javascript:void(0)"
              data-bs-toggle="dropdown">
              <div className="avatar avatar-online">
                <img src="../../assets/img/avatars/1.png" alt="" className="rounded-circle" />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item mt-0" href="pages-account-settings-account.html">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-2">
                      <div className="avatar avatar-online">
                        <img src="../../assets/img/avatars/1.png" alt="" className="rounded-circle" />
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
                <a className="dropdown-item" href="pages-profile-user.html">
                  <i className="icon-base ti tabler-user me-3 icon-md"></i>
                  <span className="align-middle">My Profile</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="pages-account-settings-account.html">
                  <i className="icon-base ti tabler-settings me-3 icon-md"></i>
                  <span className="align-middle">Settings</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="pages-account-settings-billing.html">
                  <span className="d-flex align-items-center align-middle">
                    <i className="flex-shrink-0 icon-base ti tabler-file-dollar me-3 icon-md"></i>
                    <span className="flex-grow-1 align-middle">Billing</span>
                    <span className="flex-shrink-0 badge bg-danger d-flex align-items-center justify-content-center">4</span>
                  </span>
                </a>
              </li>
              <li>
                <div className="dropdown-divider my-1 mx-n2"></div>
              </li>
              <li>
                <a className="dropdown-item" href="pages-pricing.html">
                  <i className="icon-base ti tabler-currency-dollar me-3 icon-md"></i>
                  <span className="align-middle">Pricing</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="pages-faq.html">
                  <i className="icon-base ti tabler-question-mark me-3 icon-md"></i>
                  <span className="align-middle">FAQ</span>
                </a>
              </li>
              <li>
                <div className="d-grid px-2 pt-2 pb-1">
                  <a className="btn btn-sm btn-danger d-flex" href="javascript:void(0)" onClick={handleLogout}>
                    <small className="align-middle">Logout</small>
                    <i className="icon-base ti tabler-logout ms-2 icon-14px"></i>
                  </a>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;