import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clientAPI } from '../services/api';
import { ensureCSRFToken } from '../services/csrf';

const Client_Create = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone_number: '',
    subscription_start_date: '',
    subscription_end_date: '',
    
    // Client Settings
    is_user_course: false,
    is_course_program_flow: false,
    is_course_batch_flow: false,
    is_s3_enabled: false,
    s3_bucket_link: '',
    s3_bucket_name: '',
    is_subscription_base_client: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    ensureCSRFToken();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /* ---------------- FORM VALIDATION ---------------- */
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Client name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate dates if both are provided
    if (formData.subscription_start_date && formData.subscription_end_date) {
      const startDate = new Date(formData.subscription_start_date);
      const endDate = new Date(formData.subscription_end_date);
      
      if (endDate < startDate) {
        newErrors.subscription_end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    // Validate S3 settings if S3 is enabled
    if (formData.is_s3_enabled) {
      if (!formData.s3_bucket_link.trim()) {
        newErrors.s3_bucket_link = 'S3 bucket link is required when S3 is enabled';
      }
      if (!formData.s3_bucket_name.trim()) {
        newErrors.s3_bucket_name = 'S3 bucket name is required when S3 is enabled';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- NAVIGATION ---------------- */
  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setSubmitting(true);

    try {
      const clientData = {
        // Basic Information
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || null,
        subscription_start_date: formData.subscription_start_date || null,
        subscription_end_date: formData.subscription_end_date || null,
        
        // Client Settings
        is_user_course: formData.is_user_course,
        is_course_program_flow: formData.is_course_program_flow,
        is_course_batch_flow: formData.is_course_batch_flow,
        is_s3_enabled: formData.is_s3_enabled,
        s3_bucket_link: formData.s3_bucket_link || '',
        s3_bucket_name: formData.s3_bucket_name || '',
        is_subscription_base_client: formData.is_subscription_base_client,
      };

      const response = await clientAPI.createClient(clientData);

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Client created successfully with settings',
          icon: 'success',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          allowEscapeKey: false,
          backdrop: true
        })
        .then(() => navigate('/dashboard/clients'));
      }
    } catch (err) {
      console.error('Error creating client:', err);

      if (err.response?.data) {
        const backendErrors = err.response.data;
        const newErrors = {};

        Object.keys(backendErrors).forEach(key => {
          newErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key].join(', ')
            : backendErrors[key];
        });

        setErrors(newErrors);

        if (!Object.keys(newErrors).length && backendErrors.error) {
          Swal.fire({
            title: 'Error',
            text: backendErrors.error,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to create client. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            Create Client - Step {currentStep} of 2
          </h5>
          <div className="progress mt-3" style={{ height: '5px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
              aria-valuenow={currentStep} 
              aria-valuemin="0" 
              aria-valuemax="2"
            ></div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div className="row">
                <div className="col-12 mb-3">
                  <h6 className="text-primary">Basic Information</h6>
                  <hr />
                </div>

                {/* Client Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Client Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    className={`form-control ${errors.name && 'is-invalid'}`}
                    onChange={handleChange}
                    placeholder="Enter client name"
                  />
                  <div className="invalid-feedback">{errors.name}</div>
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
                    placeholder="Enter email address"
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>

                {/* Phone Number */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    className={`form-control ${errors.phone_number && 'is-invalid'}`}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  <div className="invalid-feedback">{errors.phone_number}</div>
                </div>

                {/* Subscription Start Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Subscription Start Date</label>
                  <input
                    type="date"
                    name="subscription_start_date"
                    value={formData.subscription_start_date}
                    className={`form-control ${errors.subscription_start_date && 'is-invalid'}`}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.subscription_start_date}</div>
                </div>

                {/* Subscription End Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Subscription End Date</label>
                  <input
                    type="date"
                    name="subscription_end_date"
                    value={formData.subscription_end_date}
                    className={`form-control ${errors.subscription_end_date && 'is-invalid'}`}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.subscription_end_date}</div>
                </div>
              </div>
            )}

            {/* STEP 2: Client Settings */}
            {currentStep === 2 && (
              <div className="row">
                <div className="col-12 mb-3">
                  <h6 className="text-primary">Client Settings</h6>
                  <hr />
                </div>

                {/* Course Settings */}
                <div className="col-md-6 mb-3">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      name="is_user_course"
                      checked={formData.is_user_course}
                      onChange={handleChange}
                      className="form-check-input"
                      id="is_user_course"
                    />
                    <label className="form-check-label" htmlFor="is_user_course">
                      Enable User Course
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      name="is_course_program_flow"
                      checked={formData.is_course_program_flow}
                      onChange={handleChange}
                      className="form-check-input"
                      id="is_course_program_flow"
                    />
                    <label className="form-check-label" htmlFor="is_course_program_flow">
                      Enable Course Program Flow
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      name="is_course_batch_flow"
                      checked={formData.is_course_batch_flow}
                      onChange={handleChange}
                      className="form-check-input"
                      id="is_course_batch_flow"
                    />
                    <label className="form-check-label" htmlFor="is_course_batch_flow">
                      Enable Course Batch Flow
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      name="is_subscription_base_client"
                      checked={formData.is_subscription_base_client}
                      onChange={handleChange}
                      className="form-check-input"
                      id="is_subscription_base_client"
                    />
                    <label className="form-check-label" htmlFor="is_subscription_base_client">
                      Subscription Base Client
                    </label>
                  </div>
                </div>

                {/* S3 Settings */}
                <div className="col-md-6 mb-3">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      name="is_s3_enabled"
                      checked={formData.is_s3_enabled}
                      onChange={handleChange}
                      className="form-check-input"
                      id="is_s3_enabled"
                    />
                    <label className="form-check-label" htmlFor="is_s3_enabled">
                      Enable S3 Storage
                    </label>
                  </div>

                  {formData.is_s3_enabled && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">S3 Bucket Link *</label>
                        <input
                          name="s3_bucket_link"
                          value={formData.s3_bucket_link}
                          className={`form-control ${errors.s3_bucket_link && 'is-invalid'}`}
                          onChange={handleChange}
                          placeholder="https://s3.amazonaws.com/bucket-name"
                        />
                        <div className="invalid-feedback">{errors.s3_bucket_link}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">S3 Bucket Name *</label>
                        <input
                          name="s3_bucket_name"
                          value={formData.s3_bucket_name}
                          className={`form-control ${errors.s3_bucket_name && 'is-invalid'}`}
                          onChange={handleChange}
                          placeholder="my-bucket-name"
                        />
                        <div className="invalid-feedback">{errors.s3_bucket_name}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4">
              {currentStep === 1 && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next <i className="icon-base ti tabler-arrow-right ms-1"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => navigate('/dashboard/clients')}
                  >
                    Cancel
                  </button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleBack}
                  >
                    <i className="icon-base ti tabler-arrow-left me-1"></i> Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary ms-2"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Client'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => navigate('/dashboard/user/clients')}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Client_Create;