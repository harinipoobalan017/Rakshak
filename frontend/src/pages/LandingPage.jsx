import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import PublicNav from '../components/shared/PublicNav';
import ThreeBackground from '../components/3D/ThreeBackground';
import { Shield, Zap, Radio, Eye, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FEATURES = [
    { icon: Zap, title: 'Predictive AI Engine', desc: 'Machine learning models that predict incident hotspots 30 minutes before they escalate, enabling pre-emptive resource deployment.' },
    { icon: Radio, title: 'Real-Time Telemetry', desc: 'Sub-second GPS tracking of every responder unit with live status updates, integrated directly into the command dashboard.' },
    { icon: Eye, title: 'Autonomous Drone Grid', desc: 'Automated aerial reconnaissance drones deployed to active zones, streaming live thermal and optical feeds to HQ.' },
    { icon: Shield, title: 'Secure Dispatch Network', desc: 'End-to-end encrypted communication channels with role-based access control for classified incident data.' },
  ];

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      <ThreeBackground />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <PublicNav />

        {/* ── Hero Section (shader.se style) ── */}
        <section ref={heroRef} style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '0 64px', position: 'relative',
        }}>
          <div style={{ maxWidth: '600px', transform: `translateY(${scrollY * -0.15}px)` }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              padding: '6px 16px', borderRadius: '20px',
              fontSize: '12px', fontWeight: 700, color: '#fca5a5',
              marginBottom: '32px', letterSpacing: '1px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
              NETWORK ACTIVE
            </div>

            <h1 style={{
              fontSize: 'clamp(48px, 7vw, 86px)', fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-3px', marginBottom: '28px',
              color: '#e8d5b5',
              textShadow: '0 0 80px rgba(239, 68, 68, 0.3), 0 0 160px rgba(168, 85, 247, 0.15)',
            }}>
              A Protective Intelligence Grid, Wired into the Future
            </h1>
            
            <p style={{
              fontSize: '17px', color: '#a3a3a3', lineHeight: 1.7, marginBottom: '40px', maxWidth: '480px'
            }}>
              Scroll to Inspect Our Closed Incidents
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/login" style={{
                background: '#ef4444', color: '#fff', textDecoration: 'none',
                padding: '16px 36px', borderRadius: '8px',
                fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px',
                boxShadow: '0 0 40px rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                Launch Console <ArrowRight size={18} />
              </Link>
              <Link to="/contact" style={{
                color: '#a3a3a3', textDecoration: 'none', fontSize: '15px', fontWeight: 600,
                padding: '16px 24px', borderRadius: '8px',
                border: '1px solid #333', transition: 'all 0.3s',
              }}>
                Request Access
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section style={{ padding: '120px 64px', position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px',
              color: '#e8d5b5', textShadow: '0 0 60px rgba(239,68,68,0.2)'
            }}>
              Core Capabilities
            </h2>
            <p style={{ color: '#737373', fontSize: '16px', marginBottom: '64px', maxWidth: '500px' }}>
              Built for enterprise-grade emergency management with cutting-edge AI and real-time telemetry.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} style={{
                    background: 'rgba(20,20,20,0.6)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px', padding: '40px',
                    transition: 'all 0.4s ease', cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '12px',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '24px',
                    }}>
                      <Icon size={22} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                    <p style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section style={{
          padding: '120px 64px', textAlign: 'center',
          background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.05) 0%, transparent 60%)',
        }}>
          <h2 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-2px', color: '#e8d5b5' }}>
            Ready to Deploy?
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '17px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            Get started with the Rakshak emergency intelligence platform today.
          </p>
          <Link to="/login" style={{
            background: '#ef4444', color: '#fff', textDecoration: 'none',
            padding: '18px 48px', borderRadius: '8px', fontSize: '16px', fontWeight: 700,
            boxShadow: '0 0 50px rgba(239,68,68,0.3)',
            display: 'inline-flex', alignItems: 'center', gap: '10px',
          }}>
            Access Command Center <ArrowRight size={18} />
          </Link>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          padding: '48px 64px', borderTop: '1px solid #1a1a1a',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="#ef4444" />
            <span style={{ fontWeight: 800, fontSize: '16px' }}>RAK<span style={{ color: '#ef4444' }}>SHAK</span></span>
          </div>
          <p style={{ color: '#525252', fontSize: '13px' }}>© 2026 Rakshak Intelligence Grid. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
