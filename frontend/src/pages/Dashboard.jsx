import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHistory, FaBell, FaHeart, FaChevronRight, FaBriefcase, FaEdit, FaCheck, FaTimes, FaCalendarAlt, FaClock, FaCoins, FaStar, FaWhatsapp } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab management
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, profile, notifications, saved, partner_profile, partner_bookings
  const [isPartner, setIsPartner] = useState(false);
  const [partnerProfile, setPartnerProfile] = useState(null);

  // States
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedPros, setSavedPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User Profile form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Partner Profile form
  const [partnerTitle, setPartnerTitle] = useState('');
  const [partnerServiceType, setPartnerServiceType] = useState('Plumber');
  const [partnerBio, setPartnerBio] = useState('');
  const [partnerPrice, setPartnerPrice] = useState('');
  const [partnerExp, setPartnerExp] = useState('');
  const [partnerSkills, setPartnerSkills] = useState('');
  const [partnerCity, setPartnerCity] = useState('');
  const [partnerAddress, setPartnerAddress] = useState('');
  const [partnerZip, setPartnerZip] = useState('');
  const [partnerWa, setPartnerWa] = useState('');
  const [partnerAvail, setPartnerAvail] = useState(true);
  const [partnerSuccess, setPartnerSuccess] = useState('');
  const [partnerError, setPartnerError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load bookings
      const bookingsRes = await api.get('/bookings');
      setBookings(bookingsRes.data.data);

      // Load notifications
      const notificationsRes = await api.get('/notifications');
      setNotifications(notificationsRes.data.data);

      // Load saved professionals
      const savedRes = await api.get('/saved-professionals');
      setSavedPros(savedRes.data.data);

      // Check if user has a professional profile
      const partnerRes = await api.get('/professionals/me');
      if (partnerRes.data.success) {
        setIsPartner(true);
        const pData = partnerRes.data.data;
        setPartnerProfile(pData);
        
        // Populate partner form fields
        setPartnerTitle(pData.title || '');
        setPartnerServiceType(pData.serviceType || 'Plumber');
        setPartnerBio(pData.bio || '');
        setPartnerPrice(pData.hourlyRate || '');
        setPartnerExp(pData.experience || '');
        setPartnerSkills(pData.skills?.join(', ') || '');
        setPartnerCity(pData.location?.city || '');
        setPartnerAddress(pData.location?.address || '');
        setPartnerZip(pData.location?.zipcode || '');
        setPartnerWa(pData.whatsappNumber || '');
        setPartnerAvail(pData.isAvailable);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  // Handle User Profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    try {
      const updateData = {
        name: profileName,
        email: profileEmail,
        avatar: profileAvatar
      };
      if (profilePassword) {
        updateData.password = profilePassword;
      }
      const res = await api.put('/auth/profile', updateData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      setProfilePassword('');
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit size to 2MB to keep DB fast
        setProfileError('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result); // Base64 Data URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Partner Profile create or update
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setPartnerSuccess('');
    setPartnerError('');
    
    const bodyData = {
      title: partnerTitle,
      bio: partnerBio,
      serviceType: partnerServiceType,
      experience: parseInt(partnerExp),
      hourlyRate: parseFloat(partnerPrice),
      skills: partnerSkills.split(',').map(s => s.trim()).filter(Boolean),
      location: {
        address: partnerAddress,
        city: partnerCity,
        zipcode: partnerZip,
        coordinates: [80.2, 13.0] // mock
      },
      whatsappNumber: partnerWa,
      isAvailable: partnerAvail
    };

    try {
      if (isPartner) {
        // Update
        const res = await api.put('/professionals/profile', bodyData);
        setPartnerProfile(res.data.data);
        setPartnerSuccess('Professional profile updated successfully!');
      } else {
        // Create first profile
        const res = await api.post('/professionals', bodyData);
        setPartnerProfile(res.data.data);
        setIsPartner(true);
        setPartnerSuccess('Professional profile created! Welcome as a partner.');
      }
    } catch (err) {
      setPartnerError(err.response?.data?.message || 'Failed to save professional profile');
    }
  };

  // Update Booking Status (Cancel, Accept, Complete)
  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      // Reload bookings
      const bookingsRes = await api.get('/bookings');
      setBookings(bookingsRes.data.data);
      
      // Reload notifications
      const notificationsRes = await api.get('/notifications');
      setNotifications(notificationsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking');
    }
  };

  // Notification actions
  const handleReadNotification = async (notifId) => {
    try {
      await api.put(`/notifications/${notifId}/read`);
      setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAllNotifications = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (notifId) => {
    try {
      await api.delete(`/notifications/${notifId}`);
      setNotifications(prev => prev.filter(n => n._id !== notifId));
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate earnings for Partner Dashboard
  const completedBookings = bookings.filter(b => b.status === 'completed' && partnerProfile && b.professional._id === partnerProfile._id);
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <div className="row justify-content-center text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      {/* Welcome banner */}
      <div className="row mb-5 align-items-center g-4 border-bottom pb-4">
        <div className="col-md-8 d-flex align-items-center gap-3">
          <img 
            src={user.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} 
            alt="Avatar" 
            className="rounded-circle object-fit-cover shadow-sm border border-3 border-accent" 
            style={{ width: '64px', height: '64px' }} 
          />
          <div>
            <h2 className="fw-bold mb-0">Dashboard Overview</h2>
            <p className="text-muted mb-0">Manage services, appointments, and support alerts.</p>
          </div>
        </div>
        <div className="col-md-4 text-md-end">
          {isPartner ? (
            <button 
              onClick={() => setActiveTab(activeTab.startsWith('partner') ? 'bookings' : 'partner_bookings')}
              className="btn btn-premium btn-premium-secondary d-inline-flex align-items-center gap-2"
            >
              <FaBriefcase /> {activeTab.startsWith('partner') ? 'Switch to Client View' : 'Switch to Partner View'}
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('partner_profile')}
              className="btn btn-premium btn-premium-outline d-inline-flex align-items-center gap-2"
            >
              <FaBriefcase /> Register as Partner
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Navigation Sidebar */}
        <div className="col-lg-3">
          <Card className="p-0 border shadow-sm overflow-hidden">
            <div className="list-group list-group-flush border-0">
              
              <div className="px-4 py-3 bg-light border-bottom text-uppercase tracking-wider fw-bold text-muted" style={{ fontSize: '0.75rem' }}>
                Client Account
              </div>
              <button 
                onClick={() => setActiveTab('bookings')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex justify-content-between align-items-center ${activeTab === 'bookings' ? 'active bg-primary-custom text-white fw-bold' : 'text-secondary bg-transparent'}`}
              >
                <span className="d-flex align-items-center gap-2.5"><FaHistory /> My Bookings</span>
                <span className="badge rounded-pill bg-light text-dark border">{bookings.filter(b => b.user._id === user._id).length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('saved')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex justify-content-between align-items-center ${activeTab === 'saved' ? 'active bg-primary-custom text-white fw-bold' : 'text-secondary bg-transparent'}`}
              >
                <span className="d-flex align-items-center gap-2.5"><FaHeart /> Saved Partners</span>
                <span className="badge rounded-pill bg-light text-dark border">{savedPros.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex justify-content-between align-items-center ${activeTab === 'notifications' ? 'active bg-primary-custom text-white fw-bold' : 'text-secondary bg-transparent'}`}
              >
                <span className="d-flex align-items-center gap-2.5"><FaBell /> Notification Center</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="badge bg-danger rounded-pill">{notifications.filter(n => !n.read).length}</span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-2.5 ${activeTab === 'profile' ? 'active bg-primary-custom text-white fw-bold' : 'text-secondary bg-transparent'}`}
              >
                <FaUser /> Account Settings
              </button>

              {/* Partner Dashboard Items */}
              {isPartner && (
                <>
                  <div className="px-4 py-3 bg-light border-top border-bottom text-uppercase tracking-wider fw-bold text-muted" style={{ fontSize: '0.75rem' }}>
                    Partner Management
                  </div>
                  <button 
                    onClick={() => setActiveTab('partner_bookings')} 
                    className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex justify-content-between align-items-center ${activeTab === 'partner_bookings' ? 'active bg-primary-custom text-white fw-bold' : 'text-secondary bg-transparent'}`}
                  >
                    <span className="d-flex align-items-center gap-2.5"><FaCalendarAlt /> Client Requests</span>
                    <span className="badge bg-accent text-white rounded-pill">{bookings.filter(b => partnerProfile && b.professional._id === partnerProfile._id).length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('partner_profile')} 
                    className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-2.5 ${activeTab === 'partner_profile' ? 'active bg-primary-custom text-white fw-bold' : 'text-secondary bg-transparent'}`}
                  >
                    <FaEdit /> Partner Profile
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Content Pane */}
        <div className="col-lg-9">
          
          {/* TAB: Client Bookings */}
          {activeTab === 'bookings' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Your Booking History</h4>
              
              {bookings.filter(b => b.user._id === user._id).length === 0 ? (
                <div className="text-center py-5 border rounded-4 bg-light">
                  <h5 className="text-muted fw-bold mb-2">No service bookings found</h5>
                  <p className="text-muted small mb-4">Book top rated local plumbers, AC repairers, and cleaners today.</p>
                  <Link to="/search">
                    <Button variant="primary">Book a Service</Button>
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Booking ID</th>
                        <th>Service Category</th>
                        <th>Professional</th>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.user._id === user._id).map((b) => (
                        <tr key={b._id}>
                          <td><span className="fw-bold text-dark font-monospace">#{String(b._id).slice(-6).toUpperCase()}</span></td>
                          <td>
                            <span className="badge bg-light text-primary border rounded px-2.5 py-1 fw-bold text-uppercase">
                              {b.serviceType}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img src={b.professional?.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} alt="Pro" className="rounded-circle border" style={{ width: '28px', height: '28px', objectFit: 'cover' }} />
                              <span className="fw-semibold text-dark">{b.professional?.user?.name}</span>
                            </div>
                          </td>
                          <td>
                            <small className="d-block fw-semibold text-dark"><FaCalendarAlt className="me-1 text-muted" /> {new Date(b.date).toLocaleDateString()}</small>
                            <small className="text-muted"><FaClock className="me-1" /> {b.time}</small>
                          </td>
                          <td><span className="fw-bold text-dark">₹{b.totalAmount || b.professional?.hourlyRate}</span></td>
                          <td>
                            <span className={`badge rounded-pill px-3 py-1 text-capitalize ${
                              b.status === 'confirmed' ? 'bg-success' :
                              b.status === 'completed' ? 'bg-info' :
                              b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            {(b.status === 'pending' || b.status === 'confirmed') && (
                              <button 
                                onClick={() => handleBookingAction(b._id, 'cancelled')}
                                className="btn btn-xs btn-outline-danger py-1 px-2.5 rounded-pill fw-semibold"
                                style={{ fontSize: '0.75rem' }}
                              >
                                Cancel
                              </button>
                            )}
                            {b.status === 'completed' && (
                              <Link 
                                to={`/professional/${b.professional._id}`}
                                className="btn btn-xs btn-outline-primary py-1 px-2.5 rounded-pill fw-semibold"
                                style={{ fontSize: '0.75rem' }}
                              >
                                Review
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* TAB: Saved Professionals */}
          {activeTab === 'saved' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Saved Professionals</h4>
              
              {savedPros.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0 italic">You haven't bookmarked any professionals yet.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {console.log('savedPros list:', savedPros)}
                  {savedPros.map((pro) => {
                    console.log('Rendering saved professional item:', pro);
                    return (
                      <div className="col-md-6" key={pro.id || pro._id}>
                        <Card className="border shadow-sm text-center d-flex flex-column align-items-center p-3 h-100">
                          <img src={pro.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} alt="Pro" className="rounded-circle object-fit-cover mb-2 border border-2 border-accent" style={{ width: '70px', height: '70px' }} />
                          <h6 className="fw-bold text-dark mb-0">{pro.user?.name}</h6>
                          <span className="badge bg-light text-primary border rounded-pill px-2.5 py-0.5 mt-1 small">{pro.serviceType}</span>
                          <p className="text-muted small text-truncate-3 mt-2 px-2 lh-relaxed">{pro.title}</p>
                          <div className="border-top pt-2 w-100 mt-auto d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-dark">₹{pro.hourlyRate}/hr</span>
                            
                            <Link to={`/professional/${pro.id || pro._id}`} className="btn btn-xs btn-primary-custom px-3 py-1 rounded-pill">
                              Book
                            </Link>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}

          {/* TAB: Notifications */}
          {activeTab === 'notifications' && (
            <Card className="border shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 className="fw-bold mb-0">Notifications</h4>
                {notifications.some(n => !n.read) && (
                  <button onClick={handleReadAllNotifications} className="btn btn-sm text-primary fw-bold p-0 border-0 bg-transparent">
                    Mark All as Read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">No notifications yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`p-3 rounded-3 border d-flex justify-content-between align-items-start ${notif.read ? 'bg-white' : 'bg-light border-primary'}`}
                      onClick={() => !notif.read && handleReadNotification(notif._id)}
                      style={{ cursor: notif.read ? 'default' : 'pointer' }}
                    >
                      <div>
                        <h6 className={`fw-bold mb-1 text-dark ${notif.read ? '' : 'text-primary'}`}>
                          {notif.title} {!notif.read && <span className="badge bg-primary ms-1 small" style={{ fontSize: '0.6rem' }}>NEW</span>}
                        </h6>
                        <p className="text-muted small mb-1">{notif.message}</p>
                        <small className="text-muted-50" style={{ fontSize: '0.75rem' }}>{new Date(notif.createdAt).toLocaleString()}</small>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notif._id);
                        }} 
                        className="btn btn-xs text-muted border-0 bg-transparent"
                        aria-label="Delete Notification"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* TAB: Account Settings */}
          {activeTab === 'profile' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Account Profile Details</h4>
              
              {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
              {profileError && <div className="alert alert-danger">{profileError}</div>}
              
              <form onSubmit={handleProfileUpdate}>
                <div className="row g-3">
                  <div className="col-md-12 text-center mb-4">
                    <div className="d-inline-block position-relative">
                      <img 
                        src={profileAvatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} 
                        alt="Profile Preview" 
                        className="rounded-circle object-fit-cover shadow-sm border border-3 border-accent" 
                        style={{ width: '120px', height: '120px' }} 
                      />
                      <div className="mt-2">
                        <label className="btn btn-sm btn-outline-secondary px-3 rounded-pill" style={{ cursor: 'pointer' }}>
                          Upload Photo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email address</label>
                    <input 
                      type="email" 
                      className="form-control form-control-premium" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">New Password (leave blank to keep current)</label>
                    <input 
                      type="password" 
                      className="form-control form-control-premium" 
                      placeholder="Minimum 6 characters" 
                      value={profilePassword} 
                      onChange={(e) => setProfilePassword(e.target.value)} 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Avatar Image URL (or upload above)</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      value={profileAvatar} 
                      onChange={(e) => setProfileAvatar(e.target.value)} 
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4 px-4 py-2.5">Save Changes</Button>
              </form>
            </Card>
          )}

          {/* TAB: Partner Client Requests */}
          {activeTab === 'partner_bookings' && (
            <div className="d-flex flex-column gap-4 animate-fade-in">
              {/* Earnings Overview Cards */}
              <div className="row g-4">
                <div className="col-md-6">
                  <Card className="bg-primary-custom text-white border-0 d-flex align-items-center justify-content-between p-4 shadow-sm">
                    <div>
                      <span className="text-white-50 tracking-wider text-uppercase small font-bold">Aggregate Earnings</span>
                      <h2 className="display-6 fw-extrabold text-white mb-0 mt-1">₹{totalEarnings}</h2>
                    </div>
                    <FaCoins className="text-accent" size={45} />
                  </Card>
                </div>
                <div className="col-md-6">
                  <Card className="bg-white border d-flex align-items-center justify-content-between p-4 shadow-sm">
                    <div>
                      <span className="text-muted tracking-wider text-uppercase small font-semibold">Completed Orders</span>
                      <h2 className="display-6 fw-bold text-dark mb-0 mt-1">{completedBookings.length}</h2>
                    </div>
                    <FaCalendarAlt className="text-muted" size={45} />
                  </Card>
                </div>
              </div>

              {/* Client Requests List */}
              <Card className="border shadow-sm">
                <h4 className="fw-bold mb-4 border-bottom pb-2">Client Appointment Requests</h4>
                
                {bookings.filter(b => partnerProfile && b.professional._id === partnerProfile._id).length === 0 ? (
                  <p className="text-muted italic py-4 text-center">You have received no client appointment requests yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Client</th>
                          <th>Date & Time</th>
                          <th>Description Notes</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.filter(b => partnerProfile && b.professional._id === partnerProfile._id).map((b) => (
                          <tr key={b._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img src={b.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} alt="Client" className="rounded-circle border" style={{ width: '28px', height: '28px', objectFit: 'cover' }} />
                                <span className="fw-semibold text-dark">{b.user?.name}</span>
                              </div>
                            </td>
                            <td>
                              <small className="d-block fw-semibold text-dark"><FaCalendarAlt className="me-1 text-muted" /> {new Date(b.date).toLocaleDateString()}</small>
                              <small className="text-muted"><FaClock className="me-1" /> {b.time}</small>
                            </td>
                            <td>
                              <span className="text-muted small text-truncate d-block" style={{ maxWidth: '200px' }} title={b.notes}>
                                {b.notes || 'No notes specified.'}
                              </span>
                            </td>
                            <td><span className="fw-bold text-dark">₹{b.totalAmount || partnerProfile.hourlyRate}</span></td>
                            <td>
                              <span className={`badge rounded-pill px-3 py-1 text-capitalize ${
                                b.status === 'confirmed' ? 'bg-success' :
                                b.status === 'completed' ? 'bg-info' :
                                b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td>
                              {b.status === 'pending' && (
                                <div className="d-flex gap-2">
                                  <button onClick={() => handleBookingAction(b._id, 'confirmed')} className="btn btn-xs btn-success rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 font-bold" style={{ fontSize: '0.7rem' }}>
                                    <FaCheck size={8} /> Accept
                                  </button>
                                  <button onClick={() => handleBookingAction(b._id, 'cancelled')} className="btn btn-xs btn-outline-danger rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 font-bold" style={{ fontSize: '0.7rem' }}>
                                    <FaTimes size={8} /> Decline
                                  </button>
                                </div>
                              )}
                              {b.status === 'confirmed' && (
                                <button onClick={() => handleBookingAction(b._id, 'completed')} className="btn btn-xs btn-info text-white rounded-pill px-3 py-1 font-bold" style={{ fontSize: '0.7rem' }}>
                                  Complete Job
                                </button>
                              )}
                              {b.status === 'completed' && <span className="text-muted small">Job Completed</span>}
                              {b.status === 'cancelled' && <span className="text-danger small">Cancelled</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB: Partner Profile Configuration */}
          {activeTab === 'partner_profile' && (
            <Card className="border shadow-sm">
              <h4 className="fw-bold mb-4 border-bottom pb-2">Configure Partner Profile</h4>
              
              {partnerSuccess && <div className="alert alert-success">{partnerSuccess}</div>}
              {partnerError && <div className="alert alert-danger">{partnerError}</div>}
              
              <form onSubmit={handlePartnerSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Professional Title</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. Expert Pipe Leakage Fixer" 
                      value={partnerTitle} 
                      onChange={(e) => setPartnerTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Service Category</label>
                    <select 
                      className="form-select form-control-premium" 
                      value={partnerServiceType} 
                      onChange={(e) => setPartnerServiceType(e.target.value)} 
                      required
                    >
                      <option value="Plumber">Plumber</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="AC Technician">AC Technician</option>
                      <option value="Painter">Painter</option>
                      <option value="House Cleaner">House Cleaner</option>
                      <option value="RO Technician">RO Technician</option>
                      <option value="Laptop/Mobile Repair">Laptop/Mobile Repair</option>
                      <option value="Home Tutor">Home Tutor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Service Hourly Rate (₹)</label>
                    <input 
                      type="number" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. 350" 
                      value={partnerPrice} 
                      onChange={(e) => setPartnerPrice(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Years of Experience</label>
                    <input 
                      type="number" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. 6" 
                      value={partnerExp} 
                      onChange={(e) => setPartnerExp(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">WhatsApp Number (with country code)</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. 919876543210" 
                      value={partnerWa} 
                      onChange={(e) => setPartnerWa(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Skills (Comma-separated list)</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. Pipe Fitting, Leak Detection, Gas Charging" 
                      value={partnerSkills} 
                      onChange={(e) => setPartnerSkills(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. Chennai" 
                      value={partnerCity} 
                      onChange={(e) => setPartnerCity(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">Street Address</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. 12 Main Road, Adyar" 
                      value={partnerAddress} 
                      onChange={(e) => setPartnerAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Zipcode</label>
                    <input 
                      type="text" 
                      className="form-control form-control-premium" 
                      placeholder="e.g. 600020" 
                      value={partnerZip} 
                      onChange={(e) => setPartnerZip(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Detailed Bio/Description</label>
                    <textarea 
                      className="form-control form-control-premium" 
                      rows="4" 
                      placeholder="Detail your professional experience, specialty services, and customer guarantee..."
                      value={partnerBio} 
                      onChange={(e) => setPartnerBio(e.target.value)} 
                      required
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch mt-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="availSwitch" 
                        checked={partnerAvail} 
                        onChange={(e) => setPartnerAvail(e.target.checked)} 
                      />
                      <label className="form-check-label small fw-semibold text-secondary" htmlFor="availSwitch">
                        Toggle profile availability status (Customers can see and book you)
                      </label>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="mt-4 px-5 py-3">
                  {isPartner ? 'Save Profile Changes' : 'Register Profile'}
                </Button>
              </form>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
