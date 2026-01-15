import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { adminAPI } from '../services/api';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAdmins();
      setAdmins(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading admins:', err);
      setError('Failed to load admins. Please try again.');
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
        await adminAPI.deleteAdmin(id);
        Swal.fire('Deleted!', 'Admin has been deleted.', 'success');
        loadAdmins();
      } catch (err) {
        console.error('Error deleting admin:', err);
        Swal.fire('Error', 'Failed to delete admin', 'error');
      }
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Admins Management</h5>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              style={{ width: 300 }}
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link to="/dashboard/users/admin/create" className="btn btn-primary">
              <i className="icon-base ti tabler-plus me-2"></i>
              Add Admin
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
              <button onClick={loadAdmins} className="btn btn-sm btn-danger ms-3">
                Retry
              </button>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">
                {searchTerm ? 'No admins match your search.' : 'No admins found.'}
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
                  {filteredAdmins.map((admin, index) => (
                    <tr key={admin.id}>
                      <td>{index + 1}</td>
                      <td>{admin.first_name || '-'}</td>
                      <td>{admin.last_name || '-'}</td>
                      <td>{admin.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            admin.is_active ? 'bg-label-success' : 'bg-label-danger'
                          }`}
                        >
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/dashboard/admins/${admin.id}`}
                            className="btn btn-sm btn-icon btn-outline-primary"
                          >
                            <i className="icon-base ti tabler-eye"></i>
                          </Link>
                          <Link
                            to={`/dashboard/admins/${admin.id}/edit`}
                            className="btn btn-sm btn-icon btn-outline-secondary"
                          >
                            <i className="icon-base ti tabler-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(admin.id)}
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
            Showing <strong>{filteredAdmins.length}</strong> of {admins.length} admins
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
