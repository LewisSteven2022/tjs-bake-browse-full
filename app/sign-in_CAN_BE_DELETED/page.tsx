'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setErr('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.ok) router.push('/');
    else setErr('Invalid credentials');
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Email</span>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-xl p-2" type="email" required />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-xl p-2" type="password" required />
        </label>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full rounded-xl py-2 bg-blue-400 text-white">Sign in</button>
      </form>
    </div>
  );
}
