import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CalendarDays, CheckCircle2, FileText, FolderOpen, Star } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressRing from '../components/ProgressRing.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/summary').then(r=>setData(r.data)).catch(()=>setError('Could not load dashboard.')); }, []);
  if (!data) return <div className="page">{error || 'Loading dashboard…'}</div>;

  const status = data.readiness >= 90 ? 'Ready' : data.readiness >= 75 ? 'Almost Ready' : data.readiness >= 50 ? 'Needs Attention' : 'Not Ready';
  return <div className="page">
    <div className="hero">
      <div><span className="eyebrow">WELCOME BACK</span><h1>{user?.name} 👋</h1><p>உங்கள் GS interview preparation status.</p></div>
      <ProgressRing value={data.readiness}/>
    </div>

    <div className={`status-banner ${data.readiness >= 75 ? 'good' : 'warn'}`}><CheckCircle2 size={19}/><b>{status}</b><span>Complete missing items before the interview.</span></div>

    <div className="stats-grid">
      <Link className="stat-card" to="/interview"><CalendarDays/><div><small>Interview</small><strong>{data.interview?.date || 'Add date'}</strong><span>{data.interview?.time || 'Time not set'}</span></div></Link>
      <Link className="stat-card" to="/documents"><FolderOpen/><div><small>Documents</small><strong>{data.documentsCount}</strong><span>Uploaded files</span></div></Link>
      <Link className="stat-card" to="/checklist"><CheckCircle2/><div><small>Checklist</small><strong>{data.checklist.completedRequired}/{data.checklist.requiredTotal}</strong><span>Required ready</span></div></Link>
      <Link className="stat-card" to="/marks"><Star/><div><small>Estimated Marks</small><strong>{data.marks.total}/{data.marks.maximum}</strong><span>Official board decides final</span></div></Link>
    </div>

    <div className="two-col">
      <section className="card"><div className="card-title"><h2>Readiness Breakdown</h2></div>
        {Object.entries(data.breakdown).map(([key,val]) => <div className="progress-row" key={key}><div><span>{label(key)}</span><b>{val}%</b></div><div className="bar"><i style={{width:`${val}%`}}/></div></div>)}
      </section>
      <section className="card"><div className="card-title"><h2><AlertTriangle size={19}/> Needs Attention</h2></div>
        {data.checklist.missing.length ? <ul className="missing-list">{data.checklist.missing.slice(0,5).map(x=><li key={x}><AlertTriangle size={16}/>{x}</li>)}</ul> : <div className="empty"><CheckCircle2/>No required checklist items missing.</div>}
        <Link className="btn secondary wide" to="/summary"><FileText size={17}/> View Interview Summary</Link>
      </section>
    </div>
  </div>;
}

function label(key) {
  return ({ documents:'Required documents', interviewDetails:'Interview details', qualifications:'Qualification confirmation', verification:'Original + copy verification' })[key] || key;
}
