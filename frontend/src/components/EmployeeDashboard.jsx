import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Alert, 
  Spinner, 
  Button,
  Badge,
  Modal,
  Form,
  FormControl,
  FloatingLabel
} from 'react-bootstrap';
import { 
  FiRefreshCw, 
  FiPlusCircle, 
  FiLogOut,
  FiTrash2,
  FiAlertCircle,
  FiExternalLink
} from 'react-icons/fi';

const API_BASE_URL = 'http://localhost/job-portal/backend';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    skills: '',
    category: 'IT'
  });
  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/employer/employer_dashboard.php?user_id=${userId}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Request failed");

      setDashboardData(result);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Handle job form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new job
  const handleJobSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${API_BASE_URL}/employer/post_job.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        user_id: localStorage.getItem('userId'),
        skills: formData.skills.split(',').map(skill => skill.trim()),
      }),
      credentials: 'include'
    });

    // First check if response is OK (status 200-299)
    if (!response.ok) {
      // Try to get error details from response
      let errorData;
      try {
        errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
      } catch (e) {
        // If JSON parsing fails, get the raw text
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
      }
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || result.message || "Posting failed");
    }

    setShowJobForm(false);
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      skills: '',
      category: 'IT'
    });
    fetchDashboardData();
  } catch (err) {
    console.error('Post job error:', err);
    setError(err.message);
  }
};

  // Delete job
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/employer/delete_job.php?job_id=${jobToDelete}`,
        { method: 'DELETE', credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to delete job');
      fetchDashboardData();
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Loading Employer Dashboard</h5>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="shadow">
          <Alert.Heading><FiAlertCircle className="me-2" />Error</Alert.Heading>
          <div className="mb-3">{error}</div>
          <Button variant="primary" onClick={fetchDashboardData}>
            <FiRefreshCw className="me-2" />Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this job posting?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteJob}>Delete Job</Button>
        </Modal.Footer>
      </Modal>

      {/* Job Posting Modal */}
      <Modal show={showJobForm} onHide={() => setShowJobForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Post New Job</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleJobSubmit}>
          <Modal.Body>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <FloatingLabel controlId="title" label="Job Title">
                  <FormControl
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="company" label="Company">
                  <FormControl
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>
            
            <Row className="g-3 mb-3">
              <Col md={6}>
                <FloatingLabel controlId="location" label="Location">
                  <FormControl
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="type" label="Job Type">
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            
            <Row className="g-3 mb-3">
              <Col md={6}>
                <FloatingLabel controlId="salary" label="Salary">
                  <FormControl
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="category" label="Category">
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            
            <FloatingLabel controlId="skills" label="Skills (comma separated)" className="mb-3">
              <FormControl
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="JavaScript, PHP, React, etc."
                required
              />
            </FloatingLabel>
            
            <FloatingLabel controlId="description" label="Job Description">
              <FormControl
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{ height: '150px' }}
                required
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowJobForm(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Post Job</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Dashboard Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold mb-1">Employer Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Manage your job postings</p>
        </Col>
        <Col className="d-flex justify-content-end gap-2">
          <Button variant="outline-danger" onClick={handleLogout}>
            <FiLogOut className="me-2" /> Logout
          </Button>
          <Button variant="primary" onClick={() => setShowJobForm(true)}>
            <FiPlusCircle className="me-2" /> Post New Job
          </Button>
        </Col>
      </Row>

      {/* Job Postings Section */}
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">Your Job Postings</Card.Title>
          <Button variant="outline-primary" size="sm" onClick={fetchDashboardData}>
            <FiRefreshCw size={14} />
          </Button>
        </Card.Header>
        <Card.Body>
          {dashboardData?.jobs?.length > 0 ? (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.jobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td><Badge bg="info">{job.type}</Badge></td>
                    <td><Badge bg="secondary">{job.category}</Badge></td>
                    <td className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setJobToDelete(job.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              <p className="mb-2">You haven't posted any jobs yet.</p>
              <Button variant="primary" size="sm" onClick={() => setShowJobForm(true)}>
                <FiPlusCircle className="me-1" /> Create your first job posting
              </Button>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployeeDashboard;