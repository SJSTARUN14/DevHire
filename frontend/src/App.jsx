import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import JobApplicants from './pages/JobApplicants';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import Recruiters from './pages/Recruiters';
import Analytics from './pages/Analytics';
import DashboardLayout from './layouts/DashboardLayout';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/applicants" element={<JobApplicants />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recruiters" element={<Recruiters />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
