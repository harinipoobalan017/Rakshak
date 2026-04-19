import PublicNav from '../../components/shared/PublicNav';
import ThreeBackground from '../../components/3D/ThreeBackground';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <ThreeBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PublicNav />
        <main style={{ padding: '80px 48px', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-2px', color: '#e8d5b5', textShadow: '0 0 60px rgba(239,68,68,0.2)' }}>
            Get in Touch
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '18px', marginBottom: '48px' }}>
            Have questions about deploying Rakshak in your municipality? Our team is ready to help.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Contact Form */}
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#737373', fontWeight: 600, letterSpacing: '0.5px' }}>NAME</label>
                <input type="text" placeholder="Enter your name" style={{ background: 'rgba(20,20,20,0.8)', border: '1px solid #262626', color: '#fff', padding: '16px', borderRadius: '10px', width: '100%', outline: 'none', fontSize: '14px', fontFamily: 'Inter', transition: 'border-color 0.3s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#ef4444'}
                  onBlur={e => e.currentTarget.style.borderColor = '#262626'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#737373', fontWeight: 600, letterSpacing: '0.5px' }}>EMAIL</label>
                <input type="email" placeholder="Enter your email" style={{ background: 'rgba(20,20,20,0.8)', border: '1px solid #262626', color: '#fff', padding: '16px', borderRadius: '10px', width: '100%', outline: 'none', fontSize: '14px', fontFamily: 'Inter', transition: 'border-color 0.3s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#ef4444'}
                  onBlur={e => e.currentTarget.style.borderColor = '#262626'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#737373', fontWeight: 600, letterSpacing: '0.5px' }}>MESSAGE</label>
                <textarea rows={5} placeholder="How can we help you?" style={{ background: 'rgba(20,20,20,0.8)', border: '1px solid #262626', color: '#fff', padding: '16px', borderRadius: '10px', width: '100%', outline: 'none', fontSize: '14px', fontFamily: 'Inter', resize: 'vertical', transition: 'border-color 0.3s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#ef4444'}
                  onBlur={e => e.currentTarget.style.borderColor = '#262626'}
                />
              </div>
              <button type="button" style={{
                background: '#ef4444', color: '#fff', border: 'none',
                padding: '16px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 0 30px rgba(239,68,68,0.2)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Send Message
              </button>
            </form>

            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '8px' }}>
              {[
                { icon: Mail, label: 'Email', value: 'ops@rakshak.network' },
                { icon: Phone, label: 'Command Line', value: '+91 80 1234 5678' },
                { icon: MapPin, label: 'Headquarters', value: 'Bangalore, Karnataka, India' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{
                    background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
                    padding: '24px', display: 'flex', alignItems: 'center', gap: '16px',
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="#ef4444" />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#525252', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.5px' }}>{item.label}</p>
                      <p style={{ fontSize: '15px', fontWeight: 600 }}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
