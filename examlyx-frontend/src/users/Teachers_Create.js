import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../services/api';
import { ensureCSRFToken } from '../services/csrf';

const Teachers_Create = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    phone_number: '',
    course: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Ensure CSRF token is loaded on component mount
  useEffect(() => {
    ensureCSRFToken();
  }, []);

  /* ---------------- PASSWORD VALIDATION ---------------- */

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    setPasswordChecks(checks);
    return Object.values(checks).every(Boolean);
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      setPasswordMatchMessage('');
      return '';
    }

    if (password === confirmPassword) {
      setPasswordMatchMessage('✓ Passwords match');
      return '';
    } else {
      setPasswordMatchMessage('✗ Passwords do not match');
      return 'Passwords do not match';
    }
  };

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      if (name === 'password') {
        validatePassword(value);
        const msg = validateConfirmPassword(value, updated.password_confirm);
        setErrors(prev => ({ ...prev, password_confirm: msg }));
      }

      if (name === 'password_confirm') {
        const msg = validateConfirmPassword(updated.password, value);
        setErrors(prev => ({ ...prev, password_confirm: msg }));
      }

      return updated;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /* ---------------- FORM VALIDATION ---------------- */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password does not meet requirements';
    }

    const confirmError = validateConfirmPassword(
      formData.password,
      formData.password_confirm
    );

    if (confirmError) {
      newErrors.password_confirm = confirmError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Prepare data exactly as backend expects
      const teacherData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number || null,
        course: formData.course || null
      };

      // Send request
      const response = await teacherAPI.createTeacher(teacherData);
      
      if (response.status === 201) {
        alert('Teacher created successfully');
        navigate('/dashboard/users/teachers');
      }
    } catch (err) {
      console.error('Error creating teacher:', err);
      
      // Handle validation errors from backend
      if (err.response?.data) {
        const backendErrors = err.response.data;
        
        // Update frontend errors with backend validation errors
        const newErrors = {};
        Object.keys(backendErrors).forEach(key => {
          newErrors[key] = Array.isArray(backendErrors[key]) 
            ? backendErrors[key].join(', ') 
            : backendErrors[key];
        });
        
        setErrors(newErrors);
        
        if (!Object.keys(newErrors).length && err.response.data.error) {
          alert(err.response.data.error);
        }
      } else {
        alert('Failed to create teacher. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Create Teacher</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">

              {/* First Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name *</label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  className={`form-control ${errors.first_name && 'is-invalid'}`}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.first_name}</div>
              </div>

              {/* Last Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name *</label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  className={`form-control ${errors.last_name && 'is-invalid'}`}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.last_name}</div>
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Password *</label>

                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    onChange={handleChange}
                  />
                  <span
                    className="input-group-text cursor-pointer"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    <i className={`icon-base ti ${showPassword ? 'tabler-eye-off' : 'tabler-eye'}`} />
                  </span>
                </div>

                <ul className="small mt-2 ps-3">
                  <li className={passwordChecks.length ? 'text-success' : 'text-danger'}>8+ characters</li>
                  <li className={passwordChecks.uppercase ? 'text-success' : 'text-danger'}>Uppercase letter</li>
                  <li className={passwordChecks.lowercase ? 'text-success' : 'text-danger'}>Lowercase letter</li>
                  <li className={passwordChecks.number ? 'text-success' : 'text-danger'}>Number</li>
                  <li className={passwordChecks.special ? 'text-success' : 'text-danger'}>Special character</li>
                </ul>
              </div>

              {/* Confirm Password */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirm Password *</label>

                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirm"
                    value={formData.password_confirm}
                    className={`form-control ${
                      errors.password_confirm
                        ? 'is-invalid'
                        : passwordMatchMessage.includes('✓')
                        ? 'is-valid'
                        : ''
                    }`}
                    onChange={handleChange}
                  />
                  <span
                    className="input-group-text cursor-pointer"
                    onClick={() => setShowConfirmPassword(p => !p)}
                  >
                    <i className={`icon-base ti ${showConfirmPassword ? 'tabler-eye-off' : 'tabler-eye'}`} />
                  </span>
                </div>

                {passwordMatchMessage && (
                  <div
                    className={`small mt-1 ${
                      passwordMatchMessage.includes('✓')
                        ? 'text-success'
                        : 'text-danger'
                    }`}
                  >
                    {passwordMatchMessage}
                  </div>
                )}
              </div>

              {/* Course */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Course</label>
                <input
                  name="course"
                  value={formData.course}
                  className="form-control"
                  placeholder="Optional"
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mt-4">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Teacher'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={() => navigate('/dashboard/users/teachers')}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Teachers_Create;