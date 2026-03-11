import React, { useState } from 'react';
import { getNEWS2Risk } from '../../utils/newsScore';

const STATUS_CONFIG = {
  critical:  { label: 'CRITICAL', color: '#FF4C4C', bg: 'rgba(255,76,76,0.1)' },
  'at-risk': { label: 'AT RISK',  color: '#FFB020', bg: 'rgba(255,176,32,0.1)' },
  stable:    { label: 'STABLE',   color: '#00E5A0', bg: 'rgba(0,229,160,0.1)'  },
};

const PatientList = ({ patients = [], selectedId, onSelect }) => {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.ward.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Ward Overview</h2>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{patients.length}</span> patients · 10 Mar 2026
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-blue)', background: 'rgba(0,229,160,0.1)', padding: '3px 8px', borderRadius: 4 }}>
            ● LIVE
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, ID, ward..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '8px 12px 8px 32px', color: 'var(--text-primary)',
              fontSize: 12, outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.3, fontSize: 13 }}>🔍</span>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'critical', 'at-risk', 'stable'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background:  filter === f ? 'rgba(0,229,160,0.12)' : 'transparent',
              border:      `1px solid ${filter === f ? 'rgba(0,229,160,0.4)' : 'var(--border)'}`,
              color:       filter === f ? 'var(--accent-blue)' : 'var(--text-muted)',
              borderRadius: 20, padding: '4px 12px', fontSize: 11,
              fontWeight:  filter === f ? 600 : 400, textTransform: 'capitalize',
            }}>
              {f === 'all' ? `All (${patients.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Patient rows */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 40 }}>
            No patients match your search
          </div>
        )}
        {filtered.map(p => {
          const sc  = STATUS_CONFIG[p.status];
          const risk = getNEWS2Risk(p.newsScore);
          const isSelected = selectedId === p.id;
          return (
            <div key={p.id} onClick={() => onSelect(p.id === selectedId ? null : p.id)} style={{
              padding: '14px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
              background:  isSelected ? 'rgba(0,229,160,0.07)' : 'var(--bg-card)',
              border:      `1px solid ${isSelected ? 'rgba(0,229,160,0.25)' : 'var(--border)'}`,
              transition:  'all 0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.color, boxShadow: `0 0 6px ${sc.color}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    {p.alerts.length > 0 && (
                      <span style={{ background: 'rgba(255,76,76,0.15)', color: '#FF7070', borderRadius: 4, padding: '1px 5px', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                        {p.alerts.length}⚠
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{p.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{p.ward} · Bed {p.bed} · {p.age}y</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ background: sc.bg, color: sc.color, borderRadius: 5, padding: '2px 7px', fontSize: 9, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 5 }}>{sc.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: risk.color, lineHeight: 1 }}>{p.newsScore}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NEWS2</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.diagnosis}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientList;