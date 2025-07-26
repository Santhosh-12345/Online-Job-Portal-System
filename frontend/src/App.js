import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Login from "./components/Login";
import Register from "./components/Register";
import PostJob from "./components/PostJob";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Logout from "./components/Logout";

const queryClient = new QueryClient();

const PrivateRoute = ({ children, allowedRoles }) => {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/register"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />

            {/* Employer Routes */}
            <Route
              path="/post-job"
              element={
                <PrivateRoute allowedRoles={['employer']}>
                  <PostJob />
                </PrivateRoute>
              }
            />
            <Route
              path="/employer-dashboard"
              element={
                <PrivateRoute allowedRoles={['employer']}>
                  <EmployeeDashboard />
                </PrivateRoute>
              }
            />

            {/* Job Seeker Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['jobseeker']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;