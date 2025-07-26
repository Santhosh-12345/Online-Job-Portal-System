// src/pages/PostJob.jsx
import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import Header from "../components/Header";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    salary: "",
    description: "",
    skills: "",
    category: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/job-portal/backend/employer/postjob.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (result.success) {
      setSuccess(true);
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-Time",
        salary: "",
        description: "",
        skills: "",
        category: "",
      });
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <div className="container py-5">
        <Card>
          <Card.Header>
            <h4 className="m-0">Post a New Job</h4>
          </Card.Header>
          <Card.Body>
            {success && <Alert variant="success">Job posted successfully!</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Job Title</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control name="company" value={formData.company} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control name="location" value={formData.location} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Job Type</Form.Label>
                <Form.Select name="type" value={formData.type} onChange={handleChange}>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control name="salary" value={formData.salary} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Job Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Skills (comma-separated)</Form.Label>
                <Form.Control name="skills" value={formData.skills} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control name="category" value={formData.category} onChange={handleChange} />
              </Form.Group>
              <Button type="submit" variant="primary">
                Submit Job
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
