import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp, FaEnvelope, FaBriefcase, FaCalendarAlt, FaClock, FaPen } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking fields
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Review fields
  const [reviews, setReviews] = useState([]);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/professionals/${id}`);
      setPro(res.data.data);
      
      // Load reviews
      const reviewsRes = await api.get(`/reviews/${id}`);
      setReviews(reviewsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load professional profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfile();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bookingDate || !bookingTime) {
      setBookingError('Please select a date and time slot.');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError('');
      
      const bookingData = {
        professionalId: pro._id,
        serviceType: pro.serviceType,
        date: bookingDate,
        time: bookingTime,
        notes: bookingNotes,
        totalAmount: pro.hourlyRate // Base billing is 1 hour
      };

      await api.post('/bookings', bookingData);
      
      // Redirect to confirmation with details
      navigate(`/booking-confirmation?proName=${encodeURIComponent(pro.user.name)}&service=${encodeURIComponent(pro.serviceType)}&date=${bookingDate}&time=${bookingTime}`);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to request booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reviewTitle.trim() || !reviewText.trim()) {
      setReviewError('Please complete all review fields.');
      return;
    }

    try {
      setReviewError('');
      setReviewSuccess('');
      
      await api.post('/reviews', {
        professionalId: pro._id,
        title: reviewTitle,
        text: reviewText,
        rating: reviewRating
      });

      setReviewTitle('');
      setReviewText('');
      setReviewRating(5);
      setReviewSuccess('Thank you! Your review has been added.');
      
      // Reload profile/reviews to reflect updates
      const res = await api.get(`/professionals/${id}`);
      setPro(res.data.data);
      const reviewsRes = await api.get(`/reviews/${id}`);
      setReviews(reviewsRes.data.data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="container pt-4 pb-5 mt-5">
        <div className="row g-4">
          {/* Left Column Skeleton */}
          <div className="col-lg-8">
            {/* Profile Hero Skeleton */}
            <Card className="mb-4">
              <div className="d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start">
                <div className="skeleton-line" style={{ width: '130px', height: '130px', borderRadius: '50%' }}></div>
                <div className="flex-grow-1 w-100">
                  <div className="skeleton-line mb-3" style={{ height: '32px', width: '60%' }}></div>
                  <div className="skeleton-line mb-3" style={{ height: '20px', width: '30%' }}></div>
                  <div className="skeleton-line mb-4" style={{ height: '24px', width: '80%' }}></div>
                  <div className="d-flex gap-2">
                    <div className="skeleton-line" style={{ height: '40px', width: '120px', borderRadius: '20px' }}></div>
                    <div className="skeleton-line" style={{ height: '40px', width: '120px', borderRadius: '20px' }}></div>
                  </div>
                </div>
              </div>
            </Card>
            {/* About Card Skeleton */}
            <Card className="mb-4">
              <div className="skeleton-line mb-3" style={{ height: '24px', width: '40%' }}></div>
              <div className="skeleton-line mb-2" style={{ height: '16px', width: '100%' }}></div>
              <div className="skeleton-line mb-2" style={{ height: '16px', width: '95%' }}></div>
              <div className="skeleton-line" style={{ height: '16px', width: '90%' }}></div>
            </Card>
            {/* Skills Card Skeleton */}
            <Card className="mb-4">
              <div className="skeleton-line mb-3" style={{ height: '24px', width: '30%' }}></div>
              <div className="d-flex gap-2">
                <div className="skeleton-line" style={{ height: '32px', width: '80px', borderRadius: '16px' }}></div>
                <div className="skeleton-line" style={{ height: '32px', width: '100px', borderRadius: '16px' }}></div>
                <div className="skeleton-line" style={{ height: '32px', width: '70px', borderRadius: '16px' }}></div>
              </div>
            </Card>
          </div>
          
          {/* Right Column Skeleton */}
          <div className="col-lg-4">
            <Card className="sticky-top" style={{ top: '100px' }}>
              <div className="skeleton-line mb-4" style={{ height: '28px', width: '70%' }}></div>
              <div className="skeleton-line mb-3" style={{ height: '40px', width: '100%' }}></div>
              <div className="skeleton-line mb-3" style={{ height: '40px', width: '100%' }}></div>
              <div className="skeleton-line mb-4" style={{ height: '80px', width: '100%' }}></div>
              <div className="skeleton-line mb-3" style={{ height: '60px', width: '100%' }}></div>
              <div className="skeleton-line" style={{ height: '48px', width: '100%', borderRadius: '8px' }}></div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div className="container pt-4 pb-5 mt-5 text-center">
        <h4 className="text-danger fw-bold">{error || 'Profile not found'}</h4>
        <Link to="/search" className="btn btn-premium btn-premium-primary mt-3">Back to Search</Link>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${pro.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
    `Hi ${pro.user.name}, I want to book your ${pro.serviceType} services via NammaService!`
  )}`;

  return (
    <div className="container pt-4 pb-5 mt-5 animate-fade-in">
      <div className="row g-4">
        {/* Main Details Panel */}
        <div className="col-lg-8">
          <Card className="mb-4 shadow-sm border border-light">
            <div className="d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start">
              <Avatar 
                src={pro.user?.avatar} 
                alt={pro.user?.name} 
                size="xxl"
                className="shadow-sm border-4 border-accent" 
              />
              <div className="text-center text-md-start w-100">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                  <div>
                    <h2 className="fw-bold mb-0 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      {pro.user?.name} 
                      <FaCheckCircle className="text-accent fs-5" title="Verified Professional" />
                    </h2>
                    <span className="badge bg-light text-primary border rounded-pill mt-1 px-3 py-1 fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>
                      {pro.serviceType}
                    </span>
                  </div>
                  <div className="text-md-end mt-3 mt-md-0">
                    <h3 className="fw-bold text-gradient mb-0">₹{pro.hourlyRate}<span className="fs-6 text-muted fw-normal">/hr</span></h3>
                    <small className="text-muted">Standard rate</small>
                  </div>
                </div>
                
                <h5 className="text-secondary fw-semibold mb-3 fs-6">{pro.title}</h5>
                
                <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start mb-4 text-muted small">
                  <div className="d-flex align-items-center text-warning">
                    <FaStar className="me-1" />
                    <span className="fw-bold text-dark">{pro.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted ms-1">({pro.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1 text-danger" />
                    {pro.location?.address}, {pro.location?.city}
                  </div>
                  <div className="d-flex align-items-center">
                    <FaBriefcase className="me-1 text-primary" />
                    {pro.experience} Years Experience
                  </div>
                </div>
                
                <div className="d-flex gap-2.5 justify-content-center justify-content-md-start">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-premium btn-premium-outline rounded-pill d-inline-flex align-items-center gap-2 text-success hover-bg-success px-4 py-2">
                    <FaWhatsapp size={16} /> WhatsApp
                  </a>
                  <a href={`mailto:${pro.user?.email}`} className="btn btn-premium btn-premium-outline rounded-pill d-inline-flex align-items-center gap-2 px-4 py-2">
                    <FaEnvelope size={16} /> Email Contact
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="mb-4 shadow-sm border border-light">
            <h4 className="fw-bold mb-3 border-bottom pb-2">About Professional</h4>
            <p className="text-secondary lh-lg mb-0" style={{ fontSize: '0.95rem' }}>{pro.bio}</p>
          </Card>

          {/* Skills & Services */}
          <Card className="mb-4 shadow-sm border border-light">
            <h4 className="fw-bold mb-3 border-bottom pb-2">Skills & Expertise</h4>
            <div className="d-flex flex-wrap gap-2">
              {pro.skills.map((skill, index) => (
                <span key={index} className="badge bg-light text-dark border p-2 px-3 rounded-pill fw-medium" style={{ fontSize: '0.85rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Reviews List & Add Review Form */}
          <Card className="mb-4 shadow-sm border border-light">
            <h4 className="fw-bold mb-4 border-bottom pb-2">Customer Reviews ({reviews.length})</h4>
            
            {reviews.length === 0 ? (
              <p className="text-muted italic py-3 text-center">No reviews submitted yet. Be the first to leave feedback!</p>
            ) : (
              <div className="d-flex flex-column gap-4 mb-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border-bottom pb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <Avatar 
                          src={rev.user?.avatar} 
                          alt={rev.user?.name} 
                          size="sm"
                        />
                        <div>
                          <h6 className="mb-0 fw-bold text-dark">{rev.user?.name}</h6>
                          <small className="text-muted small">{new Date(rev.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                      
                      <div className="d-flex text-warning align-items-center gap-1">
                        <FaStar />
                        <span className="fw-bold text-dark small">{rev.rating}</span>
                      </div>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">{rev.title}</h6>
                    <p className="text-muted small mb-0 lh-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write a Review Section */}
            {user && (
              <div className="bg-light p-4 rounded-4 mt-3 border">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaPen size={14} className="text-accent" /> Write a Review
                </h5>
                
                {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}
                {reviewError && <div className="alert alert-danger">{reviewError}</div>}
                
                <form onSubmit={handleReviewSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Review Title</label>
                      <input 
                        type="text" 
                        className="form-control form-control-premium py-2" 
                        placeholder="Summarize your experience..." 
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Rating</label>
                      <select 
                        className="form-select bg-white border py-2 rounded-3 fw-semibold text-warning" 
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Review Feedback</label>
                      <textarea 
                        className="form-control form-control-premium" 
                        rows="3" 
                        placeholder="Detail your experience with service quality, timing, and pricing..." 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <Button type="submit" className="mt-3 btn-premium-sm px-4">Submit Review</Button>
                </form>
              </div>
            )}
          </Card>
        </div>

        {/* Booking Widget Sidebar */}
        <div className="col-lg-4">
          <Card className="sticky-top border shadow-sm" style={{ top: '100px', zIndex: 10 }}>
            <h4 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaCalendarAlt className="text-accent" /> Book Appointment
            </h4>
            
            {bookingError && <div className="alert alert-danger small py-2">{bookingError}</div>}
            
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Select Date</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><FaCalendarAlt className="text-muted" /></span>
                  <input 
                    type="date" 
                    className="form-control bg-light border-0 py-2.5 rounded-end fw-semibold" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">Select Time Slot</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><FaClock className="text-muted" /></span>
                  <select 
                    className="form-select bg-light border-0 py-2.5 rounded-end fw-semibold"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  >
                    <option value="">Choose a slot</option>
                    <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:30 AM">11:30 AM - 01:30 PM</option>
                    <option value="02:30 PM">02:30 PM - 04:30 PM</option>
                    <option value="05:00 PM">05:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-secondary">Notes (Optional)</label>
                <textarea 
                  className="form-control bg-light border-0" 
                  rows="3" 
                  placeholder="Detail any specifics: tap leakage, AC brands, or tutoring topics..." 
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                  <span>Base Booking Charge (1 hr)</span>
                  <span>₹{pro.hourlyRate}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
                  <span>Trust & Platform Fee</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-2 fw-bold text-dark">
                  <span>Total Amount Due</span>
                  <span>₹{pro.hourlyRate}</span>
                </div>
              </div>

              <Button type="submit" className="w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={bookingLoading}>
                {bookingLoading ? 'Requesting...' : 'Request Booking'}
              </Button>
            </form>
            
            <p className="text-center text-muted small mt-3 mb-0">You won't be charged yet. Payment is made directly to the professional after service completion.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
