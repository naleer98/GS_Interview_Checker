import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await register(form.name, form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <div className="auth-logo"><UserPlus size={30}/></div><h1>Create account</h1><p>Start your interview preparation</p>
    {error && <div className="alert error">{error}</div>}
    <label>Name<input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/></label>
    <label>Email<input type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></label>
    <label>Password<input type="password" minLength="6" required value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/></label>
    <button className="btn primary wide" disabled={busy}>{busy ? 'Creating…' : 'Create Account'}</button>
    <small>Already registered? <Link to="/login">Login</Link></small>
  </form></div>;
}
