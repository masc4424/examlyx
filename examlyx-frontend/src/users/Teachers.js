import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { teacherAPI } from '../services/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getTeachers();
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading teachers:', err);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusCancel: true,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await teacherAPI.deleteTeacher(id);
        Swal.fire('Deleted!', 'Teacher has been deleted.', 'success');
        loadTeachers();
      } catch (err) {
        console.error('Error deleting teacher:', err);
        Swal.fire('Error', 'Failed to delete teacher', 'error');
      }
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Teachers Management</h5>
          <Link to="/dashboard/users/teachers/create" className="btn btn-primary">
            <i className="icon-base ti tabler-plus me-2"></i>
            Add Teacher
          </Link>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
              <button onClick={loadTeachers} className="btn btn-sm btn-danger ms-3">
                Retry
              </button>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No teachers found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={teacher.id}>
                      <td>{index + 1}</td>
                      <td>{teacher.username}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.first_name || '-'}</td>
                      <td>{teacher.last_name || '-'}</td>
                      <td>
                        <span
                          className={`badge ${
                            teacher.is_active ? 'bg-label-success' : 'bg-label-danger'
                          }`}
                        >
                          {teacher.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/dashboard/teachers/${teacher.id}`}
                            className="btn btn-sm btn-icon btn-outline-primary"
                          >
                            <i className="icon-base ti tabler-eye"></i>
                          </Link>
                          <Link
                            to={`/dashboard/teachers/${teacher.id}/edit`}
                            className="btn btn-sm btn-icon btn-outline-secondary"
                          >
                            <i className="icon-base ti tabler-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="btn btn-sm btn-icon btn-outline-danger"
                          >
                            <i className="icon-base ti tabler-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer">
          <p className="mb-0">
            Showing <strong>{teachers.length}</strong> teachers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
