import React from 'react';
import { GlassCard, NeonDivider } from './UIComponents';

const SessionResult = ({ score, total, stage, set, onNext, onReplay, onMap, nextSession }) => {
  const pct = Math.round((score / total) * 100);
  const grade = pct === 100 ? 'S' : pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
  const gc = { S: '#ffd700', A: '#00ff88', B: '#00f5ff', C: '#a78bfa', D: '#ff4466' }[grade];
  const messages = {
    S: '完璧！マネーマスター！',
    A: '素晴らしい！一流の実力！',
    B: 'なかなかやるね。',
    C: 'まだまだ修行が必要だ！',
    D: 'ゼロから学び直しだ！',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <GlassCard style={{ padding: '2rem 1.5rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
          STAGE {stage} · SET {set} COMPLETE
        </div>
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '4.5rem', fontWeight: 900, color: gc, textShadow: `0 0 20px ${gc}, 0 0 40px ${gc}80`, lineHeight: 1, marginBottom: '0.25rem' }}>{grade}</div>
        <NeonDivider />
        <div style={{ margin: '1rem 0' }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #00f5ff, #bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {score}<span style={{ fontSize: '1rem' }}>/{total}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>正解率 {pct}%</div>
        </div>
        <NeonDivider />
        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '1rem', lineHeight: 1.6 }}>
          {messages[grade]}
        </p>
      </GlassCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {nextSession && (
          <button className="next-btn" onClick={onNext} style={{ padding: '0.9rem' }}>
            → STAGE {nextSession.stage} · SET {nextSession.set}
          </button>
        )}
        <button onClick={onReplay} style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.25)', borderRadius: '1rem', padding: '0.75rem', fontFamily: "'Orbitron', monospace", fontSize: '0.72rem', color: '#00f5ff', cursor: 'pointer', letterSpacing: '0.08em' }}>
          ↺ REPLAY SET
        </button>
        <button onClick={onMap} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '0.75rem', fontFamily: "'Orbitron', monospace", fontSize: '0.72rem', color: '#64748b', cursor: 'pointer', letterSpacing: '0.08em' }}>
          ⬡ WORLD MAP
        </button>
      </div>
    </div>
  );
};

export default SessionResult;
