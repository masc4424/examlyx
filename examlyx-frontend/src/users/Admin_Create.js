import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';
import { clientAPI, adminAPI } from '../services/api';
import { ensureCSRFToken } from '../services/csrf';

const Admin_Create = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirm: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  useEffect(() => {
    ensureCSRFToken();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      try {
        setLoading(true);
        if (user?.roles?.includes('superadmin')) {
          const res = await clientAPI.getClients();
          setClients(res.data);
        } else {
          const clientId = user?.client_id;
          setSelectedClient(clientId);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Initialization Failed',
          text: 'Unable to load required data. Please try again.',
          confirmButtonColor: '#696cff'
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [authLoading, user]);

  const checkPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { label: '', color: '' },
      { label: 'Weak', color: 'danger' },
      { label: 'Fair', color: 'warning' },
      { label: 'Good', color: 'info' },
      { label: 'Strong', color: 'success' }
    ];

    return { score, ...strengths[Math.min(score, 4)] };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!selectedClient) {
      Swal.fire({
        icon: 'warning',
        title: 'Client Required',
        text: 'Please select a client to continue.',
        confirmButtonColor: '#696cff'
      });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.createAdmin({
        ...formData,
        client_id: selectedClient
      });

      Swal.fire({
        icon: 'success',
        title: 'Admin Created',
        text: 'The administrator account has been created successfully.',
        confirmButtonColor: '#696cff'
      }).then(() => navigate('/dashboard/users/admins'));
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: err.response?.data?.message || 'Unable to create admin account. Please try again.',
        confirmButtonColor: '#696cff'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container-xxl container-p-y">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl container-p-y">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard" className="text-decoration-none">Dashboard</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/dashboard/users/admins" className="text-decoration-none">Administrators</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Create Admin</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Create Administrator</h4>
          <p className="text-muted mb-0">Add a new administrator account to the system</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Client Selection (Superadmin only) */}
                {user?.roles?.includes('superadmin') && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Client Organization <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={selectedClient}
                      onChange={handleClientChange}
                      required
                    >
                      <option value="">-- Select a Client --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <div className="form-text">Choose which organization this admin will belong to</div>
                  </div>
                )}

                {/* Personal Information Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold text-primary mb-3">Personal Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        name="first_name"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        placeholder="Enter first name"
                        required
                        onChange={handleChange}
                        value={formData.first_name}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">{errors.first_name}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        name="last_name"
                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                        placeholder="Enter last name"
                        required
                        onChange={handleChange}
                        value={formData.last_name}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback">{errors.last_name}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold text-primary mb-3">Contact Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="admin@example.com"
                        required
                        onChange={handleChange}
                        value={formData.email}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                      <div className="form-text">This will be used for login credentials</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        name="phone_number"
                        className="form-control"
                        placeholder="+1 (555) 000-0000"
                        onChange={handleChange}
                        value={formData.phone_number}
                      />
                      <div className="form-text">Optional contact number</div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold text-primary mb-3">Security Credentials</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter password"
                        required
                        onChange={handleChange}
                        value={formData.password}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                      {passwordStrength.label && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Password Strength:</small>
                            <small className={`text-${passwordStrength.color} fw-semibold`}>
                              {passwordStrength.label}
                            </small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div
                              className={`progress-bar bg-${passwordStrength.color}`}
                              role="progressbar"
                              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="form-text">Minimum 8 characters recommended</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        name="password_confirm"
                        className={`form-control ${errors.password_confirm ? 'is-invalid' : ''}`}
                        placeholder="Re-enter password"
                        required
                        onChange={handleChange}
                        value={formData.password_confirm}
                      />
                      {errors.password_confirm && (
                        <div className="invalid-feedback">{errors.password_confirm}</div>
                      )}
                      <div className="form-text">Must match the password above</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-top pt-4 mt-4">
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-user-plus me-2"></i>
                          Create Administrator
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => navigate('/dashboard/users/admins')}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-muted small mt-3 mb-0">
                    <i className="bx bx-info-circle me-1"></i>
                    The administrator will receive login credentials via email
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Create;