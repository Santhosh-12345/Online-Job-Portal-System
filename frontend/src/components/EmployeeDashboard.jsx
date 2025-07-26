import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    skills: "",
    category: "",
  });

  const categoryOptions = [
    "IT",
    "Finance",
    "Healthcare",
    "Education",
    "Engineering",
    "Marketing",
    "Legal",
    "Hospitality",
  ];

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (!userId || role !== "employer") {
      alert("Unauthorized access. Please login as Employer.");
      navigate("/login");
      return;
    }

    const fetchEmployerData = async () => {
      try {
        const res = await fetch("http://localhost/job-portal/backend/employer/dashboard.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        if (data.success) {
          setPostedJobs(data.postedJobs || []);
          setApplications(data.applications || []);
          setUser(data.user || null);
        } else {
          alert("Failed to load employer data.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong while loading the dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployerData();
  }, [userId, role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/job-portal/backend/employer/post_job.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newJob, posted_by: userId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Job posted successfully!");
        setShowPostForm(false);
        setNewJob({
          title: "",
          company: "",
          location: "",
          type: "",
          salary: "",
          description: "",
          skills: "",
          category: "",
        });
        window.location.reload();
      } else {
        alert("Failed to post job.");
      }
    } catch (error) {
      console.error("Post Job Error:", error);
      alert("Error posting job.");
    }
  };

  if (isLoading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employer Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="mb-4">
        <button className="btn btn-primary" onClick={() => setShowPostForm(!showPostForm)}>
          {showPostForm ? "Cancel" : "➕ Post a New Job"}
        </button>
      </div>

      {showPostForm && (
        <form className="mb-4" onSubmit={handlePostJob}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input type="text" className="form-control" name="title" placeholder="Job Title" value={newJob.title} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" className="form-control" name="company" placeholder="Company Name" value={newJob.company} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" className="form-control" name="location" placeholder="Location" value={newJob.location} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" className="form-control" name="type" placeholder="Job Type (e.g., Full-time, Part-time)" value={newJob.type} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <input type="number" className="form-control" name="salary" placeholder="Salary" value={newJob.salary} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <select className="form-control" name="category" value={newJob.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {categoryOptions.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-12 mb-2">
              <textarea className="form-control" name="description" placeholder="Job Description" rows="3" value={newJob.description} onChange={handleInputChange} required />
            </div>
            <div className="col-12 mb-2">
              <input type="text" className="form-control" name="skills" placeholder="Required Skills (comma-separated)" value={newJob.skills} onChange={handleInputChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2">Post Job</button>
        </form>
      )}

      <h4>📋 Your Posted Jobs</h4>
      <ul className="list-group mb-4">
        {postedJobs.length === 0 ? (
          <li className="list-group-item">You haven't posted any jobs yet.</li>
        ) : (
          postedJobs.map((job, index) => (
            <li key={index} className="list-group-item">
              <strong>{job.title}</strong> — {job.location} | {job.category} | ₹{job.salary}
            </li>
          ))
        )}
      </ul>

      <h4>📨 Applications Received</h4>
      <ul className="list-group">
        {applications.length === 0 ? (
          <li className="list-group-item">No applications received yet.</li>
        ) : (
          applications.map((app, index) => (
            <li key={index} className="list-group-item">
              <strong>{app.applicant_name}</strong> applied for <strong>{app.title}</strong> — Status: <em>{app.status}</em>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EmployeeDashboard;
