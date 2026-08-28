import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <div className="auth-logo"><ShieldCheck size={30}/></div><h1>GS Ready</h1><p>கிராம சேவகர் Interview Preparation</p>
    {error && <div className="alert error">{error}</div>}
    <label>Email<input type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></label>
    <label>Password<input type="password" required value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/></label>
    <button className="btn primary wide" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
    <small>New user? <Link to="/register">Create account</Link></small>
  </form></div>;
}
