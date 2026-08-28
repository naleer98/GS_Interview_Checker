import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

const empty = { date:'', time:'', venue:'', divisionalSecretariat:'', referenceNumber:'', notes:'' };
export default function Interview() {
  const [form,setForm] = useState(empty); const [msg,setMsg] = useState(''); const [busy,setBusy]=useState(false);
  useEffect(()=>{ api.get('/interview').then(r=>setForm({...empty,...r.data})); },[]);
  const save=async(e)=>{e.preventDefault();setBusy(true);setMsg('');try{const {data}=await api.put('/interview',form);setForm({...empty,...data});setMsg('Saved successfully ✅');}catch{setMsg('Could not save.');}finally{setBusy(false);}};
  return <div className="page"><PageHeader title="Interview Details" subtitle="நேரம், தேதி, இடம் மற்றும் reference details save pannunga."/>
    <form className="card form-card" onSubmit={save}>
      {msg&&<div className="alert success">{msg}</div>}
      <div className="form-grid">
        <label>Interview Date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
        <label>Interview Time<input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></label>
        <label>Venue / Room<input placeholder="e.g. AN/01" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}/></label>
        <label>Divisional Secretariat<input value={form.divisionalSecretariat} onChange={e=>setForm({...form,divisionalSecretariat:e.target.value})}/></label>
        <label className="full">Reference Number<input value={form.referenceNumber} onChange={e=>setForm({...form,referenceNumber:e.target.value})}/></label>
        <label className="full">Notes<textarea rows="4" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
      </div>
      <button className="btn primary" disabled={busy}><Save size={17}/>{busy?'Saving…':'Save Details'}</button>
    </form>
  </div>;
}
