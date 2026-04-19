import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ThreeBackground from '../components/3D/ThreeBackground';
import {
  Shield, Mail, Lock, User, ChevronRight, UserPlus, LogIn
} from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password, form.role);
        toast.success('Account created! Please login.');
        setIsRegister(false);
      } else {
        const user = await login(form.email, form.password);
        toast.success('Welcome back!');
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'responder') navigate('/dashboard');
        else navigate('/report');
      }
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ThreeBackground />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', padding: '20px' }}>

        {/* Logo */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '20px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#ef4444,#dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(239,68,68,0.5)',
          }}>
            <Shield size={32} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
            RAK<span style={{ color: 'var(--red)' }}>SHAK</span>
          </h1>
          <p style={{ color: 'var(--muted2)', marginTop: '6px', fontSize: '14px' }}>
            Real-Time Emergency Management
          </p>
        </div>

        {/* Card */}
        <div className="glass-card fade-up" style={{ padding: '32px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            {isRegister
              ? <UserPlus size={20} style={{ color: 'var(--red)' }} />
              : <LogIn size={20} style={{ color: 'var(--red)' }} />
            }
            <h2 style={{ fontWeight: 700, fontSize: '18px' }}>
              {isRegister ? 'Create Account' : 'Sign In'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                }} />
                <input name="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="dark-input" placeholder="Full name" required
                  style={{ paddingLeft: '40px' }} />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)',
              }} />
              <input name="email" type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="dark-input" placeholder="Email address" required
                style={{ paddingLeft: '40px' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)',
              }} />
              <input name="password" type="password" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="dark-input" placeholder="Password" required
                style={{ paddingLeft: '40px' }} />
            </div>

            {isRegister && (
              <select name="role" value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="dark-input">
                <option value="citizen">Citizen</option>
                <option value="responder">Responder</option>
                <option value="admin">Admin</option>
              </select>
            )}

            <button type="submit" className="btn-red"
              style={{ marginTop: '8px', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={loading}>
              {loading ? 'Please wait...' : (
                <>
                  {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                  {isRegister ? 'Create Account' : 'Sign In'}
                  {!isRegister && <ChevronRight size={18} />}
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--muted2)' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsRegister(p => !p)}
              style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}