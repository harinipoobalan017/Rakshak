import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function PublicNav() {
  return (
    <>
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 48px',
        background: 'rgba(5,5,5,0.5)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={28} color="#fff" />
          <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>
            RAK<span style={{ color: '#ef4444' }}>SHAK</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/graphs" className="nav-link">Graphs</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/login" style={{
            background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
            color: '#fff', textDecoration: 'none',
            padding: '10px 24px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 600,
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          }}>Join Network</Link>
        </div>
      </nav>
      <style>{`
        .nav-link { color: #a3a3a3; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s; }
        .nav-link:hover { color: #fff; }
      `}</style>
    </>
  );
}
