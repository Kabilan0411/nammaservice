import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const proName = searchParams.get('proName') || 'Ramesh Kumar';
  const service = searchParams.get('service') || 'Plumber';
  const date = searchParams.get('date') ? new Date(searchParams.get('date')).toLocaleDateString() : new Date().toLocaleDateString();
  const time = searchParams.get('time') || '09:00 AM';

  return (
    <div className="container py-5 mt-5 animate-fade-in">
      <div className="row justify-content-center text-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg mt-4 border-0 py-5 px-4">
            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4 p-3 border border-success" style={{ width: '100px', height: '100px' }}>
              <FaCheckCircle className="text-success" size={60} />
            </div>
            
            <h2 className="fw-bold mb-2 text-gradient">Booking Requested!</h2>
            <p className="text-muted small mb-4">
              Your appointment request has been dispatched to the service provider. You will be alerted when they accept it.
            </p>
            
            <div className="p-3 bg-light rounded-4 mb-4 text-start border">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 border-bottom pb-2 text-dark">
                <FaCalendarCheck className="text-accent" /> Appointment Summary
              </h6>
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.88rem' }}>
                <div>
                  <span className="text-muted">Service Provider:</span>
                  <span className="fw-semibold text-dark float-end">{proName}</span>
                </div>
                <div>
                  <span className="text-muted">Category:</span>
                  <span className="badge bg-light text-primary border rounded-pill px-2.5 float-end fw-bold text-uppercase">{service}</span>
                </div>
                <div>
                  <span className="text-muted">Date:</span>
                  <span className="fw-semibold text-dark float-end">{date}</span>
                </div>
                <div>
                  <span className="text-muted">Scheduled Time:</span>
                  <span className="fw-semibold text-dark float-end">{time}</span>
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/dashboard" className="w-100">
                <Button className="w-100">Go to Dashboard</Button>
              </Link>
              <Link to="/" className="w-100">
                <Button variant="outline" className="w-100">Return Home</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
