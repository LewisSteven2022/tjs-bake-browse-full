'use client';
import { useState } from 'react';
import DateTimePicker from '@/components/DateTimePicker';
export default function CheckoutPage(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [mobile,setMobile]=useState('');
  const [bag,setBag]=useState(false);
  const [date,setDate]=useState('');
  const [time,setTime]=useState('');
  const [status,setStatus]=useState<string>('');
  async function submit(){
    setStatus('');
    const items = JSON.parse(localStorage.getItem('basket_v1')||'[]');
    if (!items.length) { setStatus('Your basket is empty.'); return; }
    const res = await fetch('/api/orders', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ items, pickup_date: date, pickup_time: time, bag_opt_in: bag, email, name, mobile })
    });
    const j = await res.json();
    if (!res.ok) { setStatus(j.error || 'Failed to place order'); return; }
    setStatus('Order placed successfully!');
    localStorage.removeItem('basket_v1');
  }
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="grid gap-3">
        <label><span className="text-sm">Name</span><input className="w-full border rounded-xl p-2" value={name} onChange={e=>setName(e.target.value)} /></label>
        <label><span className="text-sm">Email</span><input className="w-full border rounded-xl p-2" value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label><span className="text-sm">Mobile</span><input className="w-full border rounded-xl p-2" value={mobile} onChange={e=>setMobile(e.target.value)} /></label>
      </div>
      <DateTimePicker onChange={(d,t)=>{setDate(d); setTime(t);}} />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={bag} onChange={e=>setBag(e.target.checked)} /> Add a shopping bag (£0.70)
      </label>
      <button className="rounded-xl py-2 px-4 bg-blue-400 text-white" onClick={submit} disabled={!date||!time}>Place order</button>
      {status && <p className="text-sm">{status}</p>}
      <p className="text-xs text-gray-600">Our kitchen is gluten-free but may handle other allergens.</p>
    </div>
  );
}
