import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_CONFIGS = [
  { key: 'hr',   label: 'Heart Rate',   color: '#FF7070', unit: 'bpm' },
  { key: 'spo2', label: 'SpO₂',         color: '#00E5A0', unit: '%'   },
  { key: 'rr',   label: 'Resp Rate',    color: '#00BFFF', unit: '/min' },
];

const VitalsChart = ({ history = [] }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
      Vitals Trend — Today
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      {CHART_CONFIGS.map(({ key, label, color, unit }) => (
        <div key={key}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
            {label} <span style={{ color: 'var(--text-muted)' }}>({unit})</span>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={history}>
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#0D1321', border: `1px solid ${color}30`, borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: 'var(--text-secondary)' }}
                itemStyle={{ color }}
              />
              <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  </div>
);

export default VitalsChart;