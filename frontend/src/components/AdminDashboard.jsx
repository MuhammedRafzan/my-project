import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/admin/responses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
          return;
        }
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(`http://localhost:8000${url}`, { headers: { 'Authorization': `Bearer ${token}` }});
      if (!res.ok) { alert("Download failed"); return; }
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-xl font-medium text-slate-500 flex items-center gap-3">
        <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Loading Dashboard...
      </div>
    </div>
  );

  const filteredData = data.filter(d => {
    if (categoryFilter !== 'All' && !d['Q1. Which category best describes you?']?.includes(categoryFilter)) return false;
    return true;
  });

  const totalResponses = filteredData.length;
  
  const calcAvg = (key) => {
    const valid = filteredData.map(d => d[key]).filter(v => v !== null && !isNaN(v));
    return valid.length ? (valid.reduce((a,b)=>a+Number(b),0)/valid.length).toFixed(1) : 'N/A';
  };

  const q20Key = "Q20. How useful would a system like CredenSync be for you?";
  const q25Key = "Q25. Would you use a system like CredenSync if it were available?";
  const q10Key = "Q10. How concerned are you about identity theft or misuse of personal information from uploaded credentials?";
  const q14Key = "Q14. Have you ever encountered or suspected a forged, manipulated, or invalid certificate?";
  
  const avgUsefulness = calcAvg(q20Key);
  const avgIdentityConcern = calcAvg(q10Key);
  
  const wouldUse = filteredData.filter(d => ['Definitely yes', 'Probably yes'].includes(d[q25Key])).length;
  const wouldUsePct = totalResponses ? Math.round((wouldUse/totalResponses)*100) : 0;
  
  const forged = filteredData.filter(d => d[q14Key] === 'Yes').length;
  const forgedPct = totalResponses ? Math.round((forged/totalResponses)*100) : 0;

  const getCounts = (key) => {
    const counts = {};
    filteredData.forEach(d => {
      let val = d[key];
      if (!val) return;
      if (typeof val === 'string' && val.includes('; ')) {
        val.split('; ').forEach(v => counts[v] = (counts[v] || 0) + 1);
      } else {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">V</div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">VoS Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="border border-slate-300 p-2.5 rounded-lg text-sm bg-slate-50 font-medium focus:ring-2 outline-none" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Student">Student</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="HR">HR Professional</option>
              <option value="Academic">Academic Administrator</option>
            </select>
            <button onClick={() => handleDownload('/api/admin/download', 'responses.xlsx')} className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 text-sm font-semibold shadow-sm transition-colors">Export Excel</button>
            <button onClick={() => handleDownload('/api/admin/download-summary', 'summary.xlsx')} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-sm transition-colors">Export Summary</button>
            <button onClick={handleLogout} className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-200 text-sm font-semibold transition-colors">Logout</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-5 rounded-bl-full"></div>
            <p className="text-sm font-medium text-slate-500 mb-2">Total Responses</p>
            <p className="text-4xl font-extrabold text-slate-800">{totalResponses}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-5 rounded-bl-full"></div>
            <p className="text-sm font-medium text-slate-500 mb-2">Would use CredenSync</p>
            <p className="text-4xl font-extrabold text-green-600">{wouldUsePct}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 opacity-5 rounded-bl-full"></div>
            <p className="text-sm font-medium text-slate-500 mb-2">Forged Certs Encountered</p>
            <p className="text-4xl font-extrabold text-yellow-600">{forgedPct}%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500 opacity-5 rounded-bl-full"></div>
            <p className="text-sm font-medium text-slate-500 mb-2">Avg System Usefulness</p>
            <p className="text-4xl font-extrabold text-indigo-600">{avgUsefulness} <span className="text-lg text-slate-400 font-medium">/ 5</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 opacity-5 rounded-bl-full"></div>
            <p className="text-sm font-medium text-slate-500 mb-2">ID Theft Concern</p>
            <p className="text-4xl font-extrabold text-red-500">{avgIdentityConcern} <span className="text-lg text-slate-400 font-medium">/ 5</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6">Top Problems with Current System</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCounts('Q18. Which problems do you experience with the current system?').slice(0, 5)} layout="vertical" margin={{left: 100, right: 20}}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} width={120} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-6">Adoption Intent (Would you use it?)</h3>
            <div className="h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={getCounts(q25Key)} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                    {getCounts(q25Key).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
               {getCounts(q25Key).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                     <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                     {entry.name} ({entry.value})
                  </div>
               ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-bold text-lg text-slate-800">Open-Ended Responses</h3>
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search keywords..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border border-slate-300 pl-10 pr-4 py-2 rounded-lg w-full sm:w-72 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-slate-50 focus:bg-white" />
            </div>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {filteredData.map((d, idx) => {
              const q29 = d['Q29. What is the biggest problem you face with the current credential verification process?'];
              const q34 = d['Q34. Do you have any suggestions or concerns regarding the CredenSync concept?'];
              const hasQ29 = q29 && String(q29).trim().length > 0;
              const hasQ34 = q34 && String(q34).trim().length > 0;
              
              if (!hasQ29 && !hasQ34) return null;
              
              if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const match29 = hasQ29 && String(q29).toLowerCase().includes(searchLower);
                const match34 = hasQ34 && String(q34).toLowerCase().includes(searchLower);
                if (!match29 && !match34) return null;
              }
              
              return (
                <div key={d['Response ID'] || idx} className="p-5 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {d['Q1. Which category best describes you?'] || 'Unknown'}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(d.Timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-3">
                    {hasQ29 && (
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biggest Problem</span>
                        <p className="text-sm mt-1 text-slate-700 leading-relaxed">{q29}</p>
                      </div>
                    )}
                    {hasQ34 && (
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suggestions / Concerns</span>
                        <p className="text-sm mt-1 text-slate-700 leading-relaxed">{q34}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredData.filter(d => (d['Q29. What is the biggest problem you face with the current credential verification process?'] || d['Q34. Do you have any suggestions or concerns regarding the CredenSync concept?'])).length === 0 && (
              <div className="text-center py-10 text-slate-500">No open-ended responses match your criteria.</div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      `}} />
    </div>
  );
}
