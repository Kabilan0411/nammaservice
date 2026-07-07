import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <Card className="shadow-premium mt-4 border border-light p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-gradient mb-2">Create an Account</h2>
              <p className="text-muted small">Join NammaService to book professionals or register as a partner.</p>
            </div>
            
            {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-premium" 
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-premium" 
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-premium" 
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-100 btn-lg mt-4 mb-3 py-3" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="text-center mt-3 pt-3 border-top">
              <p className="text-muted small mb-0">
                Already have an account? <Link to="/login" className="fw-bold text-accent text-decoration-none ms-1">Login</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
