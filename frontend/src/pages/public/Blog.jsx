import PublicNav from '../../components/shared/PublicNav';
import ThreeBackground from '../../components/3D/ThreeBackground';

const POSTS = [
  {
    id: 1,
    title: 'The Future of AI in Emergency Dispatch',
    desc: 'Discover how machine learning is predicting incident hotspots before they even occur, allowing for unprecedented response times and smarter resource allocation across urban grids.',
    img: '/assets/blog1.png',
    tag: 'AI / ML',
    date: 'Apr 15, 2026',
  },
  {
    id: 2,
    title: 'Autonomous Drone Surveillance Networks',
    desc: 'Deploying automated drone swarms for real-time aerial reconnaissance in hazardous environments, providing thermal and optical feeds to command centers.',
    img: '/assets/blog2.png',
    tag: 'Drones',
    date: 'Apr 12, 2026',
  },
  {
    id: 3,
    title: 'Understanding Telemetry Data Matrices',
    desc: 'A deep technical dive into the complex data networks and neural pathways powering the Rakshak platform infrastructure at enterprise scale.',
    img: '/assets/blog3.png',
    tag: 'Data Science',
    date: 'Apr 08, 2026',
  },
  {
    id: 4,
    title: 'Next-Gen Responder HUD Systems',
    desc: 'How augmented reality and holographic heads-up displays are transforming the way field responders navigate dangerous situations.',
    img: '/assets/blog4.png',
    tag: 'Hardware',
    date: 'Apr 03, 2026',
  },
];

export default function Blog() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <ThreeBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PublicNav />
        <main style={{ padding: '60px 48px', maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px', color: '#e8d5b5', textShadow: '0 0 60px rgba(239,68,68,0.2)' }}>Latest Updates</h1>
          <p style={{ color: '#737373', fontSize: '16px', marginBottom: '48px' }}>Read about the latest developments in emergency automation technology.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {POSTS.map(post => (
              <article key={post.id} style={{
                background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
                overflow: 'hidden', transition: 'all 0.4s ease', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(239,68,68,0.9)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {post.tag}
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ color: '#525252', fontSize: '12px', marginBottom: '12px', fontWeight: 600 }}>{post.date}</p>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>{post.title}</h2>
                  <p style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: 1.7 }}>{post.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
