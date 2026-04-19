import { useState, useEffect } from 'react';
import { Cpu, Activity, Zap, Server } from 'lucide-react';

export default function AIAnalysisWidget({ incidents }) {
  const [analyzing, setAnalyzing] = useState(true);
  
  useEffect(() => {
    // Simulate AI analysis delay
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, [incidents]);

  const criticalCount = incidents.filter(i => i.severity === 'critical').length;
  const threatLevel = criticalCount > 2 ? 'SEVERE' : criticalCount > 0 ? 'ELEVATED' : 'NOMINAL';
  const threatColor = criticalCount > 2 ? '#ef4444' : criticalCount > 0 ? '#f97316' : '#22c55e';

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(17,24,39,0.7), rgba(8,11,20,0.9))',
      border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: '16px', padding: '20px',
      boxShadow: '0 10px 30px rgba(139,92,246,0.1) inset',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.1,
        backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        animation: 'panGrid 20s linear infinite',
      }} />

      <style>{`
        @keyframes panGrid {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        .ai-pulse {
          animation: aiPulse 2s infinite ease-in-out;
        }
        @keyframes aiPulse {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 10px rgba(139,92,246,0.2); }
          50% { opacity: 1; box-shadow: 0 0 20px rgba(139,92,246,0.6); }
        }
        .typing-text::after {
          content: '|'; animation: blink 1s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}>
          <Cpu size={16} className="ai-pulse" /> RAKSHAK-AI ORACLE
        </h3>
        <div style={{ fontSize: '11px', background: 'rgba(139,92,246,0.15)', padding: '4px 10px', borderRadius: '12px', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}>
          v2.4 ONLINE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> THREAT LEVEL
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: threatColor, textShadow: `0 0 10px ${threatColor}80` }}>
            {threatLevel}
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Server size={12} /> SYSTEM LOAD
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6', textShadow: '0 0 10px rgba(59,130,246,0.5)' }}>
            {Math.floor(Math.random() * 20 + 20)}% <span style={{ fontSize: '10px', color: 'var(--muted)' }}>STABLE</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(139,92,246,0.05)', borderRadius: '8px', borderLeft: '3px solid #8b5cf6', fontSize: '12px', color: '#e2e8f0', fontFamily: 'monospace', minHeight: '60px' }}>
        {analyzing ? (
          <span className="typing-text" style={{ color: '#a78bfa' }}>Analyzing telemetry data and incoming incident reports...</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#22c55e' }}>&gt; Scan complete.</span>
            <span>&gt; {incidents.length} active anomalies detected.</span>
            {criticalCount > 0 && <span style={{ color: '#ef4444' }}>&gt; WARNING: {criticalCount} critical vectors require immediate response.</span>}
            <span style={{ color: '#8b5cf6' }}>&gt; Routing predictive deployment models...</span>
          </div>
        )}
      </div>
    </div>
  );
}
