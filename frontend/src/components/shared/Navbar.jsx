import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Shield, FileText, MapPin, LayoutDashboard, BarChart3,
  LogOut, Wifi, WifiOff, Bell, Settings, User
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected }    = useSocket();
  const navigate         = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      width: '260px', height: '100vh',
      background: '#0a0a0a', borderRight: '1px solid #262626',
      display: 'flex', flexDirection: 'column',
      padding: '24px 20px', zIndex: 100, position: 'relative'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 8px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '12px',
          background: 'linear-gradient(135deg,#ef4444,#dc2626)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(239,68,68,0.3)',
        }}>
          <Shield size={22} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px', color: '#fff' }}>
          RAK<span style={{ color: '#ef4444' }}>SHAK</span>
        </span>
      </Link>

      <div style={{ fontSize: '11px', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '16px', padding: '0 12px' }}>
        MAIN MENU
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {user?.role === 'citizen' && <>
          <NavLink to="/report" icon={<FileText size={18} />}>Report Incident</NavLink>
          <NavLink to="/track" icon={<MapPin size={18} />}>Track Status</NavLink>
        </>}
        {(user?.role === 'responder' || user?.role === 'admin') && <>
          <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
        </>}
        {user?.role === 'admin' && <>
          <NavLink to="/admin" icon={<BarChart3 size={18} />}>Analytics</NavLink>
        </>}
        
        <div style={{ margin: '24px 0', height: '1px', background: '#262626' }} />
        
        <NavLink to="#" icon={<Settings size={18} />}>Settings</NavLink>
        <NavLink to="#" icon={<User size={18} />}>Profile</NavLink>
      </div>

      {/* Bottom Section */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Network Status */}
        <div style={{ background: '#141414', border: '1px solid #262626', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: connected ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {connected ? <Wifi size={16} color="#22c55e" /> : <WifiOff size={16} color="#ef4444" />}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Network</div>
              <div style={{ fontSize: '11px', color: connected ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-dot" style={{ background: connected ? '#22c55e' : '#ef4444', width: '6px', height: '6px' }} />
                {connected ? 'Secure Link' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile / Logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', color: '#fff' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '11px', color: '#737373', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#737373', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }} onMouseLeave={e => { e.currentTarget.style.color = '#737373'; e.currentTarget.style.background = 'transparent'; }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{
      color: isActive ? '#fff' : '#a3a3a3', textDecoration: 'none',
      padding: '12px 16px', borderRadius: '12px',
      fontSize: '14px', fontWeight: 600,
      transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', gap: '12px',
      background: isActive ? '#141414' : 'transparent',
      border: `1px solid ${isActive ? '#262626' : 'transparent'}`,
      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.5)' : 'none'
    }}
    onMouseEnter={e => { 
      if (!isActive) {
        e.currentTarget.style.color = '#fff'; 
        e.currentTarget.style.background = '#141414'; 
      }
    }}
    onMouseLeave={e => { 
      if (!isActive) {
        e.currentTarget.style.color = '#a3a3a3'; 
        e.currentTarget.style.background = 'transparent'; 
      }
    }}>
      <div style={{ color: isActive ? '#ef4444' : 'inherit', transition: 'color 0.2s' }}>
        {icon}
      </div>
      {children}
    </Link>
  );
}