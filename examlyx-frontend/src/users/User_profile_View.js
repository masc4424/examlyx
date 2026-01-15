import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IconBriefcase, IconEdit, IconLock, IconExchange } from '@tabler/icons-react';
import { userAPI } from '../services/api';

const User_Profile_View = () => {
  const { userId } = useParams(); // ✅ Correct param from route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getUser(userId); // API call
      setUser(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load user details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ----- Loading State -----
  if (loading) {
    return (
      <div className="container-xxl text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  // ----- Invalid URL / missing ID -----
  if (!userId) {
    return (
      <div className="container-xxl text-center py-5">
        <p className="text-muted">Invalid user URL.</p>
      </div>
    );
  }

  // ----- User Not Found -----
  if (!user) {
    return (
      <div className="container-xxl text-center py-5">
        <p className="text-muted">User not found.</p>
      </div>
    );
  }

  return (
    <div className="container-xxl container-p-y">
      <div className="row">
        {/* Sidebar */}
        <div className="col-xl-4 col-lg-5 col-md-5 order-1 order-md-0">
          <div className="card mb-4">
            <div className="card-body text-center">
              <div className="d-flex flex-column align-items-center">
                {user.user_img ? (
                  <img
                    src={user.user_img}
                    alt="avatar"
                    className="d-block w-px-100 h-px-100 rounded mb-3"
                  />
                ) : (
                  <div className="avatar rounded bg-primary w-px-100 h-px-100 d-flex align-items-center justify-content-center mb-3">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <h4 className="mb-1">{user.full_name}</h4>
                <small>
                  {user.user_type === 's' ? 'Roll No' : 'Employee ID'}: {user.employee_id || 'N/A'}
                </small>
              </div>

              <div className="my-4 d-flex align-items-center gap-2">
                <div className="avatar">
                  <div className="avatar-initial rounded bg-label-primary">
                    <IconBriefcase size={20} />
                  </div>
                </div>
                <div className="d-flex flex-column gap-0">
                  <p className="mb-0 fw-medium">{user.client_name || 'N/A'}</p>
                  <small>{user.roles || 'N/A'}</small>
                </div>
              </div>

              <div className="info-container mt-4 text-start">
                <small className="d-block pt-4 border-top fw-normal text-uppercase text-muted my-3">
                  DETAILS
                </small>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <span className="fw-medium me-2">Email:</span>
                    <span>{user.email || 'N/A'}</span>
                  </li>
                  <li className="mb-3">
                    <span className="fw-medium me-2">Status:</span>
                    {user.is_active ? (
                      <span className="badge bg-label-success">Active</span>
                    ) : (
                      <span className="badge bg-label-danger">Inactive</span>
                    )}
                  </li>
                  <li className="mb-3">
                    <span className="fw-medium me-2">DOB:</span>
                    <span>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span>
                  </li>
                  <li className="mb-3">
                    <span className="fw-medium me-2">Contact:</span>
                    <span>{user.mobile || 'N/A'}</span>
                  </li>
                  <li className="mb-3">
                    <span className="fw-medium me-2">Country:</span>
                    <span>{user.country_name || 'N/A'}</span>
                  </li>
                </ul>

                <div className="d-flex justify-content-center">
                  <Link
                    to={`/dashboard/users/${user.id}/edit`}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <IconEdit size={16} className="me-2" />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-xl-8 col-lg-7 col-md-7 order-0 order-md-1">
          <div className="row">
            <div className="col-12">
              <ul className="nav nav-pills mb-3">
                <li className="nav-item">
                  <span className="nav-link active d-flex align-items-center">
                    <IconExchange size={16} className="me-1" />
                    Account Switch
                  </span>
                </li>
                <li className="nav-item">
                  <Link
                    to={`/dashboard/users/${user.id}/security`}
                    className="nav-link d-flex align-items-center"
                  >
                    <IconLock size={16} className="me-1" />
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Account Switch */}
          {user.accounts?.length > 0 ? (
            <div className="card mt-3">
              <div className="card-body">
                <h6 className="mb-3">Choose an account</h6>
                {user.accounts.map((acc, idx) => (
                  <div key={idx} className="mb-3">
                    <p className="mb-1">
                      {acc.account_name} ({acc.type_name})
                    </p>
                    <small>Role: {acc.role_name}</small>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted mt-3">No linked accounts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default User_Profile_View;
