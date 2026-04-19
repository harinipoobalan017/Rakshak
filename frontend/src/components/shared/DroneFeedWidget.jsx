import { useState, useEffect } from 'react';
import { Camera, Crosshair, Radio } from 'lucide-react';

export default function DroneFeedWidget() {
  const [targetFound, setTargetFound] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetFound(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden',
      position: 'relative', border: '1px solid rgba(139,92,246,0.3)',
      background: '#04070e', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      marginBottom: '20px'
    }}>
      <style>{`
        .drone-scan {
          animation: droneSweep 3s ease-in-out infinite alternate;
        }
        @keyframes droneSweep {
          0% { transform: translateY(0); }
          100% { transform: translateY(180px); }
        }
        .static-noise {
          animation: noiseAnim 0.2s infinite;
        }
        @keyframes noiseAnim {
          0% { transform: translate(0,0); }
          10% { transform: translate(-1%,-1%); }
          20% { transform: translate(1%,1%); }
          30% { transform: translate(-2%,2%); }
          40% { transform: translate(2%,-2%); }
          50% { transform: translate(-1%,1%); }
          60% { transform: translate(1%,-1%); }
          70% { transform: translate(-2%,-2%); }
          80% { transform: translate(2%,2%); }
          90% { transform: translate(-1%,-1%); }
          100% { transform: translate(1%,1%); }
        }
      `}</style>

      {/* Simulated Map / Camera Feed Background */}
      <div className="static-noise" style={{
        position: 'absolute', inset: -10, opacity: 0.15,
        backgroundImage: 'repeating-radial-gradient(circle at 17% 32%, white, black 0.00085px)',
        backgroundSize: '100% 100%'
      }} />

      {/* Grid Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px)',
        backgroundSize: '20px 20px', pointerEvents: 'none'
      }} />

      {/* Scanner Line */}
      <div className="drone-scan" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: '#3b82f6', boxShadow: '0 0 10px #3b82f6, 0 5px 20px rgba(59,130,246,0.5)',
        zIndex: 10
      }} />

      {/* Target Reticle */}
      {targetFound && (
        <div style={{
          position: 'absolute', top: '40%', left: '30%', width: '40px', height: '40px',
          border: '2px solid #ef4444', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'iconPulse 0.5s infinite', zIndex: 5
        }}>
          <Crosshair size={24} color="#ef4444" />
          <div style={{ position: 'absolute', bottom: '-20px', color: '#ef4444', fontSize: '10px', fontWeight: 800, whiteSpace: 'nowrap' }}>
            MOTION DETECTED
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '8px', zIndex: 20 }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(59,130,246,0.3)' }}>
          <Camera size={12} /> DRONE-04 CAM
        </div>
        <div style={{ background: 'rgba(239,68,68,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(239,68,68,0.4)' }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, background: '#ef4444' }} /> REC
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: '8px', zIndex: 20 }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(139,92,246,0.3)' }}>
          <Radio size={12} /> LINK SECURE
        </div>
      </div>
    </div>
  );
}
