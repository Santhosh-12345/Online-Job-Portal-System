import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Briefcase, Search, Filter } from 'lucide-react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Internship', 'Contract'];
const CATEGORIES = ['Technology', 'Design', 'Management', 'Marketing', 'Data Science', 'Sales'];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs once
  useEffect(() => {
    fetch("http://localhost/job-portal/backend/employer/get-jobs.php")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch jobs.");
        return res.json();
      })
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load job listings. Try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Apply filters whenever inputs change
  useEffect(() => {
    let filtered = [...jobs];

    if (searchTerm.trim()) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.toLowerCase().split(',').some(skill => skill.includes(searchTerm.toLowerCase()))
      );
    }

    if (location.trim()) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (jobType) {
      filtered = filtered.filter(job => job.type === jobType);
    }

    if (category) {
      filtered = filtered.filter(job => job.category === category);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, location, jobType, category, jobs]);

  const handleJobView = id => navigate(`/job/${id}`);

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobType("");
    setCategory("");
  };

  return (
    <div className="bg-light min-vh-100">

      <div className="container py-5">
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center gap-2">
            <Search size={20} />
            <h5 className="m-0">Find Your Perfect Job</h5>
          </Card.Header>
          <Card.Body>
            <Form className="row g-3">
              <div className="col-md-3">
                <Form.Control
                  type="text"
                  placeholder="Job title or keywords"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <Form.Control
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <Form.Select value={jobType} onChange={e => setJobType(e.target.value)}>
                  <option value="">Job Type</option>
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-2">
                <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-2 d-flex gap-2">
                <Button variant="outline-secondary" onClick={clearFilters}>
                  <Filter size={16} /> Clear
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <div className="row">
          <div className="col-lg-3 mb-4">
            <Card className="sticky-top" style={{ top: '1rem' }}>
              <Card.Body>
                <p className="mb-1 text-muted">Total Results</p>
                <h4 className="fw-bold">{filteredJobs.length}</h4>
                {(searchTerm || location || jobType || category) && (
                  <>
                    <p className="mt-3 mb-1 text-muted">Active Filters:</p>
                    <div className="d-flex flex-wrap gap-1">
                      {searchTerm && <Badge bg="secondary">Search: {searchTerm}</Badge>}
                      {location && <Badge bg="secondary">Location: {location}</Badge>}
                      {jobType && <Badge bg="secondary">Type: {jobType}</Badge>}
                      {category && <Badge bg="secondary">Category: {category}</Badge>}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>

          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading jobs...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : filteredJobs.length > 0 ? (
              <div className="row g-3">
                {filteredJobs.map(job => (
                  <div key={job.id} className="col-md-6">
                    <JobCard
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      location={job.location}
                      type={job.type}
                      salary={job.salary}
                      description={job.description}
                      postedDate={job.postedDate}
                      onViewDetails={handleJobView}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-5">
                <Briefcase size={48} className="text-muted mb-3" />
                <h5>No jobs found</h5>
                <p className="text-muted mb-3">
                  Try adjusting your filters to find more jobs.
                </p>
                <Button onClick={clearFilters}>Reset Filters</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
