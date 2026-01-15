import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clientAPI } from '../services/api';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getClients();
      setClients(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, clientName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${clientName}? This action cannot be undone!`,
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
        await clientAPI.deleteClient(id);
        Swal.fire('Deleted!', 'Client has been deleted successfully.', 'success');
        loadClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        Swal.fire('Error', 'Failed to delete client', 'error');
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Clients Management</h5>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              style={{ width: 300 }}
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link to="/dashboard/users/client/create" className="btn btn-primary">
              <i className="icon-base ti tabler-plus me-2"></i>
              Add Client
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
              <button onClick={loadClients} className="btn btn-sm btn-danger ms-3">
                Retry
              </button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">
                {searchTerm ? 'No clients match your search.' : 'No clients found.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Students</th>
                    <th>Teachers</th>
                    <th>Subscription Start</th>
                    <th>Subscription End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr key={client.id}>
                      <td>{index + 1}</td>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone_number || '-'}</td>
                      <td>{client.student_count || 0}</td>
                      <td>{client.teacher_count || 0}</td>
                      <td>{client.subscription_start_date || '-'}</td>
                      <td>{client.subscription_end_date || '-'}</td>
                      <td>
                        <span
                          className={`badge ${
                            client.is_active ? 'bg-label-success' : 'bg-label-danger'
                          }`}
                        >
                          {client.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/dashboard/clients/${client.id}`}
                            className="btn btn-sm btn-icon btn-outline-primary"
                          >
                            <i className="icon-base ti tabler-eye"></i>
                          </Link>
                          <Link
                            to={`/dashboard/clients/${client.id}/edit`}
                            className="btn btn-sm btn-icon btn-outline-secondary"
                          >
                            <i className="icon-base ti tabler-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(client.id, client.name)}
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
            Showing <strong>{filteredClients.length}</strong> of {clients.length} clients
          </p>
        </div>
      </div>
    </div>
  );
};

export default Client;