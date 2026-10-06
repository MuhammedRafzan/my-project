import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.access_token);
        navigate('/admin');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-slate-700">Username</label>
          <input className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
          <input className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Login</button>
      </form>
    </div>
  );
}
