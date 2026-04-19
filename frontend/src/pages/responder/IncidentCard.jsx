import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Flame, Car, Heart, Waves, Zap, MapPin, Hand, Rocket, CheckCircle, Loader2 } from 'lucide-react';

const TYPE_ICON = { fire: Flame, accident: Car, medical: Heart, flood: Waves, other: Zap };
const TYPE_COLOR = { fire:'#ef4444', accident:'#f97316', medical:'#3b82f6', flood:'#06b6d4', other:'#8b5cf6' };

export default function IncidentCard({ incident, isSelected, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const Icon = TYPE_ICON[incident.type] || Zap;

  const handleAction = async (status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      await api.patch(`/incidents/${incident.id}/status`, { status, assigned_to: userId });
      toast.success(`Incident ${status.replace('_',' ')}`);
      onUpdate(incident.id, status);
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      background: isSelected ? 'rgba(239,68,68,0.06)' : 'var(--card)',
      border: `1px solid ${isSelected ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
      borderRadius:'14px', padding:'18px', marginBottom:'12px',
      transition:'all 0.2s', cursor:'pointer',
      boxShadow: isSelected ? '0 0 20px rgba(239,68,68,0.1)' : 'none',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:36, height:36, borderRadius:'10px', background:`${TYPE_COLOR[incident.type]||'#8b5cf6'}18`, border:`1px solid ${TYPE_COLOR[incident.type]||'#8b5cf6'}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={18} style={{ color:TYPE_COLOR[incident.type]||'#8b5cf6' }} />
          </div>
          <div>
            <p style={{ fontWeight:700, textTransform:'capitalize', fontSize:'15px' }}>{incident.type}</p>
            <p style={{ fontSize:'12px', color:'var(--muted2)' }}>#{incident.id}</p>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
          <span className={`badge badge-${incident.severity}`}>{incident.severity}</span>
          <span className={`badge badge-${incident.status}`} style={{ fontSize:'10px' }}>{incident.status.replace('_',' ')}</span>
        </div>
      </div>
      <p style={{ fontSize:'13px', color:'var(--muted2)', marginBottom:'10px', lineHeight:1.5 }}>
        {incident.description?.slice(0,100)}{incident.description?.length>100?'...':''}
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'14px', fontSize:'12px', color:'var(--muted)' }}>
        <MapPin size={12} /> {incident.address || `${incident.latitude}, ${incident.longitude}`}
      </div>
      {incident.status === 'pending' && (
        <button className="btn-red" style={{ width:'100%', padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }} onClick={()=>handleAction('assigned')} disabled={loading}>
          {loading ? <><Loader2 size={16} style={{ animation:'spin 0.7s linear infinite' }} /> Assigning...</> : <><Hand size={16} /> Take Charge</>}
        </button>
      )}
      {incident.status === 'assigned' && (
        <button className="btn-red" style={{ width:'100%', padding:'10px', background:'linear-gradient(135deg,#f97316,#ea580c)', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }} onClick={()=>handleAction('in_progress')} disabled={loading}>
          {loading ? <><Loader2 size={16} style={{ animation:'spin 0.7s linear infinite' }} /> Updating...</> : <><Rocket size={16} /> Mark In Progress</>}
        </button>
      )}
      {incident.status === 'in_progress' && (
        <button className="btn-red" style={{ width:'100%', padding:'10px', background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }} onClick={()=>handleAction('resolved')} disabled={loading}>
          {loading ? <><Loader2 size={16} style={{ animation:'spin 0.7s linear infinite' }} /> Resolving...</> : <><CheckCircle size={16} /> Mark Resolved</>}
        </button>
      )}
      {incident.status === 'resolved' && (
        <div style={{ textAlign:'center', color:'var(--green)', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
          <CheckCircle size={16} /> Resolved
        </div>
      )}
    </div>
  );
}