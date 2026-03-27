import React from 'react';
import { STAGE_META, isSetCompleted } from '../QuizEngine';
import { GlassCard, NeonDivider } from './UIComponents';

const SetSelect = ({ stage, progress, onSelectSet, onBack }) => {
  const meta = STAGE_META.find(m => m.stage === stage);

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', marginBottom: '1rem', letterSpacing: '0.08em', paddingLeft: 0 }}>
        ← WORLD MAP
      </button>
      <GlassCard style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', color: meta.colorFrom, marginBottom: '4px' }}>STAGE {stage}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.75rem' }}>{meta.title}</div>
        <NeonDivider />
        <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(set => {
            const done = isSetCompleted(progress, stage, set);
            const perfect = progress.perfectSets?.has(`${stage}-${set}`);
            return (
              <button
                key={set}
                onClick={() => onSelectSet(set)}
                style={{
                  background: perfect ? `linear-gradient(135deg, ${meta.colorFrom}40, ${meta.colorTo}40)` : done ? `${meta.colorFrom}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${perfect ? '#ffd700' : done ? meta.colorFrom + '60' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: perfect ? `0 0 8px ${meta.colorFrom}60` : 'none',
                  borderRadius: '0.6rem',
                  padding: '0.5rem 0.25rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = perfect ? '#fff' : meta.colorFrom; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = perfect ? '#ffd700' : done ? meta.colorFrom + '60' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.7rem', fontWeight: 700, color: perfect ? '#ffd700' : done ? meta.colorFrom : '#94a3b8' }}>{set}</div>
                {perfect ? (
                  <div style={{ fontSize: '0.75rem', marginTop: '1px' }}>👑</div>
                ) : done ? (
                  <div style={{ fontSize: '0.6rem', marginTop: '2px', color: meta.colorFrom }}>✓</div>
                ) : (
                  <div style={{ fontSize: '0.6rem', marginTop: '2px', opacity: 0 }}>-</div>
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

export default SetSelect;
