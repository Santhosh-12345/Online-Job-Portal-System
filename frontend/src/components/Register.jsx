import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Briefcase } from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Register = () => {
  const [userType, setUserType] = useState("jobseeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName || !email || !password) {
      alert("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost/job-portal/backend/auth/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          fullName,
          email,
          password,
          role: userType, // ✅ use "role" instead of "userType"
        }),

      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        navigate(userType === "employer" ? "/employer-dashboard" : "/dashboard");
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      alert("Server error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Header />
      <div className="container py-5">
        <div className="mx-auto" style={{ maxWidth: "520px" }}>
          <Card>
            <CardHeader className="text-center">
              <div className="d-flex justify-content-center mb-3">
                <div className="bg-primary p-3 rounded-circle">
                  <Briefcase className="text-white" />
                </div>
              </div>
              <CardTitle className="h4">Create Your Account</CardTitle>
              <p className="text-muted">Join as Job Seeker or Employer</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister}>
                {/* Full Name */}
                <div className="mb-3 row align-items-center">
                  <label htmlFor="fullName" className="col-sm-3 col-form-label">Full Name</label>
                  <div className="col-sm-9">
                    <Input
                      type="text"
                      id="fullName"
                      placeholder="Enter your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3 row align-items-center">
                  <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                  <div className="col-sm-9">
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3 row align-items-center">
                  <label htmlFor="password" className="col-sm-3 col-form-label">Password</label>
                  <div className="col-sm-9">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Type */}
                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">User Type</label>
                  <div className="col-sm-9 d-flex gap-4 align-items-center">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="jobseeker"
                        name="userType"
                        value="jobseeker"
                        checked={userType === "jobseeker"}
                        onChange={() => setUserType("jobseeker")}
                      />
                      <label className="form-check-label" htmlFor="jobseeker">Job Seeker</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="employer"
                        name="userType"
                        value="employer"
                        checked={userType === "employer"}
                        onChange={() => setUserType("employer")}
                      />
                      <label className="form-check-label" htmlFor="employer">Employer</label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-3">
                  <Button
                    type="submit"
                    className="w-100 btn btn-primary btn-lg px-5 py-2 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </div>

                <div className="text-center">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">Sign in here</Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
