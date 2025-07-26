import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // Get role and user ID from localStorage
  const role = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-white text-center py-5"
        style={{
          backgroundColor: '#004d4d',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold mb-3 text-warning">Welcome to JobXcel</h1>
          <h2 className="fw-semibold mb-3">Kickstart Your Career</h2>
          <p className="lead mb-4">
            Explore thousands of job opportunities. Find your dream job today with just a click.
          </p>
          <button
            className="btn btn-warning btn-lg px-5 py-2 mb-3"
            onClick={() => navigate('/jobs')}
          >
            Browse Jobs
          </button>
          <p className="text-white-50">
            Start your journey with JobXcel — where top companies meet top talent.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">Why Choose JobXcel?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <Briefcase size={32} className="mb-3 text-primary" />
                <h5 className="fw-bold">Verified Jobs</h5>
                <p className="text-muted">Only genuine listings from trusted employers.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <Briefcase size={32} className="mb-3 text-success" />
                <h5 className="fw-bold">1-Click Apply</h5>
                <p className="text-muted">Apply quickly with your saved profile & resume.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded shadow-sm h-100 bg-white">
                <Briefcase size={32} className="mb-3 text-danger" />
                <h5 className="fw-bold">Career Growth</h5>
                <p className="text-muted">Learn, upskill and grow with our career guides.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 text-center text-white" style={{ backgroundColor: '#004d4d' }}>
        <div className="container">
          <h2 className="mb-3 text-warning">Ready to Launch Your Future?</h2>
          <p className="lead mb-4">Join JobXcel and take the next big step in your career.</p>
          {!userId ? (
            <button
              className="btn btn-warning btn-lg px-5 py-2 mb-3"
              onClick={() => navigate('/register')}
            >
              Create Your Account
            </button>
          ) : (
            <button
              className="btn btn-light btn-lg px-5 py-2 mb-3"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-3">
        <div className="container text-center text-md-start">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="fw-bold text-white">JobXcel</h5>
              <p>Your trusted partner in finding jobs and hiring top talent across the country.</p>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Quick Links</h6>
              <ul className="list-unstyled">
                <li><button className="btn btn-link text-white" onClick={() => navigate('/jobs')}>Browse Jobs</button></li>
                {!userId && (
                  <>
                    <li><button className="btn btn-link text-white" onClick={() => navigate('/login')}>Login</button></li>
                    <li><button className="btn btn-link text-white" onClick={() => navigate('/register')}>Register</button></li>
                  </>
                )}
                {userId && (
                  <>
                    <li><button className="btn btn-link text-white" onClick={() => navigate('/dashboard')}>Dashboard</button></li>
                    {role === 'employer' && (
                      <>
                        <li><button className="btn btn-link text-white" onClick={() => navigate('/post-job')}>Post Job</button></li>
                        <li><button className="btn btn-link text-white" onClick={() => navigate('/applications')}>View Applications</button></li>
                      </>
                    )}
                    <li><button className="btn btn-link text-danger" onClick={handleLogout}>Logout</button></li>
                  </>
                )}
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Contact</h6>
              <p>Email: support@jobxcel.com</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>
          <hr className="bg-white" />
          <p className="text-center mb-0">&copy; 2025 JobXcel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
