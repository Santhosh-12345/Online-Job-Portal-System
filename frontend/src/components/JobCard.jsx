import React, { useState } from "react";
import { MapPin, Clock, Building, Heart } from "lucide-react";

const JobCard = ({
  id,
  title,
  company,
  location,
  type,
  salary,
  description,
  postedDate,
  onViewDetails,
  showApply = false, // 🆕 control whether to show Apply button
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // You can add saving logic here (e.g., API call)
  };

  const handleApply = (e) => {
    e.stopPropagation();
    alert(`Applied to job ID: ${id}`); // Placeholder
  };

  return (
    <div
      className="card p-3 mb-4 shadow-sm border hover-shadow transition"
      onClick={() => onViewDetails(id)}
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 className="fw-bold mb-1">{title}</h5>
          <div className="text-muted d-flex align-items-center">
            <Building size={16} className="me-2" />
            <span>{company}</span>
          </div>
        </div>
        <button
          className="btn btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        >
          <Heart size={20} className={isSaved ? "text-danger fill-danger" : "text-muted"} />
        </button>
      </div>

      <div className="mb-3">
        <div className="d-flex flex-wrap gap-3 mb-2 text-muted small">
          <div className="d-flex align-items-center">
            <MapPin size={14} className="me-1" />
            {location}
          </div>
          <div className="d-flex align-items-center">
            <Clock size={14} className="me-1" />
            {postedDate}
          </div>
          <span className="badge bg-secondary">{type}</span>
          {salary && <span className="badge border border-secondary text-secondary">{salary}</span>}
        </div>
        <p className="text-muted" style={{ lineHeight: "1.5", maxHeight: "4.5em", overflow: "hidden" }}>
          {description}
        </p>
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-primary w-100"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(id);
          }}
        >
          View Details
        </button>

        {showApply && (
          <button
            className="btn btn-success w-100"
            onClick={handleApply}
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
