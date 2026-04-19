import PublicNav from '../../components/shared/PublicNav';
import ThreeBackground from '../../components/3D/ThreeBackground';
import { Shield, Target, Users, Globe } from 'lucide-react';

export default function About() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <ThreeBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PublicNav />
        <main style={{ padding: '80px 48px', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-2px', color: '#e8d5b5', textShadow: '0 0 60px rgba(239,68,68,0.2)' }}>
            About Rakshak
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '18px', marginBottom: '64px', lineHeight: 1.8, maxWidth: '700px' }}>
            Rakshak is a next-generation emergency response platform engineered to drastically reduce incident response times
            through AI-driven predictive analytics, real-time GPS telemetry, and automated communication grids.
            Built by a team of engineers who believe that every second counts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '64px' }}>
            {[
              { icon: Shield, title: 'Our Mission', desc: 'To reduce emergency response times by 60% through intelligent automation and predictive dispatch technology.' },
              { icon: Target, title: 'Our Vision', desc: 'A world where every emergency is met with an immediate, coordinated, and data-driven response.' },
              { icon: Users, title: 'Our Team', desc: 'A multidisciplinary team of AI researchers, full-stack engineers, and former first responders.' },
              { icon: Globe, title: 'Our Reach', desc: 'Currently deployed across 12 cities with plans to expand to 50+ municipalities by 2027.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Icon size={20} color="#ef4444" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
