import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [simulatedLink, setSimulatedLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSimulatedLink('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess('Reset link generated successfully!');
      setSimulatedLink(res.data.resetUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg mt-4 border-0 p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">Reset Password</h2>
              <p className="text-muted small">Enter your email and we'll simulate a password recovery link.</p>
            </div>

            {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}
            
            {success ? (
              <div className="text-center py-3">
                <FaCheckCircle className="text-success mb-3" size={50} />
                <h5 className="fw-bold text-dark">{success}</h5>
                <p className="text-muted small mb-3">
               We've sent a secure password reset link to your registered email address.
              </p>

             <div className="bg-light p-3 rounded-3 small mb-4">
             <p className="mb-2">
             Please check your inbox and follow the instructions to reset your password.
            </p>
            </div>
                <Link to="/login" className="btn btn-premium btn-premium-primary w-100">
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><FaEnvelope className="text-muted" /></span>
                    <input 
                      type="email" 
                      className="form-control bg-light border-0 py-2.5 rounded-end fw-medium" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-100 py-3 mb-3" disabled={loading}>
                  {loading ? 'Generating...' : 'Send Recovery Link'}
                </Button>
              </form>
            )}

            <div className="text-center mt-3 border-top pt-3">
              <Link to="/login" className="text-decoration-none small d-inline-flex align-items-center gap-2 text-muted fw-semibold">
                <FaArrowLeft size={10} /> Back to Login
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
