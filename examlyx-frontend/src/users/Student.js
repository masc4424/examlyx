import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { studentAPI } from '../services/api';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudents();
      setStudents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students. Please try again.');
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
        await studentAPI.deleteStudent(id);
        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
        loadStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        Swal.fire('Error', 'Failed to delete student', 'error');
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Students Management</h5>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              style={{ width: 300 }}
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link to="/dashboard/users/students/create" className="btn btn-primary">
              <i className="icon-base ti tabler-plus me-2"></i>
              Add Student
            </Link>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
              <button onClick={loadStudents} className="btn btn-sm btn-danger ms-3">
                Retry
              </button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">
                {searchTerm ? 'No students match your search.' : 'No students found.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.first_name || '-'}</td>
                      <td>{student.last_name || '-'}</td>
                      <td>{student.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            student.is_active ? 'bg-label-success' : 'bg-label-danger'
                          }`}
                        >
                          {student.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/dashboard/students/${student.id}`}
                            className="btn btn-sm btn-icon btn-outline-primary"
                          >
                            <i className="icon-base ti tabler-eye"></i>
                          </Link>
                          <Link
                            to={`/dashboard/students/${student.id}/edit`}
                            className="btn btn-sm btn-icon btn-outline-secondary"
                          >
                            <i className="icon-base ti tabler-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(student.id)}
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
            Showing <strong>{filteredStudents.length}</strong> of {students.length} students
          </p>
        </div>
      </div>
    </div>
  );
};

export default Student;
