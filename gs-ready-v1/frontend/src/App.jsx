import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Interview from './pages/Interview.jsx';
import Documents from './pages/Documents.jsx';
import Checklist from './pages/Checklist.jsx';
import Marks from './pages/Marks.jsx';
import Summary from './pages/Summary.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
