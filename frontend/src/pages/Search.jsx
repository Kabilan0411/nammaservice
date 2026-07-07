import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaFilter, FaBriefcase, FaMoneyBillWave, FaHeart, FaRegHeart, FaSearchLocation } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initial filters from query string
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    location: initialLocation,
    rating: '',
    experience: '',
    price: ''
  });
  
  const [professionals, setProfessionals] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For Map view simulation
  const [selectedProId, setSelectedProId] = useState(null);

  // Fetch list of saved professionals to show heart state
  const fetchSavedList = async () => {
    if (!user) return;
    try {
      const res = await api.get('/saved-professionals');
      const ids = res.data.data.map(pro => pro._id);
      setSavedIds(ids);
    } catch (err) {
      console.error('Failed to load saved list', err);
    }
  };

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setError('');
      
      let params = new URLSearchParams();
      if (filters.category) params.append('serviceType', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.price) params.append('price', filters.price);
      
      const res = await api.get(`/professionals?${params.toString()}`);
      setProfessionals(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedProId(res.data.data[0]._id); // highlight first by default
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedList();
  }, [user]);

  useEffect(() => {
    fetchProfessionals();
  }, [filters.category, filters.location]); // Automatically trigger search when category/location changes

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchProfessionals();
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      location: '',
      rating: '',
      experience: '',
      price: ''
    });
    setSearchParams({});
  };

  const toggleSaveProfessional = async (proId) => {
    if (!user) {
      alert('Please login to save professionals.');
      return;
    }

    const isSaved = savedIds.includes(proId);
    try {
      if (isSaved) {
        await api.delete(`/saved-professionals/${proId}`);
        setSavedIds(prev => prev.filter(id => id !== proId));
      } else {
        await api.post('/saved-professionals', { professionalId: proId });
        setSavedIds(prev => [...prev, proId]);
      }
    } catch (err) {
      console.error('Failed to toggle save professional', err);
    }
  };

  const selectedProfessionalDetails = professionals.find(p => p._id === selectedProId);
  const mapQuery = selectedProfessionalDetails 
    ? `${selectedProfessionalDetails.location?.address || ''}, ${selectedProfessionalDetails.location?.city || ''}, India`
    : (filters.location ? `${filters.location}, India` : 'Chennai, India');
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container-fluid py-5 mt-5 px-lg-5 animate-fade-in">
      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <Card className="sticky-top border shadow-sm" style={{ top: '100px', zIndex: 10 }}>
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
              <div className="d-flex align-items-center">
                <FaFilter className="text-accent me-2" />
                <h5 className="fw-bold mb-0">Search Filters</h5>
              </div>
              <button onClick={handleClearFilters} className="btn btn-sm text-primary p-0 border-0 bg-transparent fw-semibold" style={{ fontSize: '0.85rem' }}>
                Reset All
              </button>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Service Type</label>
              <select className="form-select bg-light border-0 py-2.5 rounded-3 fw-medium" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Services</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="AC Technician">AC Technician</option>
                <option value="Painter">Painter</option>
                <option value="House Cleaner">House Cleaner</option>
                <option value="RO Technician">RO Technician</option>
                <option value="Laptop/Mobile Repair">Laptop/Mobile Repair</option>
                <option value="Home Tutor">Home Tutor</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Location</label>
              <input 
                type="text" 
                className="form-control bg-light border-0 py-2.5 rounded-3 fw-medium" 
                name="location" 
                placeholder="City (e.g. Chennai)" 
                value={filters.location} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Minimum Experience</label>
              <select className="form-select bg-light border-0 py-2.5 rounded-3 fw-medium" name="experience" value={filters.experience} onChange={handleFilterChange}>
                <option value="">Any Experience</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="8">8+ Years</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">Minimum Rating</label>
              <select className="form-select bg-light border-0 py-2.5 rounded-3 fw-medium" name="rating" value={filters.rating} onChange={handleFilterChange}>
                <option value="">Any Rating</option>
                <option value="4">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small text-secondary">Max Hourly Rate (₹)</label>
              <select className="form-select bg-light border-0 py-2.5 rounded-3 fw-medium" name="price" value={filters.price} onChange={handleFilterChange}>
                <option value="">Any Price</option>
                <option value="300">Under ₹300/hr</option>
                <option value="450">Under ₹450/hr</option>
                <option value="600">Under ₹600/hr</option>
              </select>
            </div>
            
            <Button className="w-100 py-2.5" onClick={handleApplyFilters}>Apply Filters</Button>
          </Card>
        </div>

        {/* Results List */}
        <div className="col-lg-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">
                {filters.category ? `${filters.category} Experts` : 'All Available Experts'}
              </h3>
              <p className="text-muted small mb-0">Verified local professionals on NammaService</p>
            </div>
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold">
              {professionals.length} results
            </span>
          </div>

          {error && <div className="alert alert-danger rounded-3">{error}</div>}
          
          {loading ? (
            <div className="d-flex flex-column gap-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border shadow-sm">
                  <div className="d-flex gap-3">
                    <div className="skeleton-line" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <div className="flex-grow-1">
                      <div className="skeleton-line mb-2" style={{ height: '20px', width: '60%' }}></div>
                      <div className="skeleton-line mb-2" style={{ height: '16px', width: '40%' }}></div>
                      <div className="skeleton-line" style={{ height: '14px', width: '80%' }}></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-5 border rounded-4 bg-light d-flex flex-column align-items-center gap-3">
              <FaSearchLocation size={50} className="text-muted" />
              <h5 className="fw-bold text-dark mb-1">No professionals match your criteria</h5>
              <p className="text-muted small px-4">Try clearing some filters or entering a different location city (e.g. Chennai, Bangalore).</p>
              <Button onClick={handleClearFilters} className="btn-sm">Clear All Filters</Button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {professionals.map((pro) => (
                <div 
                  key={pro._id} 
                  onClick={() => setSelectedProId(pro._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card className={`border shadow-sm position-relative ${selectedProId === pro._id ? 'border-primary' : ''}`} style={{ transition: 'border-color 0.2s' }}>
                    
                    {/* Favorite Heart Trigger */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProfessional(pro._id);
                      }}
                      className="btn position-absolute top-0 end-0 m-3 p-1 text-danger border-0 bg-transparent"
                      style={{ zIndex: 5 }}
                      aria-label="Favorite"
                    >
                      {savedIds.includes(pro._id) ? <FaHeart size={20} /> : <FaRegHeart size={20} className="text-muted" />}
                    </button>

                    <div className="d-flex gap-3 flex-column flex-sm-row">
                      <img 
                        src={pro.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} 
                        alt={pro.user?.name} 
                        className="rounded-circle object-fit-cover shadow-sm border border-2 border-accent" 
                        style={{ width: '80px', height: '80px' }} 
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="fw-bold mb-0">{pro.user?.name}</h5>
                          <span className="badge bg-light text-primary border rounded-pill px-2 py-0.5" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                            {pro.serviceType}
                          </span>
                        </div>
                        <p className="text-muted small mb-2 fw-semibold">{pro.title}</p>
                        
                        <div className="d-flex flex-wrap gap-3 mb-2" style={{ fontSize: '0.85rem' }}>
                          <div className="d-flex align-items-center text-warning">
                            <FaStar className="me-1" />
                            <span className="text-dark fw-bold">{pro.averageRating?.toFixed(1) || '0.0'}</span>
                            <span className="text-muted ms-1">({pro.reviewCount || 0} reviews)</span>
                          </div>
                          <div className="d-flex align-items-center text-muted">
                            <FaBriefcase className="me-1" />
                            <span>{pro.experience} yrs exp</span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center text-muted small mb-3">
                          <FaMapMarkerAlt className="me-1 text-danger" />
                          <span>{pro.location?.address}, {pro.location?.city}</span>
                        </div>

                        <div className="d-flex flex-wrap gap-1 mb-2">
                          {pro.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="badge bg-light text-dark border p-1 px-2 rounded" style={{ fontSize: '0.75rem' }}>
                              {skill}
                            </span>
                          ))}
                          {pro.skills.length > 3 && (
                            <span className="badge bg-light text-muted border p-1 px-2 rounded" style={{ fontSize: '0.75rem' }}>
                              +{pro.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <div className="d-flex align-items-baseline">
                        <span className="fw-bold fs-4 text-gradient">₹{pro.hourlyRate}</span>
                        <span className="text-muted small ms-1">/hr</span>
                      </div>
                      <Link to={`/professional/${pro._id}`} className="btn btn-premium btn-premium-primary btn-premium-sm px-4">
                        View Profile
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Premium Map Canvas Overlay (Airbnb inspired) */}
        <div className="col-lg-4 d-none d-lg-block">
          <Card className="sticky-top shadow-premium border-0 p-0 overflow-hidden" style={{ top: '100px', height: 'calc(100vh - 150px)', borderRadius: '16px' }}>
            <div className="bg-primary-custom text-white p-3 d-flex align-items-center gap-2">
              <FaSearchLocation className="text-accent" />
              <h6 className="mb-0 fw-bold">Live Coverage & Partners Map</h6>
            </div>
            
            {/* Live Google Maps embed */}
            <div className="w-100 h-100 bg-light position-relative" style={{ minHeight: '400px' }}>
              <iframe 
                title="Google Maps"
                width="100%" 
                height="100%" 
                id="gmap_canvas" 
                src={mapUrl} 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0"
                style={{ border: 0, minHeight: 'calc(100vh - 200px)' }}
              ></iframe>
              
              {/* Highlighted Map Detail Card Overlay */}
              {selectedProfessionalDetails && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 w-100 px-3" style={{ zIndex: 10 }}>
                  <Card className="shadow-lg border-0 p-3 bg-white d-flex align-items-center gap-3 glass-premium" style={{ borderRadius: '12px', margin: '0 auto', maxWidth: '380px' }}>
                    <img 
                      src={selectedProfessionalDetails.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} 
                      alt="Selected" 
                      className="rounded-circle object-fit-cover border" 
                      style={{ width: '50px', height: '50px' }} 
                    />
                    <div className="flex-grow-1 text-truncate" style={{ minWidth: 0 }}>
                      <h6 className="mb-0 fw-bold text-dark text-truncate">{selectedProfessionalDetails.user?.name}</h6>
                      <small className="text-accent fw-semibold d-block text-truncate">{selectedProfessionalDetails.title}</small>
                      <small className="text-muted d-block text-truncate">
                        <FaMapMarkerAlt size={10} className="text-danger me-1" />
                        {selectedProfessionalDetails.location?.address}, {selectedProfessionalDetails.location?.city}
                      </small>
                    </div>
                    <Link to={`/professional/${selectedProfessionalDetails._id}`} className="btn btn-sm btn-accent text-white rounded-pill px-3">
                      View
                    </Link>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Search;
