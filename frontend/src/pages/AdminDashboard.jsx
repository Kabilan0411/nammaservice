import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaBriefcase, FaCalendarCheck, FaMoneyBillWave, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active view tab inside Admin dashboard
  const [viewTab, setViewTab] = useState('overview'); // overview, users, partners, bookings

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all bookings
      const bookingsRes = await api.get('/bookings');
      setBookings(bookingsRes.data.data);

      // Load all professionals
      const prosRes = await api.get('/professionals');
      setProfessionals(prosRes.data.data);

      // Load all users directly from the backend admin route
      const usersRes = await api.get('/auth/users');
      setUsers(usersRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve administrative records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [user]);

  const handleDeleteUser = async (userId) => {
    const currentAdminId = user.id || user._id;
    if (userId === currentAdminId) {
      alert("You cannot delete your own admin account.");
      return;
    }
    if (window.confirm("Are you sure you want to remove this user from the system?")) {
      try {
        await api.delete(`/auth/users/${userId}`);
        setUsers(prev => prev.filter(u => u._id !== userId && u.id !== userId));
        alert("User removed successfully.");
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleDeleteProfessional = async (proId) => {
    if (window.confirm("Are you sure you want to deregister this professional partner profile?")) {
      try {
        await api.delete(`/professionals/${proId}`);
        setProfessionals(prev => prev.filter(p => p._id !== proId && p.id !== proId));
        alert("Professional profile deleted successfully.");
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete professional profile');
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Cancel this booking as Administrator?")) {
      try {
        await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
        // Reload
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  // Calculations
  const platformEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + ((b.totalAmount || 0) * 0.15), 0); // 15% platform commission fee

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Administrative Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      <div className="row mb-5 align-items-center border-bottom pb-4">
        <div className="col-md-8">
          <h2 className="fw-bold mb-0">Platform Administration Control Panel</h2>
          <p className="text-muted">Manage global user accounts, booking transactions, and platform commission metrics.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button onClick={fetchAdminData} className="btn btn-premium btn-premium-outline">
            Refresh Records
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* Analytics Summary */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <Card className="border-0 shadow-sm bg-primary-custom text-white d-flex align-items-center justify-content-between p-4">
            <div>
              <span className="text-white-50 small text-uppercase tracking-wider font-bold">Total Clients</span>
              <h2 className="fw-extrabold text-white mb-0 mt-1">{users.length}</h2>
            </div>
            <FaUsers className="text-accent" size={35} />
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="border-0 shadow-sm bg-white border d-flex align-items-center justify-content-between p-4">
            <div>
              <span className="text-muted small text-uppercase tracking-wider font-bold">Registered Partners</span>
              <h2 className="fw-bold text-dark mb-0 mt-1">{professionals.length}</h2>
            </div>
            <FaBriefcase className="text-primary" size={35} />
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="border-0 shadow-sm bg-white border d-flex align-items-center justify-content-between p-4">
            <div>
              <span className="text-muted small text-uppercase tracking-wider font-bold">Total Transactions</span>
              <h2 className="fw-bold text-dark mb-0 mt-1">{bookings.length}</h2>
            </div>
            <FaCalendarCheck className="text-info" size={35} />
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="border-0 shadow-sm bg-white border d-flex align-items-center justify-content-between p-4">
            <div>
              <span className="text-muted small text-uppercase tracking-wider font-bold">Platform Commission (15%)</span>
              <h2 className="fw-bold text-success mb-0 mt-1">₹{platformEarnings.toFixed(2)}</h2>
            </div>
            <FaMoneyBillWave className="text-success" size={35} />
          </Card>
        </div>
      </div>

      <div className="row g-4">
        {/* Navigation Sidebar */}
        <div className="col-lg-3">
          <Card className="p-0 border shadow-sm overflow-hidden">
            <div className="list-group list-group-flush border-0">
              <button 
                onClick={() => setViewTab('overview')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 fw-bold ${viewTab === 'overview' ? 'active bg-primary-custom text-white' : 'text-secondary bg-transparent'}`}
              >
                Overview Logs
              </button>
              <button 
                onClick={() => setViewTab('users')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 fw-bold ${viewTab === 'users' ? 'active bg-primary-custom text-white' : 'text-secondary bg-transparent'}`}
              >
                Manage Clients ({users.length})
              </button>
              <button 
                onClick={() => setViewTab('partners')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 fw-bold ${viewTab === 'partners' ? 'active bg-primary-custom text-white' : 'text-secondary bg-transparent'}`}
              >
                Manage Partners ({professionals.length})
              </button>
              <button 
                onClick={() => setViewTab('bookings')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 fw-bold ${viewTab === 'bookings' ? 'active bg-primary-custom text-white' : 'text-secondary bg-transparent'}`}
              >
                Manage Bookings ({bookings.length})
              </button>
            </div>
          </Card>
        </div>

        {/* Dynamic content tables */}
        <div className="col-lg-9">
          
          {/* TAB: Overview Summary */}
          {viewTab === 'overview' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Platform Activity Overview</h4>
              
              <div className="p-4 bg-light rounded-4 border mb-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-success" /> Admin Operations Status
                </h5>
                <p className="text-muted small mb-0 lh-lg">
                  The admin portal connects to the MERN backend environment. All booking updates immediately notify corresponding clients and professionals. To audit, toggle between the tab configurations on the sidebar.
                </p>
              </div>

              <div className="row g-4 text-center mt-2">
                <div className="col-6 col-md-3">
                  <h6 className="text-muted small text-uppercase fw-bold">Active bookings</h6>
                  <span className="fs-3 fw-bold text-dark">{bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}</span>
                </div>
                <div className="col-6 col-md-3">
                  <h6 className="text-muted small text-uppercase fw-bold">Completed bookings</h6>
                  <span className="fs-3 fw-bold text-success">{bookings.filter(b => b.status === 'completed').length}</span>
                </div>
                <div className="col-6 col-md-3">
                  <h6 className="text-muted small text-uppercase fw-bold">Cancelled bookings</h6>
                  <span className="fs-3 fw-bold text-danger">{bookings.filter(b => b.status === 'cancelled').length}</span>
                </div>
                <div className="col-6 col-md-3">
                  <h6 className="text-muted small text-uppercase fw-bold">Unpaid invoices</h6>
                  <span className="fs-3 fw-bold text-warning">{bookings.filter(b => b.paymentStatus === 'pending').length}</span>
                </div>
              </div>
            </Card>
          )}

          {/* TAB: Manage Users */}
          {viewTab === 'users' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Registered Accounts Database</h4>
              
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Avatar</th>
                      <th>Name</th>
                      <th>Email ID</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <img src={u.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} alt="Av" className="rounded-circle border" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                        </td>
                        <td><span className="fw-semibold text-dark">{u.name}</span></td>
                        <td><span className="text-secondary small">{u.email}</span></td>
                        <td>
                          <span className={`badge rounded-pill px-3 py-1 ${u.role === 'admin' ? 'bg-danger' : 'bg-light text-dark border'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => handleDeleteUser(u._id)} className="btn btn-xs btn-outline-danger p-1 rounded-circle" title="Remove User Account">
                            <FaTrash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB: Manage Partners */}
          {viewTab === 'partners' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Registered Professional Partners</h4>
              
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Partner</th>
                      <th>Category</th>
                      <th>Title</th>
                      <th>Experience</th>
                      <th>Hourly Rate</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professionals.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={p.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} alt="Av" className="rounded-circle border" style={{ width: '28px', height: '28px', objectFit: 'cover' }} />
                            <span className="fw-semibold text-dark small">{p.user?.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-primary border rounded small px-2 py-0.5 fw-bold text-uppercase">
                            {p.serviceType}
                          </span>
                        </td>
                        <td><span className="text-secondary small text-truncate d-block" style={{ maxWidth: '150px' }} title={p.title}>{p.title}</span></td>
                        <td><span className="text-dark fw-medium">{p.experience} yrs</span></td>
                        <td><span className="fw-bold text-dark">₹{p.hourlyRate}/hr</span></td>
                        <td>
                          <div className="d-flex align-items-center text-warning gap-1 small">
                            <FaStar />
                            <span className="text-dark fw-bold">{p.averageRating?.toFixed(1) || '5.0'}</span>
                          </div>
                        </td>
                        <td>
                          <button onClick={() => handleDeleteProfessional(p._id)} className="btn btn-xs btn-outline-danger p-1 rounded-circle" title="Remove Partner Profile">
                            <FaTrash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB: Manage Bookings */}
          {viewTab === 'bookings' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Platform Booking Transactions</h4>
              
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Client Name</th>
                      <th>Partner</th>
                      <th>Service type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Invoice</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td><span className="font-monospace fw-bold text-dark small">#{String(b._id).slice(-6).toUpperCase()}</span></td>
                        <td><span className="fw-semibold text-dark small">{b.user?.name}</span></td>
                        <td><span className="fw-semibold text-dark small">{b.professional?.user?.name || 'Partner'}</span></td>
                        <td>
                          <span className="badge bg-light text-primary border rounded px-2.5 py-1 text-uppercase small font-bold">
                            {b.serviceType}
                          </span>
                        </td>
                        <td><span className="text-muted small">{new Date(b.date).toLocaleDateString()}</span></td>
                        <td>
                          <span className={`badge rounded-pill px-3 py-1 text-capitalize ${
                            b.status === 'confirmed' ? 'bg-success' :
                            b.status === 'completed' ? 'bg-info' :
                            b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td><span className="fw-bold text-dark">₹{b.totalAmount || b.professional?.hourlyRate}</span></td>
                        <td>
                          {(b.status === 'pending' || b.status === 'confirmed') && (
                            <button 
                              onClick={() => handleCancelBooking(b._id)} 
                              className="btn btn-xs btn-outline-danger py-1 px-2.5 rounded-pill font-semibold"
                              style={{ fontSize: '0.7rem' }}
                            >
                              Cancel
                            </button>
                          )}
                          {b.status === 'completed' && <span className="text-success small fw-semibold">Settled</span>}
                          {b.status === 'cancelled' && <span className="text-danger small">Voided</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
