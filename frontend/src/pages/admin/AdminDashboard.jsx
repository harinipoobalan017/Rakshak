import { useEffect, useState } from 'react';
import api from '../../services/api';
import SeverityChart from '../../components/Charts/SeverityChart';
import IncidentTimeline from '../../components/Charts/IncidentTimeline';
import HeatmapWidget from '../../components/Charts/HeatmapWidget';
import ThreeBackground from '../../components/3D/ThreeBackground';
import { ClipboardList, CheckCircle, AlertTriangle, TrendingUp, BarChart3, Target, FolderOpen } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(res => { setData(res.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh' }}>
      <div className="spinner" />
    </div>
  );

  const severity = data.severity || data.bySeverity || [];
  const byStatus = data.byStatus || [];
  const timeline = data.timeline || [];
  const byType = data.type || data.byType || [];

  const total    = severity.reduce((a,b) => a + Number(b.count), 0) || 0;
  const resolved = byStatus.find(s => s.status === 'resolved')?.count || 0;
  const critical = severity.find(s => s.severity === 'critical')?.count || 0;

  const KPI = [
    { label:'Total Incidents', val:total, icon:ClipboardList, accent:'var(--blue)' },
    { label:'Resolved', val:resolved, icon:CheckCircle, accent:'var(--green)' },
    { label:'Critical', val:critical, icon:AlertTriangle, accent:'var(--red)' },
    { label:'Resolution Rate', val: total ? `${Math.round(resolved/total*100)}%` : '0%', icon:TrendingUp, accent:'var(--purple)' },
  ];

  return (
    <div style={{ position:'relative', minHeight:'100vh' }}>
      <ThreeBackground />
      <div style={{ position:'relative', zIndex:1, padding:'32px', maxWidth:'1400px', margin:'0 auto' }}>
        <div className="fade-up" style={{ marginBottom:'32px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:800 }}>Analytics <span style={{ color:'var(--red)' }}>Dashboard</span></h1>
          <p style={{ color:'var(--muted2)', marginTop:'4px' }}>Real-time emergency response intelligence</p>
        </div>
        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
          {KPI.map(s => { const I=s.icon; return (
            <div key={s.label} className="glass-card stat-card fade-up" style={{ padding:'22px', '--accent':s.accent }}>
              <div style={{ width:44, height:44, borderRadius:'12px', background:`${s.accent}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px' }}>
                <I size={22} style={{ color:s.accent }} />
              </div>
              <div style={{ fontSize:'32px', fontWeight:900, color:s.accent, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:'13px', color:'var(--muted2)', marginTop:'6px' }}>{s.label}</div>
            </div>
          ); })}
        </div>
        {/* Charts row 1 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
          <div className="glass-card fade-up" style={{ padding:'24px' }}>
            <h3 style={{ fontWeight:600, marginBottom:'20px', fontSize:'15px', display:'flex', alignItems:'center', gap:'8px' }}>
              <BarChart3 size={18} style={{ color:'var(--red)' }} /> Incidents Over Time
            </h3>
            <IncidentTimeline data={timeline} />
          </div>
          <div className="glass-card fade-up" style={{ padding:'24px' }}>
            <h3 style={{ fontWeight:600, marginBottom:'20px', fontSize:'15px', display:'flex', alignItems:'center', gap:'8px' }}>
              <Target size={18} style={{ color:'var(--purple)' }} /> Severity Breakdown
            </h3>
            <SeverityChart data={severity} />
          </div>
        </div>
        {/* Charts row 2 */}
        <div className="glass-card fade-up" style={{ padding:'24px' }}>
          <h3 style={{ fontWeight:600, marginBottom:'20px', fontSize:'15px', display:'flex', alignItems:'center', gap:'8px' }}>
            <FolderOpen size={18} style={{ color:'var(--orange)' }} /> Incidents by Type
          </h3>
          <HeatmapWidget data={byType} />
        </div>
      </div>
    </div>
  );
}