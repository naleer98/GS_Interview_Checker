import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Checklist(){
 const [items,setItems]=useState([]); const [title,setTitle]=useState('');
 const load=()=>api.get('/checklist').then(r=>setItems(r.data)); useEffect(load,[]);
 const groups=useMemo(()=>Object.entries(items.reduce((a,x)=>{(a[x.category]??=[]).push(x);return a;},{})),[items]);
 const toggle=async(item)=>{const {data}=await api.patch(`/checklist/${item._id}`,{completed:!item.completed});setItems(items.map(x=>x._id===data._id?data:x));};
 const add=async(e)=>{e.preventDefault();if(!title.trim())return;await api.post('/checklist',{title,category:'Other',required:false});setTitle('');load();};
 const required=items.filter(x=>x.required); const done=required.filter(x=>x.completed).length; const pct=required.length?Math.round(done/required.length*100):0;
 return <div className="page"><PageHeader title="Interview Checklist" subtitle="Required originals/copies ready-a இருக்கிறதா என்று mark pannunga."/>
 <div className="card checklist-score"><div><strong>{done}/{required.length}</strong><span>Required items ready</span></div><div className="bar big"><i style={{width:`${pct}%`}}/></div><b>{pct}%</b></div>
 <div className="check-groups">{groups.map(([group,list])=><section className="card" key={group}><div className="card-title"><h2>{group}</h2></div>{list.map(item=><label className={`check-item ${item.completed?'done':''}`} key={item._id}><input type="checkbox" checked={item.completed} onChange={()=>toggle(item)}/><span className="check-box"><CheckCircle2/></span><div><b>{item.title}</b><small>{item.required?'Required':'Optional / if applicable'}</small></div></label>)}</section>)}</div>
 <form className="card add-inline" onSubmit={add}><div><h3>Add custom reminder</h3><p>உங்களுக்கு extra document இருந்தால் add pannalaam.</p></div><div><input placeholder="e.g. Passport copy" value={title} onChange={e=>setTitle(e.target.value)}/><button className="btn secondary"><Plus size={17}/>Add</button></div></form>
 </div>;
}
