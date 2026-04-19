import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PublicNav from '../../components/shared/PublicNav';
import ThreeBackground from '../../components/3D/ThreeBackground';
import api from '../../services/api';

const COLORS = ['#ef4444', '#a855f7', '#f97316', '#22c55e', '#3b82f6', '#06b6d4'];

export default function Graphs() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/incidents');
        setIncidents(res.data);
      } catch (err) {
        // Fallback demo data if not logged in
        setIncidents([
          { id: 1, type: 'Fire', severity: 'high', status: 'resolved', created_at: '2026-04-15T10:00:00Z' },
          { id: 2, type: 'Medical', severity: 'critical', status: 'in_progress', created_at: '2026-04-15T14:00:00Z' },
          { id: 3, type: 'Accident', severity: 'high', status: 'pending', created_at: '2026-04-16T09:00:00Z' },
          { id: 4, type: 'Fire', severity: 'medium', status: 'resolved', created_at: '2026-04-16T18:00:00Z' },
          { id: 5, type: 'Fire', severity: 'medium', status: 'pending', created_at: '2026-04-17T08:00:00Z' },
          { id: 6, type: 'Flood', severity: 'medium', status: 'pending', created_at: '2026-04-17T12:00:00Z' },
          { id: 7, type: 'Medical', severity: 'low', status: 'resolved', created_at: '2026-04-18T10:00:00Z' },
          { id: 8, type: 'Police', severity: 'high', status: 'assigned', created_at: '2026-04-18T16:00:00Z' },
          { id: 9, type: 'Accident', severity: 'critical', status: 'in_progress', created_at: '2026-04-19T07:00:00Z' },
          { id: 10, type: 'Fire', severity: 'high', status: 'pending', created_at: '2026-04-19T09:00:00Z' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build chart data from incidents
  const severityData = ['critical', 'high', 'medium', 'low'].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: incidents.filter(i => i.severity === s).length,
  }));

  const typeData = [...new Set(incidents.map(i => i.type))].map(t => ({
    name: t,
    value: incidents.filter(i => i.type === t).length,
  }));

  const statusData = ['pending', 'assigned', 'in_progress', 'resolved'].map(s => ({
    name: s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: incidents.filter(i => i.status === s).length,
  }));

  // Timeline (group by date)
  const timelineMap = {};
  incidents.forEach(inc => {
    const day = new Date(inc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    timelineMap[day] = (timelineMap[day] || 0) + 1;
  });
  const timelineData = Object.entries(timelineMap).map(([date, count]) => ({ date, incidents: count }));

  const cardStyle = {
    background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
    padding: '32px', position: 'relative', overflow: 'hidden',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '13px' }}>
        <p style={{ marginBottom: '4px', fontWeight: 700 }}>{label || payload[0]?.name}</p>
        <p style={{ color: '#a3a3a3' }}>{payload[0]?.value ?? payload[0]?.payload?.count} incidents</p>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <ThreeBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PublicNav />
        <main style={{ padding: '60px 48px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px', color: '#e8d5b5', textShadow: '0 0 60px rgba(239,68,68,0.2)' }}>System Telemetry</h1>
          <p style={{ color: '#737373', fontSize: '16px', marginBottom: '48px' }}>
            Real-time analytics from {incidents.length} recorded incidents. {loading ? 'Loading...' : 'Data synced.'}
          </p>
          
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Total Incidents', value: incidents.length, color: '#ef4444' },
              { label: 'Critical', value: incidents.filter(i => i.severity === 'critical').length, color: '#a855f7' },
              { label: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length, color: '#22c55e' },
              { label: 'Active Now', value: incidents.filter(i => i.status !== 'resolved').length, color: '#f97316' },
            ].map((s, i) => (
              <div key={i} style={{ ...cardStyle, padding: '24px' }}>
                <p style={{ fontSize: '13px', color: '#737373', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.5px' }}>{s.label}</p>
                <p style={{ fontSize: '36px', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Incident Timeline */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#a3a3a3', letterSpacing: '0.5px' }}>INCIDENT TIMELINE</h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" tick={{ fill: '#737373', fontSize: 12 }} axisLine={{ stroke: '#262626' }} />
                  <YAxis tick={{ fill: '#737373', fontSize: 12 }} axisLine={{ stroke: '#262626' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="incidents" stroke="#ef4444" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Severity Distribution */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#a3a3a3', letterSpacing: '0.5px' }}>SEVERITY DISTRIBUTION</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="name" tick={{ fill: '#737373', fontSize: 12 }} axisLine={{ stroke: '#262626' }} />
                  <YAxis tick={{ fill: '#737373', fontSize: 12 }} axisLine={{ stroke: '#262626' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {severityData.map((_, i) => (
                      <Cell key={i} fill={['#a855f7', '#ef4444', '#f97316', '#22c55e'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Type Breakdown (Donut) */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#a3a3a3', letterSpacing: '0.5px' }}>INCIDENT TYPE BREAKDOWN</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {typeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#a3a3a3', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Overview */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#a3a3a3', letterSpacing: '0.5px' }}>STATUS OVERVIEW</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis type="number" tick={{ fill: '#737373', fontSize: 12 }} axisLine={{ stroke: '#262626' }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={{ stroke: '#262626' }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={['#eab308', '#3b82f6', '#f97316', '#22c55e'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
