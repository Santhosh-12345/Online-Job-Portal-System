import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || role !== "jobseeker") {
      alert("Unauthorized access. Please login as Job Seeker.");
      navigate("/login");
      return;
    }

    const fetchJobSeekerData = async () => {
      try {
        const res = await fetch("http://localhost/job-portal/backend/jobseeker/dashboard.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user || null);
          setAppliedJobs(data.appliedJobs || []);
        } else {
          alert("Failed to load dashboard data.");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobSeekerData();
  }, [userId, role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  if (isLoading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name || "User"}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>

      <h4 className="mt-4">🧾 Jobs You've Applied To</h4>
      <ul className="list-group">
        {appliedJobs.length === 0 ? (
          <li className="list-group-item">No applications yet.</li>
        ) : (
          appliedJobs.map((job, index) => (
            <li key={index} className="list-group-item">
              <strong>{job.title}</strong> — Status: <em>{job.status}</em>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
