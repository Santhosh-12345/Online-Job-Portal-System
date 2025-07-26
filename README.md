# Job Portal System

A full-stack Job Portal web application where jobseekers can view and apply for jobs, and employers can post job listings. It includes registration, login, dashboard, job listings, and job application features.


### Features
- Clean and responsive UI using Bootstrap
- Role-based access (Employer / Jobseeker)
- Real-time feedback on actions (login errors, application success, etc.)

### Authentication
- Register and Login pages for both Jobseekers and Employers
- Session-based authentication with persistent login
- Input validation on both frontend and backend

### Jobseeker Features
- View all available job postings
- Apply to a job with a single click
- Prevents duplicate applications
- Displays all jobs sorted by latest date
- Personalized dashboard showing applied jobs

### Employer Features
- Post new job listings with title, description, company, and location
- View all posted jobs
- Delete or manage jobs

### Database
- Stores users, jobs, and applications
- Maintains relations between applicants and job posts
- Uses secure PDO-based MySQL queries

## Tech Stack

### Frontend
- React.js
- React Router for page navigation
- Bootstrap for styling
- Axios or Fetch API for API communication

### Backend
- PHP (REST API structure)
- MySQL (job_portal database)
- PDO (PHP Data Objects) for DB interaction
- Secure CORS and error handling

