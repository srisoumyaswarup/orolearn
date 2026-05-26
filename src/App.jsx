import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Onboarding from './Pages/Onboarding';
import StudentSetup from './Pages/StudentSetup';
import EducatorSetup from './Pages/EducatorSetup';
import Dashboard from './Pages/Dashboard';
import EducatorDashboard from './Pages/EducatorDashboard';
import Home from './Pages/Home';
import Feed from './Pages/Feed';

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