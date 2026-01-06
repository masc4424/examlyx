import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  return (
    <aside id="layout-menu" className={`layout-menu menu-vertical menu ${collapsed ? 'menu-collapsed' : ''}`}>
      <div className="app-brand demo">
        <Link to="/dashboard" className="app-brand-link">
          <span className="app-brand-logo demo">
            <span className="text-primary">
              <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.06"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                  fill="#161616"
                />
                <path
                  opacity="0.06"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                  fill="#161616"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-3">Vuexy</span>
        </Link>

        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto">
          <i className="icon-base ti menu-toggle-icon d-none d-xl-block"></i>
          <i className="icon-base ti tabler-x d-block d-xl-none"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {/* Dashboards */}
        <li className="menu-item active open">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-smart-home"></i>
            <div data-i18n="Dashboards">Dashboards</div>
            <div className="badge text-bg-danger rounded-pill ms-auto">5</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item ${location.pathname === '/dashboard' || location.pathname === '/dashboard/home' ? 'active' : ''}`}>
              <Link to="/dashboard/home" className="menu-link">
                <div data-i18n="Analytics">Analytics</div>
              </Link>
            </li>
            <li className="menu-item">
              <a href="dashboards-crm.html" className="menu-link">
                <div data-i18n="CRM">CRM</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-ecommerce-dashboard.html" className="menu-link">
                <div data-i18n="eCommerce">eCommerce</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-logistics-dashboard.html" className="menu-link">
                <div data-i18n="Logistics">Logistics</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-academy-dashboard.html" className="menu-link">
                <div data-i18n="Academy">Academy</div>
              </a>
            </li>
          </ul>
        </li>

        {/* Layouts */}
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-layout-sidebar"></i>
            <div data-i18n="Layouts">Layouts</div>
          </a>

          <ul className="menu-sub">
            <li className="menu-item">
              <a href="layouts-collapsed-menu.html" className="menu-link">
                <div data-i18n="Collapsed menu">Collapsed menu</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-content-navbar.html" className="menu-link">
                <div data-i18n="Content navbar">Content navbar</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-content-navbar-with-sidebar.html" className="menu-link">
                <div data-i18n="Content nav + Sidebar">Content nav + Sidebar</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="../horizontal-menu-template/" className="menu-link" target="_blank" rel="noopener noreferrer">
                <div data-i18n="Horizontal">Horizontal</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-without-menu.html" className="menu-link">
                <div data-i18n="Without menu">Without menu</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-without-navbar.html" className="menu-link">
                <div data-i18n="Without navbar">Without navbar</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-fluid.html" className="menu-link">
                <div data-i18n="Fluid">Fluid</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-container.html" className="menu-link">
                <div data-i18n="Container">Container</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="layouts-blank.html" className="menu-link">
                <div data-i18n="Blank">Blank</div>
              </a>
            </li>
          </ul>
        </li>

        {/* Front Pages */}
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-files"></i>
            <div data-i18n="Front Pages">Front Pages</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="../front-pages/landing-page.html" className="menu-link" target="_blank" rel="noopener noreferrer">
                <div data-i18n="Landing">Landing</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="../front-pages/pricing-page.html" className="menu-link" target="_blank" rel="noopener noreferrer">
                <div data-i18n="Pricing">Pricing</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="../front-pages/payment-page.html" className="menu-link" target="_blank" rel="noopener noreferrer">
                <div data-i18n="Payment">Payment</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="../front-pages/checkout-page.html" className="menu-link" target="_blank" rel="noopener noreferrer">
                <div data-i18n="Checkout">Checkout</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="../front-pages/help-center-landing.html" className="menu-link" target="_blank" rel="noopener noreferrer">
                <div data-i18n="Help Center">Help Center</div>
              </a>
            </li>
          </ul>
        </li>

        {/* Apps & Pages */}
        <li className="menu-header small">
          <span className="menu-header-text" data-i18n="Apps & Pages">Apps &amp; Pages</span>
        </li>
        <li className="menu-item">
          <a href="app-email.html" className="menu-link">
            <i className="menu-icon icon-base ti tabler-mail"></i>
            <div data-i18n="Email">Email</div>
          </a>
        </li>
        <li className="menu-item">
          <a href="app-chat.html" className="menu-link">
            <i className="menu-icon icon-base ti tabler-messages"></i>
            <div data-i18n="Chat">Chat</div>
          </a>
        </li>
        <li className="menu-item">
          <a href="app-calendar.html" className="menu-link">
            <i className="menu-icon icon-base ti tabler-calendar"></i>
            <div data-i18n="Calendar">Calendar</div>
          </a>
        </li>
        <li className="menu-item">
          <a href="app-kanban.html" className="menu-link">
            <i className="menu-icon icon-base ti tabler-layout-kanban"></i>
            <div data-i18n="Kanban">Kanban</div>
          </a>
        </li>

        {/* e-commerce-app menu start */}
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-shopping-cart"></i>
            <div data-i18n="eCommerce">eCommerce</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="app-ecommerce-dashboard.html" className="menu-link">
                <div data-i18n="Dashboard">Dashboard</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <div data-i18n="Products">Products</div>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="app-ecommerce-product-list.html" className="menu-link">
                    <div data-i18n="Product List">Product List</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-product-add.html" className="menu-link">
                    <div data-i18n="Add Product">Add Product</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-category-list.html" className="menu-link">
                    <div data-i18n="Category List">Category List</div>
                  </a>
                </li>
              </ul>
            </li>
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <div data-i18n="Order">Order</div>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="app-ecommerce-order-list.html" className="menu-link">
                    <div data-i18n="Order List">Order List</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-order-details.html" className="menu-link">
                    <div data-i18n="Order Details">Order Details</div>
                  </a>
                </li>
              </ul>
            </li>
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <div data-i18n="Customer">Customer</div>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="app-ecommerce-customer-all.html" className="menu-link">
                    <div data-i18n="All Customers">All Customers</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Customer Details">Customer Details</div>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <a href="app-ecommerce-customer-details-overview.html" className="menu-link">
                        <div data-i18n="Overview">Overview</div>
                      </a>
                    </li>
                    <li className="menu-item">
                      <a href="app-ecommerce-customer-details-security.html" className="menu-link">
                        <div data-i18n="Security">Security</div>
                      </a>
                    </li>
                    <li className="menu-item">
                      <a href="app-ecommerce-customer-details-billing.html" className="menu-link">
                        <div data-i18n="Address & Billing">Address & Billing</div>
                      </a>
                    </li>
                    <li className="menu-item">
                      <a href="app-ecommerce-customer-details-notifications.html" className="menu-link">
                        <div data-i18n="Notifications">Notifications</div>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="menu-item">
              <a href="app-ecommerce-manage-reviews.html" className="menu-link">
                <div data-i18n="Manage Reviews">Manage Reviews</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-ecommerce-referral.html" className="menu-link">
                <div data-i18n="Referrals">Referrals</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <div data-i18n="Settings">Settings</div>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="app-ecommerce-settings-detail.html" className="menu-link">
                    <div data-i18n="Store Details">Store Details</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-settings-payments.html" className="menu-link">
                    <div data-i18n="Payments">Payments</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-settings-checkout.html" className="menu-link">
                    <div data-i18n="Checkout">Checkout</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-settings-shipping.html" className="menu-link">
                    <div data-i18n="Shipping & Delivery">Shipping & Delivery</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-settings-locations.html" className="menu-link">
                    <div data-i18n="Locations">Locations</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-ecommerce-settings-notifications.html" className="menu-link">
                    <div data-i18n="Notifications">Notifications</div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        {/* e-commerce-app menu end */}

        {/* Academy menu start */}
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-book"></i>
            <div data-i18n="Academy">Academy</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="app-academy-dashboard.html" className="menu-link">
                <div data-i18n="Dashboard">Dashboard</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-academy-course.html" className="menu-link">
                <div data-i18n="My Course">My Course</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-academy-course-details.html" className="menu-link">
                <div data-i18n="Course Details">Course Details</div>
              </a>
            </li>
          </ul>
        </li>
        {/* Academy menu end */}

        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-truck"></i>
            <div data-i18n="Logistics">Logistics</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="app-logistics-dashboard.html" className="menu-link">
                <div data-i18n="Dashboard">Dashboard</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-logistics-fleet.html" className="menu-link">
                <div data-i18n="Fleet">Fleet</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-file-dollar"></i>
            <div data-i18n="Invoice">Invoice</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="app-invoice-list.html" className="menu-link">
                <div data-i18n="List">List</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-invoice-preview.html" className="menu-link">
                <div data-i18n="Preview">Preview</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-invoice-edit.html" className="menu-link">
                <div data-i18n="Edit">Edit</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-invoice-add.html" className="menu-link">
                <div data-i18n="Add">Add</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-users"></i>
            <div data-i18n="Users">Users</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="app-user-list.html" className="menu-link">
                <div data-i18n="List">List</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <div data-i18n="View">View</div>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="app-user-view-account.html" className="menu-link">
                    <div data-i18n="Account">Account</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-user-view-security.html" className="menu-link">
                    <div data-i18n="Security">Security</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-user-view-billing.html" className="menu-link">
                    <div data-i18n="Billing & Plans">Billing & Plans</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-user-view-notifications.html" className="menu-link">
                    <div data-i18n="Notifications">Notifications</div>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="app-user-view-connections.html" className="menu-link">
                    <div data-i18n="Connections">Connections</div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-settings"></i>
            <div data-i18n="Roles & Permissions">Roles & Permissions</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="app-access-roles.html" className="menu-link">
                <div data-i18n="Roles">Roles</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="app-access-permission.html" className="menu-link">
                <div data-i18n="Permission">Permission</div>
              </a>
            </li>
          </ul>
        </li>

        {/* Components */}
        <li className="menu-header small">
          <span className="menu-header-text" data-i18n="Components">Components</span>
        </li>
        
        {/* Cards */}
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon icon-base ti tabler-id"></i>
            <div data-i18n="Cards">Cards</div>
            <div className="badge text-bg-primary rounded-pill ms-auto">5</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="cards-basic.html" className="menu-link">
                <div data-i18n="Basic">Basic</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="cards-advance.html" className="menu-link">
                <div data-i18n="Advance">Advance</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="cards-statistics.html" className="menu-link">
                <div data-i18n="Statistics">Statistics</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="cards-analytics.html" className="menu-link">
                <div data-i18n="Analytics">Analytics</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="cards-actions.html" className="menu-link">
                <div data-i18n="Actions">Actions</div>
              </a>
            </li>
          </ul>
        </li>

        {/* Misc */}
        <li className="menu-header small">
          <span className="menu-header-text" data-i18n="Misc">Misc</span>
        </li>
        <li className="menu-item">
          <a href="https://pixinvent.ticksy.com/" target="_blank" rel="noopener noreferrer" className="menu-link">
            <i className="menu-icon icon-base ti tabler-lifebuoy"></i>
            <div data-i18n="Support">Support</div>
          </a>
        </li>
        <li className="menu-item">
          <a
            href="https://demos.pixinvent.com/vuexy-html-admin-template/documentation/"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-link">
            <i className="menu-icon icon-base ti tabler-file-description"></i>
            <div data-i18n="Documentation">Documentation</div>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;