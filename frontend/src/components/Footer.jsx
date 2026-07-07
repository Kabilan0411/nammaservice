import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary-custom text-white py-5 mt-auto border-top border-dark" style={{ borderTopWidth: '4px' }}>
      <div className="container py-4">
        <div className="row g-5">
          {/* Brand & Description */}
          <div className="col-lg-4">
            <h4 className="fw-bold mb-3 text-white" style={{ letterSpacing: '-0.5px' }}>
              Namma<span className="text-accent">Service</span>
            </h4>
            <p className="footer-desc mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
              NammaService is a premium on-demand platform matching homeowners and businesses with trusted, background-checked local professionals. We deliver elite, guaranteed quality for plumbing, electronics, repairs, and tutoring.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="social-btn" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-btn" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-btn" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-md-6 col-lg-2">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="footer-link">About NammaService</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Careers</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Press & Media</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>
          
          {/* Services Quick Directory */}
          <div className="col-md-6 col-lg-3">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Services Directory</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/search?category=Plumber" className="footer-link">Professional Plumber</Link></li>
              <li className="mb-2"><Link to="/search?category=Electrician" className="footer-link">Licensed Electrician</Link></li>
              <li className="mb-2"><Link to="/search?category=AC Technician" className="footer-link">AC Technicians</Link></li>
              <li className="mb-2"><Link to="/search?category=House Cleaner" className="footer-link">House Cleaners</Link></li>
              <li className="mb-2"><Link to="/search?category=Home Tutor" className="footer-link">Home Tutors</Link></li>
              <li className="mb-2"><Link to="/search?category=Laptop/Mobile Repair" className="footer-link">Laptop & Phone Repair</Link></li>
            </ul>
          </div>
          
          {/* Contact Details & Newsletter */}
          <div className="col-lg-3">
            <h6 className="text-uppercase fw-bold text-white mb-4" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Contact Support</h6>
            <ul className="list-unstyled text-white-50 mb-4" style={{ fontSize: '0.9rem' }}>
              <li className="mb-2 d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-accent" /> Chennai, Tamil Nadu, India
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <FaPhone className="text-accent" /> +91 98765 43210
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <FaEnvelope className="text-accent" /> support@nammaservice.com
              </li>
            </ul>
            
            <h6 className="text-uppercase fw-bold text-white mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Get Special Offers</h6>
            <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
              <input 
                type="email" 
                className="form-control form-control-sm border-secondary text-white bg-transparent" 
                placeholder="Enter email"
                style={{ borderRadius: '8px' }}
              />
              <button type="submit" className="btn btn-sm btn-accent text-white px-3" style={{ borderRadius: '8px' }}>
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-top border-dark mt-5 pt-4 text-center text-white-50" style={{ fontSize: '0.85rem' }}>
          <p className="mb-0 text-white-50">&copy; {new Date().getFullYear()} NammaService. Made with luxury & quality. All rights reserved.</p>
        </div>
      </div>
      
      <style>{`
        .footer-desc, .footer-contact {
          color: #94A3B8 !important;
        }
        .text-white-50 {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .footer-link {
          color: #E2E8F0 !important;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: #14B8A6 !important;
          padding-left: 4px;
        }
        .social-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #1E293B;
          color: #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          background-color: #14B8A6;
          color: #FFFFFF;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
