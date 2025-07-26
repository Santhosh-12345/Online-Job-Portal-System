import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isEmployer = user?.role === "employer";

  return (
    <header className="bg-light py-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <h3>
          <Link to="/" className="text-dark text-decoration-none">JobPortal</Link>
        </h3>

        <nav className="d-none d-md-flex gap-4 align-items-center">
          <Link to="/" className="text-dark text-decoration-none">Home</Link>
          <Link to="/jobs" className="text-dark text-decoration-none">Browse Jobs</Link>
          {user && <Link to="/dashboard" className="text-dark text-decoration-none">Dashboard</Link>}
          {isEmployer && (
            <>
              <Link to="/post-job" className="text-dark text-decoration-none">Post Job</Link>
              <Link to="/received-applications" className="text-dark text-decoration-none">Received Applications</Link>
            </>
          )}
        </nav>

        <div className="d-none d-md-block">
          {user ? (
            <>
              <span className="me-3">Welcome, {user.full_name}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2 btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="d-md-none">
          <button className="btn btn-outline-dark btn-sm" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="bg-light border-top d-md-none p-3">
          <Link to="/" className="d-block text-dark text-decoration-none mb-2">Home</Link>
          <Link to="/jobs" className="d-block text-dark text-decoration-none mb-2">Browse Jobs</Link>
          {user && <Link to="/dashboard" className="d-block text-dark text-decoration-none mb-2">Dashboard</Link>}
          {isEmployer && (
            <>
              <Link to="/post-job" className="d-block text-dark text-decoration-none mb-2">Post Job</Link>
              <Link to="/received-applications" className="d-block text-dark text-decoration-none mb-2">Received Applications</Link>
            </>
          )}
          {user ? (
            <>
              <span className="d-block mb-2">Hello, {user.full_name}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm w-100 mb-2">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm w-100">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
