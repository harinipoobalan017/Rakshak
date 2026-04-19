import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import ThreeBackground from '../../components/3D/ThreeBackground';
import { Flame, Car, Heart, Waves, Zap, CheckCircle, Clock, Truck, CircleDot } from 'lucide-react';

const STATUS_STEPS = ['pending','assigned','in_progress','resolved'];
const STATUS_LABELS = { pending:'Waiting for responder', assigned:'Responder assigned', in_progress:'Help is on the way', resolved:'Incident resolved' };
const TYPE_ICON = { fire: Flame, accident: Car, medical: Heart, flood: Waves, other: Zap };
const TYPE_COLOR = { fire:'#ef4444', accident:'#f97316', medical:'#3b82f6', flood:'#06b6d4', other:'#8b5cf6' };

export default function TrackStatus() {
  const [incidents, setIncidents] = useState([]);
  const { socket } = useSocket();

  useEffect(() => { api.get('/incidents').then(res => setIncidents(res.data)); }, []);

  useEffect(() => {
    if (!socket) return;
    incidents.forEach(inc => {
      socket.on(`incident_update_${inc.id}`, ({ status }) => {
        setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, status } : i));
      });
    });
    return () => { incidents.forEach(inc => socket.off(`incident_update_${inc.id}`)); };
  }, [socket, incidents]);

  return (
    <div style={{ position:'relative', minHeight:'100vh' }}>
      <ThreeBackground />
      <div style={{ position:'relative', zIndex:1, maxWidth:'700px', margin:'0 auto', padding:'40px 20px' }}>
        <div className="fade-up" style={{ marginBottom:'32px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:800 }}>Track <span style={{ color:'var(--red)' }}>Your Reports</span></h1>
          <p style={{ color:'var(--muted2)', marginTop:'6px' }}>Live status updates — no refresh needed</p>
        </div>
        {incidents.length === 0 ? (
          <div className="glass-card" style={{ padding:'48px', textAlign:'center' }}>
            <CircleDot size={48} style={{ color:'var(--muted)', marginBottom:'16px' }} />
            <p style={{ color:'var(--muted2)' }}>No incidents reported yet</p>
          </div>
        ) : (
          incidents.map((inc, idx) => {
            const stepIdx = STATUS_STEPS.indexOf(inc.status);
            const Icon = TYPE_ICON[inc.type] || Zap;
            return (
              <div key={inc.id} className="glass-card fade-up" style={{ padding:'24px', marginBottom:'16px', animationDelay:`${idx*0.1}s` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                      <div style={{ width:36, height:36, borderRadius:'10px', background:`${TYPE_COLOR[inc.type]||'#8b5cf6'}18`, border:`1px solid ${TYPE_COLOR[inc.type]||'#8b5cf6'}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon size={18} style={{ color: TYPE_COLOR[inc.type]||'#8b5cf6' }} />
                      </div>
                      <h3 style={{ fontWeight:700, textTransform:'capitalize' }}>{inc.type}</h3>
                    </div>
                    <p style={{ color:'var(--muted2)', fontSize:'13px' }}>{inc.address}</p>
                  </div>
                  <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:'12px' }}>
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= stepIdx; const active = i === stepIdx;
                    return (
                      <div key={step} style={{ display:'flex', alignItems:'center', flex: i < STATUS_STEPS.length-1 ? 1 : 'unset' }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background:done?(active?'var(--red)':'var(--green)'):'var(--border)', border:`2px solid ${done?(active?'var(--red)':'var(--green)'):'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', transition:'all 0.4s', boxShadow:active?'0 0 12px var(--red)':done?'0 0 8px var(--green)':'none' }}>
                          {done && !active ? <CheckCircle size={14} /> : i+1}
                        </div>
                        {i < STATUS_STEPS.length-1 && <div style={{ flex:1, height:2, margin:'0 4px', background:i<stepIdx?'var(--green)':'var(--border)', transition:'background 0.4s' }} />}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ fontSize:'13px', color:'var(--muted2)', display:'flex', alignItems:'center', gap:'6px' }}><Clock size={14} />{STATUS_LABELS[inc.status]}</p>
                  <p style={{ fontSize:'12px', color:'var(--muted)' }}>{new Date(inc.created_at).toLocaleString()}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}