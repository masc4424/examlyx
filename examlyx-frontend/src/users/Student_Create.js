import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';
import {
  clientAPI,
  programAPI,
  batchAPI,
  programCourseAPI,
  batchCourseAPI,
  studentAPI
} from '../services/api';
import { ensureCSRFToken } from '../services/csrf';
import { IconEye, IconEyeOff, IconUserPlus } from '@tabler/icons-react';

const Student_Create = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const isSuperAdmin = user?.role === 'superadmin' || user?.roles?.includes('superadmin');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedClient, setSelectedClient] = useState('');
  const [clientSettings, setClientSettings] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirm: '',
    program: '',
    batch: '',
    course: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------------- CSRF ---------------- */
  useEffect(() => {
    ensureCSRFToken();
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      try {
        setLoading(true);
        if (isSuperAdmin) {
          const res = await clientAPI.getClients();
          setClients(res.data);
        } else {
          const clientId = user?.client_id;
          setSelectedClient(clientId);
          await loadClientData(clientId);
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
  }, [authLoading, isSuperAdmin]);

  /* ---------------- LOAD CLIENT DATA ---------------- */
  const loadClientData = async (clientId) => {
    if (!clientId) return;

    try {
      const settingsRes = await clientAPI.getClientSettings(clientId);
      const settings = settingsRes.data;
      setClientSettings(settings);

      setPrograms([]);
      setBatches([]);
      setCourses([]);
      setFormData(prev => ({ ...prev, program: '', batch: '', course: '' }));

      if (settings.is_course_program_flow === true) {
        const pRes = await programAPI.getPrograms(clientId);
        setPrograms(pRes.data);
        return;
      }

      if (settings.is_course_batch_flow === true) {
        const bRes = await batchAPI.getBatches(clientId);
        setBatches(bRes.data);
        return;
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load',
        text: 'Unable to load client settings. Please try again.',
        confirmButtonColor: '#696cff'
      });
    }
  };

  /* ---------------- HANDLERS ---------------- */
  const handleClientChange = async (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    if (clientId) {
      setLoading(true);
      await loadClientData(clientId);
      setLoading(false);
    }
  };

  const handleProgramChange = async (e) => {
    const programId = e.target.value;
    setFormData(prev => ({ ...prev, program: programId, course: '' }));
    setCourses([]);
    if (programId) {
      const res = await programCourseAPI.getCoursesByProgram(programId);
      setCourses(res.data);
    }
  };

  const handleBatchChange = async (e) => {
    const batchId = e.target.value;
    setFormData(prev => ({ ...prev, batch: batchId, course: '' }));
    setCourses([]);
    if (batchId) {
      const res = await batchCourseAPI.getCoursesByBatch(batchId);
      setCourses(res.data);
    }
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

  /* ---------------- PASSWORD STRENGTH ---------------- */
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

  /* ---------------- VALIDATION & SUBMIT ---------------- */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const showProgram = clientSettings?.is_course_program_flow === true;
    const showBatch = clientSettings?.is_course_batch_flow === true;

    if (!selectedClient) {
      Swal.fire({ icon: 'warning', title: 'Client Required', text: 'Please select a client to continue.', confirmButtonColor: '#696cff' });
      return;
    }
    if (showProgram && !formData.program) {
      Swal.fire({ icon: 'warning', title: 'Program Required', text: 'Please select a program.', confirmButtonColor: '#696cff' });
      return;
    }
    if (showBatch && !formData.batch) {
      Swal.fire({ icon: 'warning', title: 'Batch Required', text: 'Please select a batch.', confirmButtonColor: '#696cff' });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await studentAPI.createStudent({ ...formData, client_id: selectedClient });
      Swal.fire({ icon: 'success', title: 'Student Created', text: 'The student account has been created successfully.', confirmButtonColor: '#696cff' })
        .then(() => navigate('/dashboard/users/students'));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Creation Failed', text: 'Unable to create student account.', confirmButtonColor: '#696cff' });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- LOADING ---------------- */
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

  const showProgram = clientSettings?.is_course_program_flow === true;
  const showBatch = clientSettings?.is_course_batch_flow === true;

  /* ---------------- RENDER ---------------- */
  return (
    <div className="container-xxl container-p-y">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/dashboard" className="text-decoration-none">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="/dashboard/users/students" className="text-decoration-none">Students</a></li>
          <li className="breadcrumb-item active" aria-current="page">Create Student</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Create Student</h4>
          <p className="text-muted mb-0">Add a new student account to the system</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Assignment Section */}
                {(isSuperAdmin || showProgram || showBatch) && (
                  <div className="mb-4">
                    <h6 className="fw-semibold text-primary mb-3">Assignment Details</h6>
                    <div className="row g-3">
                      {isSuperAdmin && (
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Client Organization <span className="text-danger">*</span></label>
                          <select className="form-select" value={selectedClient} onChange={handleClientChange}>
                            <option value="">-- Select a Client --</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      )}
                      {showProgram && (
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Program <span className="text-danger">*</span></label>
                          <select className="form-select" value={formData.program} onChange={handleProgramChange}>
                            <option value="">-- Select Program --</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                      )}
                      {showBatch && (
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Batch <span className="text-danger">*</span></label>
                          <select className="form-select" value={formData.batch} onChange={handleBatchChange}>
                            <option value="">-- Select Batch --</option>
                            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                        </div>
                      )}
                      {courses.length > 0 && (
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Course (Optional)</label>
                          <select name="course" className="form-select" value={formData.course} onChange={handleChange}>
                            <option value="">-- Select Course --</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="mb-4">
                  <h6 className="fw-semibold text-primary mb-3">Personal Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
                      <input name="first_name" className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} placeholder="Enter first name" required value={formData.first_name} onChange={handleChange} />
                      {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Last Name <span className="text-danger">*</span></label>
                      <input name="last_name" className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} placeholder="Enter last name" required value={formData.last_name} onChange={handleChange} />
                      {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <h6 className="fw-semibold text-primary mb-3">Contact Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                      <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="student@example.com" required value={formData.email} onChange={handleChange} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone</label>
                      <input name="phone_number" className="form-control" placeholder="+1 (555) 000-0000" value={formData.phone_number} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="mb-4">
                  <h6 className="fw-semibold text-primary mb-3">Security Credentials</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Password <span className="text-danger">*</span></label>
                      <div className="position-relative">
                        <input type={showPassword ? "text" : "password"} name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Enter password" value={formData.password} onChange={handleChange} />
                        <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y me-2" style={{ background: 'transparent', border: 'none' }} onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                      </div>

                      {passwordStrength.label && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Password Strength:</small>
                            <small className={`text-${passwordStrength.color} fw-semibold`}>{passwordStrength.label}</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className={`progress-bar bg-${passwordStrength.color}`} role="progressbar" style={{ width: `${(passwordStrength.score / 4) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirm Password <span className="text-danger">*</span></label>
                      <div className="position-relative">
                        <input type={showConfirmPassword ? "text" : "password"} name="password_confirm" className={`form-control ${errors.password_confirm ? 'is-invalid' : ''}`} placeholder="Re-enter password" value={formData.password_confirm} onChange={handleChange} />
                        <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y me-2" style={{ background: 'transparent', border: 'none' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                        {errors.password_confirm && <div className="invalid-feedback d-block">{errors.password_confirm}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-top pt-4 mt-4">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <IconUserPlus size={16} className="me-2" />
                          Create Student
                        </>
                      )}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/users/students')} disabled={submitting}>
                      Cancel
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student_Create;
