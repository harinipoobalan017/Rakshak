import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import LiveMap from '../../components/Map/LiveMap';
import IncidentCard from './IncidentCard';
import EmergencyTicker from '../../components/shared/EmergencyTicker';
import AIAnalysisWidget from '../../components/shared/AIAnalysisWidget';
import DroneFeedWidget from '../../components/shared/DroneFeedWidget';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThreeBackground from '../../components/3D/ThreeBackground';
import { ClipboardList, Clock, Rocket, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

const FILTERS = ['all','pending','assigned','in_progress','resolved'];

function TiltCard({ children, style, className }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    cardRef.current.style.boxShadow = `
      ${-rotateY}px ${rotateX + 10}px 20px rgba(0,0,0,0.3),
      0 0 15px rgba(255,255,255,0.05) inset
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    cardRef.current.style.boxShadow = 'none';
  };

  return (
    <div 
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        ...style, 
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
}

export default function ResponderDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, joinRoom } = useSocket();

  useEffect(() => {
    joinRoom('responder');
    api.get('/incidents').then(res => { setIncidents(Array.isArray(res.data)?res.data:[]); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (incident) => {
      setIncidents(prev => [incident, ...prev]);
      toast.custom(() => (
        <div style={{ background:'var(--card)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:'14px', padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px', boxShadow:'0 8px 32px rgba(239,68,68,0.2)', animation:'slideIn 0.3s ease' }}>
          <AlertTriangle size={24} style={{ color:'var(--red)' }} />
          <div>
            <p style={{ fontWeight:700, color:'var(--red)' }}>New {incident.severity} incident!</p>
            <p style={{ fontSize:'13px', color:'var(--muted2)' }}>{incident.type} — {incident.address}</p>
          </div>
        </div>
      ), { duration:6000, position:'top-right' });
      if (incident.severity === 'critical') new Audio('/alert.mp3').play().catch(()=>{});
    };
    socket.on('new_incident', handler);
    return () => socket.off('new_incident', handler);
  }, [socket]);

  const updateIncident = useCallback((id, status) => {
    setIncidents(prev => prev.map(i => i.id===id ? {...i, status} : i));
  }, []);

  const filtered = filter==='all' ? incidents : incidents.filter(i=>i.status===filter);
  const counts = FILTERS.reduce((acc,f) => { acc[f]=f==='all'?incidents.length:incidents.filter(i=>i.status===f).length; return acc; }, {});

  const STAT_ICONS = [
    { label:'Total', val:counts.all, accent:'var(--blue)', icon:ClipboardList },
    { label:'Pending', val:counts.pending, accent:'var(--yellow)', icon:Clock },
    { label:'Active', val:(counts.assigned||0)+(counts.in_progress||0), accent:'var(--orange)', icon:Rocket },
    { label:'Resolved', val:counts.resolved, accent:'var(--green)', icon:CheckCircle },
  ];

  return (
    <div style={{ position:'relative', height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <ThreeBackground />
      <div style={{ position:'relative', zIndex:10 }}>
        <EmergencyTicker incidents={incidents} />
      </div>
      
      <div style={{ position:'relative', zIndex:1, display:'flex', flex:1, overflow:'hidden' }}>
        <div style={{ flex:1, padding:'24px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'20px' }}>
          
          <DroneFeedWidget />

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
            {STAT_ICONS.map(s => { const I=s.icon; return (
              <TiltCard key={s.label} className="glass-card stat-card fade-up" style={{ padding:'20px', '--accent':s.accent }}>
                <div style={{ width:44, height:44, borderRadius:'12px', background:`${s.accent}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px', transform:'translateZ(20px)' }}>
                  <I size={22} style={{ color:s.accent }} />
                </div>
                <div style={{ fontSize:'32px', fontWeight:900, color:s.accent, transform:'translateZ(30px)', display:'inline-block' }}>{s.val??0}</div>
                <div style={{ fontSize:'13px', color:'var(--muted2)', marginTop:'4px', transform:'translateZ(10px)' }}>{s.label}</div>
              </TiltCard>
            ); })}
          </div>
          {/* Filters (Dribbble style Pills) */}
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', padding:'4px 0', borderBottom: '1px solid #262626', paddingBottom: '20px' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:'8px 24px', borderRadius:'30px', border:'none', background:filter===f?'#ffffff':'#141414', color:filter===f?'#000000':'#a3a3a3', cursor:'pointer', fontSize:'13px', fontWeight:700, transition:'all 0.2s ease', textTransform:'capitalize', boxShadow:filter===f?'0 4px 15px rgba(255,255,255,0.1)':'inset 0 0 0 1px #262626' }}>
                {f.replace('_',' ')}
                {filter===f && <span style={{ marginLeft:'8px', background:'#000000', borderRadius:'10px', padding:'2px 8px', fontSize:'11px', color:'#ffffff' }}>{counts[f]??0}</span>}
              </button>
            ))}
          </div>
          {/* Map */}
          <div style={{ flex:1, minHeight:'400px', borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 20px 40px rgba(0,0,0,0.4)', position:'relative' }}>
            <LiveMap incidents={filtered} onMarkerClick={setSelected} height="100%" />
            {/* Glossy overlay effect for map container */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)', pointerEvents:'none' }} />
          </div>
        </div>
        {/* Right panel */}
        <div style={{ width:'400px', borderLeft:'1px solid #262626', padding:'24px', overflowY:'auto', background:'#0a0a0a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <AIAnalysisWidget incidents={filtered} />

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', paddingBottom:'16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontWeight:800, fontSize:'18px', display:'flex', alignItems:'center', gap:'10px', letterSpacing:'-0.5px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="pulse-dot" style={{ background:'var(--red)', color:'var(--red)', width:'10px', height:'10px' }} />
                </div>
                Live Feed
              </h2>
              <div style={{ background:'var(--card2)', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', color:'var(--muted)', border:'1px solid var(--border)' }}>
                {filtered.length} incidents
              </div>
            </div>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', paddingTop:'48px' }}><div className="spinner" /></div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted2)' }}>
              <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(34,197,94,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', border:'1px solid rgba(34,197,94,0.2)' }}>
                <Shield size={36} style={{ color:'var(--green)' }} />
              </div>
              <p style={{ fontSize:'16px', fontWeight:600, color:'var(--text)' }}>All Clear</p>
              <p style={{ fontSize:'13px', marginTop:'6px' }}>No active incidents match your filter.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {filtered.map((inc, i) => (
                <div key={inc.id} style={{ animation:`fadeUp 0.4s ease forwards ${i*0.05}s`, opacity:0 }}>
                  <IncidentCard incident={inc} isSelected={selected?.id===inc.id} onUpdate={updateIncident} />
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}