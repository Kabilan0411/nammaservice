import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWrench, FaBolt, FaHammer, FaWind, FaPaintRoller, FaBroom, FaFilter, FaLaptopMedical, FaGraduationCap, FaStar, FaArrowRight, FaUsers, FaClipboardCheck, FaRegSmile } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredPros, setFeaturedPros] = useState([]);
  const [loadingPros, setLoadingPros] = useState(true);

  // Fetch top rated professionals for "Featured Professionals"
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/professionals?sort=-averageRating&limit=3');
        setFeaturedPros(res.data.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured professionals', err);
      } finally {
        setLoadingPros(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = '/search?';
    if (searchCategory) query += `category=${searchCategory}&`;
    if (searchLocation) query += `location=${searchLocation}`;
    navigate(query);
  };

  const categories = [
    { icon: <FaWrench size={26} />, name: 'Plumber', desc: 'Fix leaks, taps, toilets' },
    { icon: <FaBolt size={26} />, name: 'Electrician', desc: 'Wiring, fixtures, repairs' },
    { icon: <FaHammer size={26} />, name: 'Carpenter', desc: 'Furniture repairs, assembly' },
    { icon: <FaWind size={26} />, name: 'AC Technician', desc: 'Service, repair, install' },
    { icon: <FaPaintRoller size={26} />, name: 'Painter', desc: 'Wall texture, wall paint' },
    { icon: <FaBroom size={26} />, name: 'House Cleaner', desc: 'Full deep cleaning service' },
    { icon: <FaFilter size={26} />, name: 'RO Technician', desc: 'Purifier repairs & filters' },
    { icon: <FaLaptopMedical size={26} />, name: 'Laptop/Mobile Repair', desc: 'Hardware chip-level fix' },
    { icon: <FaGraduationCap size={26} />, name: 'Home Tutor', desc: 'School STEM & languages' }
  ];

  const testimonials = [
    {
      text: "Booking a plumber used to take hours of calls. On NammaService, I found Ravi in 2 minutes, saw his excellent reviews, and he arrived fully equipped within the hour. Absolute lifesaver!",
      name: "Aisha Sen",
      role: "Homeowner, Chennai",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop"
    },
    {
      text: "NammaService helped me grow my AC servicing business by 200%. The booking panel makes scheduling super easy, and customers trust me because of my verified badge.",
      name: "Mohamed Ali",
      role: "AC Partner, Chennai",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&h=120&fit=crop"
    },
    {
      text: "I hired a home physics tutor for my daughter. The flexibility and rating verification gave me total peace of mind, and her grades improved tremendously. Elite service!",
      name: "Srinivasan R.",
      role: "Parent, Bangalore",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5 pt-5 mt-5" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 50%), var(--bg-color)' }}>
        <div className="container py-5 mt-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-light text-primary border px-3 py-2 rounded-pill fw-semibold mb-3" style={{ fontSize: '0.85rem' }}>
                <span className="text-accent">&#9679;</span> High-Quality Service Guaranteed
              </span>
              <h1 className="display-3 fw-bold mb-4 tracking-tight text-gradient">
                Elite Professionals.<br />At Your Doorstep.
              </h1>
              <p className="lead mb-4 text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Book top-rated plumbers, cleaners, technicians, and home tutors instantly. Connect directly with background-checked local experts in Chennai, Bangalore, and Mumbai.
              </p>
              
              {/* Premium Search Console */}
              <form onSubmit={handleSearchSubmit} className="p-3 bg-white border rounded-4 shadow-premium d-flex flex-column flex-md-row gap-3 align-items-center mb-4 glass-premium">
                <div className="w-100 position-relative">
                  <select 
                    className="form-select border-0 bg-transparent py-2 shadow-none fw-semibold" 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select a Service</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="vr d-none d-md-block" style={{ height: '35px', backgroundColor: 'var(--border-color)' }}></div>
                <div className="w-100">
                  <input 
                    type="text" 
                    className="form-control border-0 bg-transparent py-2 shadow-none fw-medium" 
                    placeholder="Enter city (e.g. Chennai)" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-100 w-md-auto py-2.5 px-4 rounded-3 d-flex align-items-center justify-content-center gap-2">
                  <span>Search</span> <FaArrowRight size={14} />
                </Button>
              </form>

              <div className="d-flex align-items-center gap-3">
                <div className="d-flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="User" className="rounded-circle border border-2 border-white" style={{ width: '36px', height: '36px' }} />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="User" className="rounded-circle border border-2 border-white ms-n2" style={{ width: '36px', height: '36px' }} />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="User" className="rounded-circle border border-2 border-white ms-n2" style={{ width: '36px', height: '36px' }} />
                </div>
                <span className="small text-muted fw-semibold">Joined by 10,000+ satisfied homeowners</span>
              </div>
            </div>
            
            <div className="col-lg-6 d-none d-lg-block text-center position-relative">
              <div className="position-relative d-inline-block">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Premium Home Services" 
                  className="img-fluid rounded-4 shadow-premium"
                  style={{ maxHeight: '480px', width: '540px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
                
                {/* Floating Rating Card */}
                <div className="position-absolute bottom-0 start-0 translate-middle-y bg-white p-3 rounded-4 shadow-lg ms-n4 border glass-premium text-start" style={{ width: '220px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-accent text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px' }}>
                      4.9
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Highly Rated</h6>
                      <div className="d-flex text-warning gap-0.5" style={{ fontSize: '0.75rem' }}>
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                      <small className="text-muted small">Top Partner Network</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-5 bg-premium-light border-top border-bottom">
        <div className="container py-5">
          <div className="text-center mb-5 max-w-xl mx-auto">
            <span className="text-accent text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.8rem' }}>Direct Booking</span>
            <h2 className="fw-bold fs-1 mt-2 mb-3">Professional Services Directory</h2>
            <p className="text-muted">Choose from our curated database of verified experts, sorted by ratings and experience.</p>
          </div>
          <div className="row g-4">
            {categories.map((cat, index) => (
              <div className="col-md-6 col-lg-4 animate-on-scroll" key={index}>
                <Link to={`/search?category=${cat.name}`} className="text-decoration-none">
                  <Card className="h-100 hover-shadow bg-white text-start d-flex align-items-start gap-4">
                    <div className="bg-light p-3 rounded-3 text-accent border d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-1.5">
                        {cat.name} <FaArrowRight className="text-muted d-none d-lg-inline" size={12} />
                      </h5>
                      <p className="text-muted small mb-0 lh-base">{cat.desc}</p>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-accent text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.8rem' }}>Simple Flow</span>
            <h2 className="fw-bold fs-1 mt-2">How NammaService Works</h2>
          </div>
          <div className="row g-5 text-center mt-3">
            <div className="col-md-4">
              <div className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center mb-4 border" style={{ width: '90px', height: '90px' }}>
                <span className="fs-2 fw-bold text-primary">1</span>
              </div>
              <h4 className="fw-bold mb-3">Explore & Filter</h4>
              <p className="text-muted px-lg-3 small">Browse background-checked professionals by category, pricing, ratings, or location coordinates.</p>
            </div>
            <div className="col-md-4">
              <div className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center mb-4 border" style={{ width: '90px', height: '90px' }}>
                <span className="fs-2 fw-bold text-primary">2</span>
              </div>
              <h4 className="fw-bold mb-3">Select & Request</h4>
              <p className="text-muted px-lg-3 small">Book a custom date and time. Talk directly with professionals via WhatsApp or in-app contact features.</p>
            </div>
            <div className="col-md-4">
              <div className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center mb-4 border" style={{ width: '90px', height: '90px' }}>
                <span className="fs-2 fw-bold text-primary">3</span>
              </div>
              <h4 className="fw-bold mb-3">Approve & Pay</h4>
              <p className="text-muted px-lg-3 small">The professional arrives and completes the service. Approve and complete payment securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (Apple inspired layout) */}
      <section className="py-5 bg-primary-custom text-white border-top border-bottom position-relative">
        <div className="container py-5 text-center">
          <div className="row g-5 justify-content-center">
            <div className="col-md-4">
              <div className="d-flex flex-column align-items-center">
                <FaClipboardCheck className="text-accent mb-3" size={36} />
                <h2 className="display-4 fw-extrabold text-white mb-2">5,000+</h2>
                <span className="text-uppercase tracking-wider text-white-50 small font-semibold">Bookings Completed</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex flex-column align-items-center">
                <FaUsers className="text-accent mb-3" size={36} />
                <h2 className="display-4 fw-extrabold text-white mb-2">150+</h2>
                <span className="text-uppercase tracking-wider text-white-50 small font-semibold">Verified Partners</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex flex-column align-items-center">
                <FaRegSmile className="text-accent mb-3" size={36} />
                <h2 className="display-4 fw-extrabold text-white mb-2">99.2%</h2>
                <span className="text-uppercase tracking-wider text-white-50 small font-semibold">Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trusted Professionals */}
      <section className="py-5">
        <div className="container py-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
            <div>
              <span className="text-accent text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.8rem' }}>Top Partners</span>
              <h2 className="fw-bold fs-1 mt-2 mb-0">Trusted Local Professionals</h2>
            </div>
            <Link to="/search" className="btn btn-premium btn-premium-outline mt-3 mt-md-0 d-flex align-items-center gap-2">
              <span>View All Professionals</span> <FaArrowRight size={14} />
            </Link>
          </div>

          {loadingPros ? (
            <div className="row g-4">
              {[1, 2, 3].map((n) => (
                <div className="col-md-4" key={n}>
                  <Card className="h-100">
                    <div className="skeleton-line" style={{ height: '80px', width: '80px', borderRadius: '50%' }}></div>
                    <div className="skeleton-line mt-3" style={{ height: '24px', width: '150px' }}></div>
                    <div className="skeleton-line mt-2" style={{ height: '16px', width: '200px' }}></div>
                  </Card>
                </div>
              ))}
            </div>
          ) : featuredPros.length === 0 ? (
            <div className="text-center py-5 border rounded-4 bg-light">
              <p className="text-muted mb-0">No professionals found. Make sure database is seeded.</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredPros.map((pro) => (
                <div className="col-md-4" key={pro._id}>
                  <Card className="h-100 text-center d-flex flex-column align-items-center p-4">
                    <img 
                      src={pro.user?.avatar || 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'} 
                      alt={pro.user?.name} 
                      className="rounded-circle object-fit-cover shadow-sm border border-3 border-accent mb-3" 
                      style={{ width: '90px', height: '90px' }} 
                    />
                    <h5 className="fw-bold mb-1">{pro.user?.name}</h5>
                    <span className="badge bg-light text-primary border rounded-pill mb-2 px-3 py-1 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                      {pro.serviceType}
                    </span>
                    <p className="text-muted small text-truncate-3 px-2 mb-3 lh-relaxed" style={{ fontSize: '0.85rem' }}>
                      {pro.title}
                    </p>
                    
                    <div className="d-flex align-items-center gap-1.5 text-warning mb-3">
                      <FaStar />
                      <span className="text-dark fw-bold small">{pro.averageRating?.toFixed(1) || '5.0'}</span>
                      <span className="text-muted small">({pro.reviewCount || 0} reviews)</span>
                    </div>

                    <div className="border-top pt-3 w-100 mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold fs-5">₹{pro.hourlyRate}</span>
                        <span className="text-muted small">/hr</span>
                      </div>
                      <Link to={`/professional/${pro._id}`} className="btn btn-premium btn-premium-primary btn-premium-sm px-3">
                        View Profile
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials (Airbnb Slider inspired) */}
      <section className="py-5 bg-premium-light border-top border-bottom">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-accent text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.8rem' }}>Client Stories</span>
            <h2 className="fw-bold fs-1 mt-2">Loved by Thousands</h2>
          </div>
          <div className="row g-4 mt-3">
            {testimonials.map((test, index) => (
              <div className="col-lg-4" key={index}>
                <Card className="h-100 bg-white border d-flex flex-column justify-content-between">
                  <p className="text-secondary mb-4 italic" style={{ fontSize: '0.95rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                    "{test.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <img src={test.avatar} alt={test.name} className="rounded-circle object-fit-cover border" style={{ width: '48px', height: '48px' }} />
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{test.name}</h6>
                      <small className="text-muted">{test.role}</small>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 text-center position-relative overflow-hidden" style={{ background: 'var(--primary-color)' }}>
        <div className="container py-5 z-2 position-relative">
          <h2 className="display-4 fw-bold text-white mb-3 tracking-tight">Ready to Book Your Service?</h2>
          <p className="text-white-50 lead max-w-md mx-auto mb-5">
            Find and book elite service professionals instantly. Zero upfront payments, satisfaction guaranteed.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Link to="/search">
              <Button className="btn-lg px-5 btn-premium-accent w-100 w-sm-auto">Find a Professional</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="btn-lg px-5 border-white text-white w-100 w-sm-auto hover-bg-white">
                Join as Partner
              </Button>
            </Link>
          </div>
        </div>
        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 opacity-10" style={{ background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 60%)', filter: 'blur(80px)' }}></div>
      </section>
      
      <style>{`
        .text-truncate-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .hover-bg-white:hover {
          background-color: white !important;
          color: var(--primary-color) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
