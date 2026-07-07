import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const queryEmail = searchParams.get('email') || '';
  
  const navigate = useNavigate();
  const { verifyOtp } = useContext(AuthContext);

  const [email, setEmail] = useState(queryEmail);
  const [isOtpSent, setIsOtpSent] = useState(!!queryEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  
  // Resend countdown state (30 seconds)
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpSent]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSuccess('');
    setSendLoading(true);

    try {
      // Trigger root level API POST /send-otp or /api/send-otp
      const res = await api.post('/send-otp', { email });
      setSuccess(res.data?.message || 'Verification OTP code sent to your email.');
      setIsOtpSent(true);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please make sure the account is registered.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Numeric characters only
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await verifyOtp(email, otp);
      setSuccess('Email verified successfully! Logging you in...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setSuccess('');
    setSendLoading(true);

    try {
      const res = await api.post('/send-otp', { email });
      setSuccess(res.data?.message || 'Verification code sent successfully.');
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-premium mt-4 border border-light p-4">
            <div className="text-center mb-4">
              <div className="mb-3 d-inline-flex align-items-center justify-content-center bg-light text-primary rounded-circle" style={{ width: '64px', height: '64px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-shield-check text-accent" viewBox="0 0 16 16">
                  <path d="M5.338 1.59a.5.5 0 0 0-.242.47c.223 2.851 1.9 5.26 4.902 6.11a.5.5 0 0 0 .324 0c3.001-.85 4.68-3.259 4.902-6.11a.5.5 0 0 0-.243-.47L10 .125a.5.5 0 0 0-.325 0L5.338 1.59zM9.5 0c.26 0 .52.062.757.184l4.896 1.469c.47.14.773.57.773 1.056v.444c0 3.39-2.074 6.5-5.617 7.502a1.5 1.5 0 0 1-.78 0C5.074 9.602 3 6.49 3 3.102v-.444c0-.486.302-.916.773-1.056L8.67.184A1.5 1.5 0 0 1 9.5 0z"/>
                  <path d="M10.854 4.146a.5.5 0 1 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.293l2.646-2.647z"/>
                </svg>
              </div>
              <h2 className="fw-bold text-gradient mb-2">Verify Your Email</h2>
              {isOtpSent ? (
                <>
                  <p className="text-muted small mb-2">We've sent a 6-digit verification code to:</p>
                  <div className="badge bg-light text-primary px-3 py-2 fw-semibold border">{email}</div>
                </>
              ) : (
                <p className="text-muted small">Enter your registered email to request a secure verification OTP.</p>
              )}
            </div>

            {error && <div className="alert alert-danger rounded-3 small py-2 text-center">{error}</div>}
            {success && <div className="alert alert-success rounded-3 small py-2 text-center">{success}</div>}

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-premium"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={sendLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-100 py-3"
                  disabled={sendLoading || !email}
                >
                  {sendLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitVerification}>
                <div className="mb-4">
                  <label className="form-label d-block fw-semibold small text-secondary text-center mb-3">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    className="form-control form-control-premium text-center fw-bold"
                    style={{
                      letterSpacing: '0.8rem',
                      fontSize: '2rem',
                      paddingLeft: '1.6rem',
                      backgroundColor: 'var(--bg-light)'
                    }}
                    placeholder="000000"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={loading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-100 py-3 mb-3"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying Code...' : 'Verify & Complete Signup'}
                </Button>

                <div className="text-center mt-3 pt-3 border-top">
                  <p className="text-muted small mb-0">
                    Didn't receive the code?{' '}
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="btn btn-link text-accent fw-bold p-0 border-0 align-baseline text-decoration-none"
                        disabled={sendLoading}
                      >
                        {sendLoading ? 'Resending...' : 'Resend Code'}
                      </button>
                    ) : (
                      <span className="text-secondary fw-semibold">
                        Resend Code in {timer}s
                      </span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="btn btn-link text-secondary fw-semibold btn-sm mt-2 text-decoration-none"
                  >
                    ← Change Email Address
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
