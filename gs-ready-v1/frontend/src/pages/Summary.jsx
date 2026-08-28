import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Printer } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import ProgressRing from '../components/ProgressRing.jsx';

const names={leadership:'Leadership / Social',sports:'Sports',language:'Language',ict:'Computer / ICT',interview:'Interview Performance'};
export default function Summary(){
 const [d,setD]=useState(null); useEffect(()=>{api.get('/summary').then(r=>setD(r.data));},[]); if(!d)return <div className="page">Loading summary…</div>;
 return <div className="page summary-page"><PageHeader title="Interview Summary" subtitle="Final preparation overview" action={<button className="btn secondary no-print" onClick={()=>window.print()}><Printer size={17}/> Print / Save PDF</button>}/>
 <section className="card summary-hero"><ProgressRing value={d.readiness}/><div><h2>GS Interview Preparation</h2><p><b>Date:</b> {d.interview?.date||'Not set'} &nbsp; <b>Time:</b> {d.interview?.time||'Not set'}</p><p><b>Venue:</b> {d.interview?.venue||'Not set'}</p><p><b>DS:</b> {d.interview?.divisionalSecretariat||'Not set'}</p></div></section>
 <div className="two-col"><section className="card"><h2>Estimated Marks</h2><table className="simple-table"><tbody>{Object.entries(names).map(([k,n])=><tr key={k}><td>{n}</td><td>{d.marks.scores?.[k]?.score||0}</td></tr>)}<tr className="total"><td>Total</td><td>{d.marks.total} / {d.marks.maximum}</td></tr></tbody></table><p className="muted">Final marks are subject to official verification and the interview board.</p></section>
 <section className="card"><h2>Missing Required Items</h2>{d.checklist.missing.length?<ul className="missing-list">{d.checklist.missing.map(x=><li key={x}><AlertTriangle size={16}/>{x}</li>)}</ul>:<div className="empty"><CheckCircle2/>All required checklist items are marked ready.</div>}</section></div>
 </div>;
}
