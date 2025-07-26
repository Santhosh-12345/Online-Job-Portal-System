import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Briefcase } from "lucide-react";
import Header from "./Header";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      alert("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    fetch("http://localhost/job-portal/backend/auth/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.status === "success") {
          const user = data.user;

          // Store user info in localStorage
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userName", user.full_name);
          localStorage.setItem("userRole", user.role);

          if (user.role === "employer") {
            navigate("/EmployeeDashboard");
          } else {
            navigate("/Dashboard");
          }
        } else {
          alert(data.message || "Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
        setIsLoading(false);
      });
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
              <CardTitle className="h4">Welcome Back</CardTitle>
              <p className="text-muted">
                Sign in to your <strong>JobXcel</strong> account
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3 row align-items-center">
                  <label htmlFor="email" className="col-sm-3 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-9">
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3 row align-items-center">
                  <label htmlFor="password" className="col-sm-3 col-form-label">
                    Password
                  </label>
                  <div className="col-sm-9">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
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

                {/* Forgot password */}
                <div className="mb-3 text-end">
                  <Link to="/forgot-password" className="text-decoration-none text-primary small">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <div className="mb-3">
                  <Button
                    type="submit"
                    className="w-100 btn btn-primary btn-lg px-5 py-2 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>

                <div className="text-center">
                  <p>
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-primary">
                      Sign up here
                    </Link>
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

export default Login;
