export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '60vh', gap: '16px',
    }}>
      <div className="spinner" />
      <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{text}</p>
    </div>
  );
}