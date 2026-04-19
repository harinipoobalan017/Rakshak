import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = { low: '#22c55e', medium: '#eab308', high: '#ef4444', critical: '#8b5cf6' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '12px 16px',
    }}>
      <p style={{ color: 'var(--text)', fontWeight: 600 }}>{payload[0].name}</p>
      <p style={{ color: 'var(--muted2)', fontSize: '13px' }}>Count: {payload[0].value}</p>
    </div>
  );
};

export default function SeverityChart({ data = [] }) {
  const chartData = data.map(d => ({ name: d.severity, value: Number(d.count) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#888'} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: 'var(--muted2)', fontSize: '12px', textTransform: 'capitalize' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}