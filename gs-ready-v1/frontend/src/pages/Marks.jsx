import React, { useEffect, useState } from 'react';
import { Save, Star } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

const names={leadership:'Leadership / Social Activities',sports:'Sports',language:'Language Ability',ict:'Computer / ICT',interview:'Interview Performance'};
export default function Marks(){
 const [limits,setLimits]=useState({}); const [scores,setScores]=useState({}); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false);
 useEffect(()=>{api.get('/marks').then(({data})=>{setLimits(data.limits);const s={};Object.keys(data.limits).forEach(k=>{s[k]=data.scores?.[k]||{score:0,confirmed:false,note:''};});setScores(s);});},[]);
 const update=(k,field,val)=>setScores({...scores,[k]:{...scores[k],[field]:val}});
 const total=Object.values(scores).reduce((a,x)=>a+(Number(x?.score)||0),0); const max=Object.values(limits).reduce((a,b)=>a+b,0);
 const save=async()=>{setBusy(true);setMsg('');try{const {data}=await api.put('/marks',scores);const s={};Object.keys(data.limits).forEach(k=>s[k]=data.scores[k]);setScores(s);setMsg('Estimated marks saved ✅');}catch{setMsg('Could not save marks.');}finally{setBusy(false);}};
 return <div className="page"><PageHeader title="Estimated Marks" subtitle="Official marking scheme categories அடிப்படையில் evidence score record pannunga."/>
 <div className="alert info">⚠️ இது preparation estimate மட்டும். Final marks official interview board தான் decide pannuvanga.</div>
 <div className="marks-total"><Star/><div><span>Current Estimated Total</span><strong>{total} / {max}</strong></div></div>
 <div className="marks-grid">{Object.keys(limits).map(k=><section className="card mark-card" key={k}><div className="mark-head"><div><h2>{names[k]}</h2><small>Maximum {limits[k]} marks</small></div><div className="score-input"><input type="number" min="0" max={limits[k]} step="1" value={scores[k]?.score??0} onChange={e=>update(k,'score',Math.min(limits[k],Math.max(0,Number(e.target.value))))}/><span>/{limits[k]}</span></div></div>
 <label className="check confirm"><input type="checkbox" checked={scores[k]?.confirmed||false} onChange={e=>update(k,'confirmed',e.target.checked)}/> Evidence checked / qualification confirmed</label>
 <label>Evidence / note<textarea rows="2" placeholder="e.g. Diploma in ICT, original available" value={scores[k]?.note||''} onChange={e=>update(k,'note',e.target.value)}/></label></section>)}</div>
 {msg&&<div className="alert success">{msg}</div>}<button className="btn primary" onClick={save} disabled={busy}><Save size={17}/>{busy?'Saving…':'Save Estimated Marks'}</button>
 </div>;
}
