import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import StudentSetup from './pages/StudentSetup';
import EducatorSetup from './pages/EducatorSetup';
import Dashboard from './pages/Dashboard';
import EducatorDashboard from './pages/EducatorDashboard';
import Home from './pages/Home';
import Feed from './pages/Feed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/student-setup" element={<StudentSetup />} />
        <Route path="/educator-setup" element={<EducatorSetup />} />
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route path="/educator-dashboard" element={<EducatorDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;