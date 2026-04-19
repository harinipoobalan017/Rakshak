import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TYPE_COLORS = {
  fire: '#ef4444',
  accident: '#f97316',
  medical: '#3b82f6',
  flood: '#06b6d4',
  other: '#8b5cf6',
};

export default function HeatmapWidget({ data = [] }) {
  const chartData = data.map(d => ({ name: d.type, value: Number(d.count) }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 12 }} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '10px', color: 'var(--text)',
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || '#8b5cf6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}