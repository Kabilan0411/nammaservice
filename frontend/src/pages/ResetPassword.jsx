import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess('Your password has been reset successfully!');
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
              <h2 className="fw-bold text-gradient mb-2">New Password</h2>
              <p className="text-muted small">Create a secure password containing at least 6 characters.</p>
            </div>

            {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}

            {success ? (
              <div className="text-center py-3">
                <FaCheckCircle className="text-success mb-3" size={50} />
                <h5 className="fw-bold text-dark">{success}</h5>
                <p className="text-muted small mb-4">Redirecting you to the login page...</p>
                <Link to="/login" className="btn btn-premium btn-premium-primary w-100">
                  Login Now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><FaLock className="text-muted" /></span>
                    <input
                      type="password"
                      className="form-control bg-light border-0 py-2.5 rounded-end fw-medium"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><FaLock className="text-muted" /></span>
                    <input
                      type="password"
                      className="form-control bg-light border-0 py-2.5 rounded-end fw-medium"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-100 py-3 mb-3" disabled={loading}>
                  {loading ? 'Resetting...' : 'Update Password'}
                </Button>
              </form>
            )}

            {!success && (
              <div className="text-center mt-3 border-top pt-3">
                <Link to="/login" className="text-decoration-none small d-inline-flex align-items-center gap-2 text-muted fw-semibold">
                  <FaArrowLeft size={10} /> Back to Login
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
