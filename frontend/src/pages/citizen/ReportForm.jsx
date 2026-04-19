import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThreeBackground from '../../components/3D/ThreeBackground';
import { Flame, Car, Heart, Waves, Zap, AlertTriangle, MapPin, Camera, Navigation, FileText, Send, Loader2 } from 'lucide-react';

const TYPES = [
  { key: 'fire', label: 'Fire', icon: Flame, color: '#ef4444' },
  { key: 'accident', label: 'Accident', icon: Car, color: '#f97316' },
  { key: 'medical', label: 'Medical', icon: Heart, color: '#3b82f6' },
  { key: 'flood', label: 'Flood', icon: Waves, color: '#06b6d4' },
  { key: 'other', label: 'Other', icon: Zap, color: '#8b5cf6' },
];
const SEVS = [
  { key: 'low', color: '#22c55e' }, { key: 'medium', color: '#eab308' },
  { key: 'high', color: '#ef4444' }, { key: 'critical', color: '#8b5cf6' },
];

export default function ReportForm() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type:'fire', description:'', severity:'medium', address:'', latitude:'', longitude:'', image:null });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => { set('latitude', pos.coords.latitude); set('longitude', pos.coords.longitude); toast.success('Location captured!'); },
      () => toast.error('Location access denied')
    );
  };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k,v])=>{ if(v) data.append(k,v); });
      await api.post('/incidents', data, { headers:{'Content-Type':'multipart/form-data'} });
      toast.success('Incident reported!', { duration:4000 }); nav('/track');
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:'relative', minHeight:'100vh' }}>
      <ThreeBackground />
      <div style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto', padding:'40px 20px' }}>
        <div className="fade-up" style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'20px', padding:'6px 16px', marginBottom:'16px', fontSize:'13px', color:'var(--red)' }}>
            <AlertTriangle size={14} /> Emergency Reporting
          </div>
          <h1 style={{ fontSize:'32px', fontWeight:800 }}>Report an <span style={{ color:'var(--red)' }}>Incident</span></h1>
          <p style={{ color:'var(--muted2)', marginTop:'8px', fontSize:'15px' }}>Your report reaches the emergency team instantly</p>
        </div>
        <div className="glass-card fade-up" style={{ padding:'32px', animationDelay:'0.1s' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'24px' }}>
              <label style={{ fontSize:'13px', color:'var(--muted2)', fontWeight:500, display:'block', marginBottom:'10px' }}>INCIDENT TYPE</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px' }}>
                {TYPES.map(t => { const I=t.icon; const s=form.type===t.key; return (
                  <button key={t.key} type="button" onClick={()=>set('type',t.key)} style={{ padding:'14px 8px', borderRadius:'10px', border:'1px solid', borderColor:s?t.color:'var(--border)', background:s?`${t.color}18`:'var(--bg2)', color:s?t.color:'var(--muted2)', cursor:'pointer', fontSize:'11px', fontWeight:600, textTransform:'uppercase', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                    <I size={20} />{t.label}
                  </button>
                ); })}
              </div>
            </div>
            <div style={{ marginBottom:'24px' }}>
              <label style={{ fontSize:'13px', color:'var(--muted2)', fontWeight:500, display:'block', marginBottom:'10px' }}>SEVERITY LEVEL</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                {SEVS.map(s => (
                  <button key={s.key} type="button" onClick={()=>set('severity',s.key)} style={{ padding:'10px', borderRadius:'10px', border:'1px solid', borderColor:form.severity===s.key?s.color:'var(--border)', background:form.severity===s.key?`${s.color}18`:'var(--bg2)', color:form.severity===s.key?s.color:'var(--muted2)', cursor:'pointer', fontSize:'12px', fontWeight:600, textTransform:'capitalize', transition:'all 0.2s' }}>{s.key}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'13px', color:'var(--muted2)', fontWeight:500, display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}><FileText size={14} /> DESCRIPTION</label>
              <textarea name="description" value={form.description} onChange={e=>set('description',e.target.value)} required rows={4} className="dark-input" placeholder="Describe what happened..." style={{ resize:'vertical' }} />
            </div>
            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'13px', color:'var(--muted2)', fontWeight:500, display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}><MapPin size={14} /> ADDRESS</label>
              <div style={{ display:'flex', gap:'8px' }}>
                <input name="address" value={form.address} onChange={e=>set('address',e.target.value)} className="dark-input" placeholder="Enter location address" style={{ flex:1 }} />
                <button type="button" className="btn-outline" onClick={getLocation} style={{ padding:'12px 14px', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'6px' }}><Navigation size={14} /> GPS</button>
              </div>
              {form.latitude && <p style={{ fontSize:'12px', color:'var(--green)', marginTop:'6px', display:'flex', alignItems:'center', gap:'4px' }}><MapPin size={12} />{parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}</p>}
            </div>
            <div style={{ marginBottom:'28px' }}>
              <label style={{ fontSize:'13px', color:'var(--muted2)', fontWeight:500, display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}><Camera size={14} /> PHOTO (optional)</label>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--bg2)', border:'1px dashed var(--border)', borderRadius:'10px', padding:'16px 20px', cursor:'pointer', color:'var(--muted2)', fontSize:'14px', transition:'border-color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--red)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                <Camera size={20} style={{ color:'var(--muted)' }} />{form.image ? form.image.name : 'Upload incident photo'}
                <input type="file" name="image" accept="image/*" onChange={e=>set('image',e.target.files[0])} style={{ display:'none' }} />
              </label>
            </div>
            <button type="submit" className="btn-red" style={{ width:'100%', padding:'14px', fontSize:'15px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }} disabled={loading}>
              {loading ? <><Loader2 size={18} style={{ animation:'spin 0.7s linear infinite' }} /> Sending...</> : <><Send size={18} /> Report Emergency</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}