'use client';
import { useEffect, useState } from 'react';
export default function Page(){
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState<any>({name:'',sku:'',price_pence:0,stock:0,visible:true});
  async function load(){ const r=await fetch('/api/admin/products'); const j=await r.json(); setItems(j.products||[]); }
  useEffect(()=>{ load(); },[]);
  async function create(){
    const r = await fetch('/api/admin/products', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if (r.ok) { setForm({name:'',sku:'',price_pence:0,stock:0,visible:true}); load(); }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin • Products</h1>
      <div className="grid md:grid-cols-4 gap-2">
        <input className="border rounded-xl p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="border rounded-xl p-2" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
        <input className="border rounded-xl p-2" placeholder="Price (pence)" type="number" value={form.price_pence} onChange={e=>setForm({...form,price_pence:parseInt(e.target.value||'0')})}/>
        <input className="border rounded-xl p-2" placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value||'0')})}/>
        <button className="rounded-xl py-2 px-4 bg-blue-400 text-white md:col-span-4" onClick={create}>Create product</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Visible</th></tr></thead>
        <tbody>
          {items.map((p:any)=>(
            <tr key={p.id} className="border-t">
              <td className="py-2">{p.name}</td>
              <td className="text-center">{p.sku}</td>
              <td className="text-center">£{(p.price_pence/100).toFixed(2)}</td>
              <td className="text-center">{p.stock}</td>
              <td className="text-center">{p.visible? 'Yes':'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
