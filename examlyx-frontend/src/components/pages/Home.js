import React from 'react';

const Home = () => {
  return (
    <div className="row g-6">
      {/* Website Analytics Card */}
      <div className="col-xl-6 col">
        <div className="swiper-container swiper-container-horizontal swiper swiper-card-advance-bg" id="swiper-with-pagination-cards">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="row">
                <div className="col-12">
                  <h5 className="text-white mb-0">Website Analytics</h5>
                  <small>Total 28.5% Conversion Rate</small>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-md-9 col-12 order-2 order-md-1 pt-md-9">
                    <h6 className="text-white mt-0 mt-md-3 mb-4">Traffic</h6>
                    <div className="row">
                      <div className="col-6">
                        <ul className="list-unstyled mb-0">
                          <li className="d-flex mb-4 align-items-center">
                            <p className="mb-0 fw-medium me-2 website-analytics-text-bg">28%</p>
                            <p className="mb-0">Sessions</p>
                          </li>
                          <li className="d-flex align-items-center">
                            <p className="mb-0 fw-medium me-2 website-analytics-text-bg">1.2k</p>
                            <p className="mb-0">Leads</p>
                          </li>
                        </ul>
                      </div>
                      <div className="col-6">
                        <ul className="list-unstyled mb-0">
                          <li className="d-flex mb-4 align-items-center">
                            <p className="mb-0 fw-medium me-2 website-analytics-text-bg">3.1k</p>
                            <p className="mb-0">Page Views</p>
                          </li>
                          <li className="d-flex align-items-center">
                            <p className="mb-0 fw-medium me-2 website-analytics-text-bg">12%</p>
                            <p className="mb-0">Conversions</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-3 col-12 order-1 order-md-2 my-4 my-md-0 text-center">
                    <img src="../../assets/img/illustrations/card-website-analytics-1.png" alt="Website Analytics" height="150" className="card-website-analytics-img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>

      {/* Average Daily Sales */}
      <div className="col-xl-3 col-sm-6">
        <div className="card h-100">
          <div className="card-header pb-0">
            <h5 className="mb-3 card-title">Average Daily Sales</h5>
            <p className="mb-0 text-body">Total Sales This Month</p>
            <h4 className="mb-0">$28,450</h4>
          </div>
          <div className="card-body px-0">
            <div id="averageDailySales"></div>
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="col-xl-3 col-sm-6">
        <div className="card h-100">
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <p className="mb-0 text-body">Sales Overview</p>
              <p className="card-text fw-medium text-success">+18.2%</p>
            </div>
            <h4 className="card-title mb-1">$42.5k</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <div className="d-flex gap-2 align-items-center mb-2">
                  <span className="badge bg-label-info p-1 rounded">
                    <i className="icon-base ti tabler-shopping-cart icon-sm"></i>
                  </span>
                  <p className="mb-0">Order</p>
                </div>
                <h5 className="mb-0 pt-1">62.2%</h5>
                <small className="text-body-secondary">6,440</small>
              </div>
              <div className="col-4">
                <div className="divider divider-vertical">
                  <div className="divider-text">
                    <span className="badge-divider-bg bg-label-secondary">VS</span>
                  </div>
                </div>
              </div>
              <div className="col-4 text-end">
                <div className="d-flex gap-2 justify-content-end align-items-center mb-2">
                  <p className="mb-0">Visits</p>
                  <span className="badge bg-label-primary p-1 rounded">
                    <i className="icon-base ti tabler-link icon-sm"></i>
                  </span>
                </div>
                <h5 className="mb-0 pt-1">25.5%</h5>
                <small className="text-body-secondary">12,749</small>
              </div>
            </div>
            <div className="d-flex align-items-center mt-6">
              <div className="progress w-100" style={{height: '10px'}}>
                <div className="progress-bar bg-info" style={{width: '70%'}} role="progressbar"></div>
                <div className="progress-bar bg-primary" style={{width: '30%'}} role="progressbar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earning Reports */}
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header pb-0 d-flex justify-content-between">
            <div className="card-title mb-0">
              <h5 className="mb-1">Earning Reports</h5>
              <p className="card-subtitle">Weekly Earnings Overview</p>
            </div>
            <div className="dropdown">
              <button className="btn btn-text-secondary rounded-pill text-body-secondary border-0 p-2 me-n1" type="button" data-bs-toggle="dropdown">
                <i className="icon-base ti tabler-dots-vertical icon-md text-body-secondary"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item" href="javascript:void(0)">View More</a>
                <a className="dropdown-item" href="javascript:void(0)">Delete</a>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center g-md-8">
              <div className="col-12 col-md-5 d-flex flex-column">
                <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
                  <h2 className="mb-0">$468</h2>
                  <div className="badge rounded bg-label-success">+4.2%</div>
                </div>
                <small className="text-body">You informed of this week compared to last week</small>
              </div>
              <div className="col-12 col-md-7 ps-xl-8">
                <div id="weeklyEarningReports"></div>
              </div>
            </div>
            <div className="border rounded p-5 mt-5">
              <div className="row gap-4 gap-sm-0">
                <div className="col-12 col-sm-4">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="badge rounded bg-label-primary p-1">
                      <i className="icon-base ti tabler-currency-dollar icon-18px"></i>
                    </div>
                    <h6 className="mb-0 fw-normal">Earnings</h6>
                  </div>
                  <h4 className="my-2">$545.69</h4>
                  <div className="progress w-75" style={{height:'4px'}}>
                    <div className="progress-bar" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="badge rounded bg-label-info p-1">
                      <i className="icon-base ti tabler-chart-pie-2 icon-18px"></i>
                    </div>
                    <h6 className="mb-0 fw-normal">Profit</h6>
                  </div>
                  <h4 className="my-2">$256.34</h4>
                  <div className="progress w-75" style={{height:'4px'}}>
                    <div className="progress-bar bg-info" style={{width: '50%'}}></div>
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="badge rounded bg-label-danger p-1">
                      <i className="icon-base ti tabler-brand-paypal icon-18px"></i>
                    </div>
                    <h6 className="mb-0 fw-normal">Expense</h6>
                  </div>
                  <h4 className="my-2">$74.19</h4>
                  <div className="progress w-75" style={{height:'4px'}}>
                    <div className="progress-bar bg-danger" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tracker */}
      <div className="col-12 col-md-6">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between">
            <div className="card-title mb-0">
              <h5 className="mb-1">Support Tracker</h5>
              <p className="card-subtitle">Last 7 Days</p>
            </div>
          </div>
          <div className="card-body row">
            <div className="col-12 col-sm-4">
              <div className="mt-lg-4 mt-lg-2 mb-lg-6 mb-2">
                <h2 className="mb-0">164</h2>
                <p className="mb-0">Total Tickets</p>
              </div>
              <ul className="p-0 m-0">
                <li className="d-flex gap-4 align-items-center mb-lg-3 pb-1">
                  <div className="badge rounded bg-label-primary p-1_5">
                    <i className="icon-base ti tabler-ticket icon-md"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-nowrap">New Tickets</h6>
                    <small className="text-body-secondary">142</small>
                  </div>
                </li>
                <li className="d-flex gap-4 align-items-center mb-lg-3 pb-1">
                  <div className="badge rounded bg-label-info p-1_5">
                    <i className="icon-base ti tabler-circle-check icon-md"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-nowrap">Open Tickets</h6>
                    <small className="text-body-secondary">28</small>
                  </div>
                </li>
                <li className="d-flex gap-4 align-items-center pb-1">
                  <div className="badge rounded bg-label-warning p-1_5">
                    <i className="icon-base ti tabler-clock icon-md"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 text-nowrap">Response Time</h6>
                    <small className="text-body-secondary">1 Day</small>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-8">
              <div id="supportTracker"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales by Countries */}
      <div className="col-xxl-4 col-md-6 order-1 order-xl-0">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between">
            <div className="card-title mb-0">
              <h5 className="mb-1">Sales by Countries</h5>
              <p className="card-subtitle">Monthly Sales Overview</p>
            </div>
          </div>
          <div className="card-body">
            <ul className="p-0 m-0">
              <li className="d-flex align-items-center mb-4">
                <div className="avatar flex-shrink-0 me-4">
                  <i className="fis fi fi-us rounded-circle fs-2"></i>
                </div>
                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div className="me-2">
                    <h6 className="mb-0 me-1">$8,567k</h6>
                    <small className="text-body">United states</small>
                  </div>
                  <div className="user-progress">
                    <p className="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                      <i className="icon-base ti tabler-chevron-up"></i>25.8%
                    </p>
                  </div>
                </div>
              </li>
              <li className="d-flex align-items-center mb-4">
                <div className="avatar flex-shrink-0 me-4">
                  <i className="fis fi fi-br rounded-circle fs-2"></i>
                </div>
                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div className="me-2">
                    <h6 className="mb-0 me-1">$2,415k</h6>
                    <small className="text-body">Brazil</small>
                  </div>
                  <div className="user-progress">
                    <p className="text-danger fw-medium mb-0 d-flex align-items-center gap-1">
                      <i className="icon-base ti tabler-chevron-down"></i>6.2%
                    </p>
                  </div>
                </div>
              </li>
              <li className="d-flex align-items-center mb-4">
                <div className="avatar flex-shrink-0 me-4">
                  <i className="fis fi fi-in rounded-circle fs-2"></i>
                </div>
                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div className="me-2">
                    <h6 className="mb-0 me-1">$865k</h6>
                    <small className="text-body">India</small>
                  </div>
                  <div className="user-progress">
                    <p className="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                      <i className="icon-base ti tabler-chevron-up"></i>12.4%
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="col-xxl-8">
        <div className="card">
          <div className="table-responsive mb-4">
            <table className="table datatable-project table-sm">
              <thead className="border-top">
                <tr>
                  <th></th>
                  <th></th>
                  <th>Project</th>
                  <th>Leader</th>
                  <th>Team</th>
                  <th className="w-px-200">Progress</th>
                  <th>Action</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;