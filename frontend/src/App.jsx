import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Redirect root to add-user.html */}
        <Route path="/" element={<Navigate to="/add-user.html" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
