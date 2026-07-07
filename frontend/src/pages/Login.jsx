import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        navigate(`/verify-email?email=${encodeURIComponent(err.response.data.email)}`);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-premium mt-4 border border-light p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-gradient mb-2">Welcome Back</h2>
              <p className="text-muted small">Access your bookings and dashboard.</p>
            </div>
            
            {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-premium" 
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold mb-0 small text-secondary">Password</label>
                  <Link to="/forgot-password" className="text-decoration-none small text-accent fw-bold">Forgot Password?</Link>
                </div>
                <input 
                  type="password" 
                  className="form-control form-control-premium" 
                  name="password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <Button type="submit" className="w-100 py-3 mb-3" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            
            <div className="text-center mt-3 pt-3 border-top">
              <p className="text-muted small mb-0">
                Don't have an account? <Link to="/register" className="fw-bold text-accent text-decoration-none ms-1">Sign up</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
