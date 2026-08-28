import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
export default function Profile(){const {user,logout}=useAuth();const nav=useNavigate();const out=()=>{logout();nav('/login');};return <div className="page"><PageHeader title="Profile" subtitle="Account & privacy"/><section className="card profile-card"><div className="avatar">{user?.name?.[0]?.toUpperCase()||'U'}</div><div><h2>{user?.name}</h2><p>{user?.email}</p></div></section><section className="card privacy"><ShieldCheck/><div><h3>Privacy note</h3><p>Certificates and identity files are sensitive. Use a strong password and delete documents after they are no longer needed.</p></div></section><button className="btn danger-btn" onClick={out}><LogOut size={17}/>Logout</button></div>}
