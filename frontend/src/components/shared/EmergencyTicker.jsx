import { AlertTriangle, Info } from 'lucide-react';

export default function EmergencyTicker({ incidents = [] }) {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');

  if (activeIncidents.length === 0) {
    return (
      <div style={{
        background: 'rgba(59,130,246,0.1)',
        borderBottom: '1px solid rgba(59,130,246,0.2)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '13px', color: '#60a5fa', fontWeight: 500
      }}>
        <Info size={16} /> All systems operational. No active emergencies in the area.
      </div>
    );
  }

  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  const isHighAlert = criticalCount > 0;
  const colorBase = isHighAlert ? '239,68,68' : '249,115,22';
  const textColor = isHighAlert ? '#fca5a5' : '#fdba74';

  return (
    <div style={{
      background: `rgba(${colorBase}, 0.1)`,
      borderBottom: `1px solid rgba(${colorBase}, 0.2)`,
      display: 'flex', alignItems: 'stretch',
      height: '40px', overflow: 'hidden',
      color: textColor, fontSize: '13px', fontWeight: 600,
    }}>
      <div style={{
        padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px',
        background: `linear-gradient(90deg, rgba(${colorBase}, 0.3), rgba(${colorBase}, 0.1))`,
        borderRight: `1px solid rgba(${colorBase}, 0.3)`,
        position: 'relative', zIndex: 10, flexShrink: 0,
        textShadow: `0 0 10px rgba(${colorBase}, 0.8)`,
        letterSpacing: '1px'
      }}>
        <AlertTriangle size={16} className={isHighAlert ? 'pulse-icon' : ''} style={{ color: isHighAlert ? '#ef4444' : '#f97316' }} />
        LIVE ALERTS
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div className="ticker-scroll" style={{ display: 'flex', whiteSpace: 'nowrap', position: 'absolute', left: '100%' }}>
          {/* Scroll block 1 */}
          <div style={{ display: 'flex', paddingRight: '50px' }}>
            {activeIncidents.map((inc) => (
              <span key={inc.id} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '40px' }}>
                <span style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px',
                  background: inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#f97316' : '#eab308',
                  boxShadow: `0 0 10px ${inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#f97316' : '#eab308'}`
                }} />
                <span style={{ textTransform: 'uppercase', marginRight: '6px', color: 'white', fontWeight: 700, letterSpacing: '0.5px' }}>{inc.type}</span>
                <span style={{ color: 'var(--muted2)', fontWeight: 500 }}>- {inc.address || 'Location unknown'}</span>
              </span>
            ))}
          </div>
          {/* Scroll block 2 for continuous loop */}
          <div style={{ display: 'flex', paddingRight: '50px' }}>
            {activeIncidents.map((inc) => (
              <span key={`dup-${inc.id}`} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '40px' }}>
                <span style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px',
                  background: inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#f97316' : '#eab308',
                  boxShadow: `0 0 10px ${inc.severity === 'critical' ? '#ef4444' : inc.severity === 'high' ? '#f97316' : '#eab308'}`
                }} />
                <span style={{ textTransform: 'uppercase', marginRight: '6px', color: 'white', fontWeight: 700, letterSpacing: '0.5px' }}>{inc.type}</span>
                <span style={{ color: 'var(--muted2)', fontWeight: 500 }}>- {inc.address || 'Location unknown'}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ticker-scroll {
          animation: scrollTicker ${Math.max(20, activeIncidents.length * 6)}s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scrollTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .pulse-icon {
          animation: iconPulse 1s ease-in-out infinite;
        }
        @keyframes iconPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); filter: drop-shadow(0 0 5px #ef4444); }
        }
      `}</style>
    </div>
  );
}
