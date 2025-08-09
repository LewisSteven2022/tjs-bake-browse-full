'use client';
import { useEffect, useState } from 'react';
export default function DateTimePicker({ onChange }:{ onChange: (date:string, time:string)=>void }){
  const [slots,setSlots] = useState<{date:string, times:string[]}[]>([]);
  const [date,setDate] = useState('');
  const [time,setTime] = useState('');
  useEffect(()=>{ fetch('/api/slots').then(r=>r.json()).then(j=>setSlots(j.slots)); },[]);
  useEffect(()=>{ if (date && time) onChange(date,time); },[date,time]);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label><span className="text-sm">Collection date</span>
        <select className="w-full border rounded-xl p-2" value={date} onChange={e=>{setDate(e.target.value); setTime('');}}>
          <option value="">Select date</option>
          {slots.map(s=> <option key={s.date} value={s.date}>{s.date}</option>)}
        </select>
      </label>
      <label><span className="text-sm">Time</span>
        <select className="w-full border rounded-xl p-2" value={time} onChange={e=>setTime(e.target.value)} disabled={!date}>
          <option value="">Select time</option>
          {slots.find(s=>s.date===date)?.times.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
    </div>
  );
}
