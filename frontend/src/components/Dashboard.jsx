import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    if (!userId || userRole !== "jobseeker") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost/job-portal/backend/jobseeker/dashboard.php?user_id=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token") // If using tokens
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Response is not JSON");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to load data");
        }

        setUserData(data.user);
        setJobs(data.appliedJobs || []);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message);
        if (error.message.includes("token") || error.message.includes("authenticate")) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {userData?.full_name || "User"}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="mb-4">
        <h4>Your Applications</h4>
        {jobs.length === 0 ? (
          <p>You haven't applied to any jobs yet.</p>
        ) : (
          <ul className="list-group">
            {jobs.map((job, index) => (
              <li key={index} className="list-group-item">
                <h5>{job.title}</h5>
                <p className="mb-1">{job.company} - {job.location}</p>
                <small className="text-muted">
                  Applied on: {new Date(job.applied_at).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;