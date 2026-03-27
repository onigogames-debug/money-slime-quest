import React from 'react';
import { STAGE_META, calcOverallProgress } from '../QuizEngine';
import SlimeSVG from './SlimeSVG';
import { GlassCard } from './UIComponents';

const WorldMap = ({ progress, onSelectStage, onReset }) => {
  const overall = calcOverallProgress(progress.completedSets);
  const totalSets = progress.completedSets.size;

  return (
    <div className="world-map">
      <header style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <SlimeSVG level={totalSets} size={110} />
          <div style={{
            position: 'absolute', bottom: '-4px', right: '-4px',
            background: totalSets >= 120 
              ? 'linear-gradient(135deg, #ffd700, #ff8c00)' 
              : 'linear-gradient(135deg, #00f5ff, #7b00ff)',
            color: 'white', borderRadius: '6px', padding: '2px 6px',
            fontSize: '0.6rem', fontWeight: 900, fontFamily: "'Orbitron', monospace",
            boxShadow: totalSets >= 120 
              ? '0 0 15px rgba(255, 215, 0, 0.6)' 
              : '0 0 10px rgba(0, 245, 255, 0.4)', 
            zIndex: 10
          }}>
            {totalSets >= 120 ? 'HERO MAX' : `Lv.${totalSets}`}
          </div>
        </div>
        <h1 style={{ lineHeight: 1.1, margin: 0 }}>
          <span className="neon-text" style={{ 
            fontSize: totalSets >= 120 ? '1.4rem' : '1.8rem', 
            fontWeight: 900, 
            display: 'block',
            color: totalSets >= 120 ? '#ffd700' : ''
          }}>
            {totalSets >= 120 ? 'マネーヒーロースライム' : 'MONEY SLIME'}
          </span>
          <span className={totalSets >= 120 ? "neon-text" : "neon-text-purple"} style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            letterSpacing: '0.3em',
            color: totalSets >= 120 ? '#ff8c00' : ''
          }}>
            {totalSets >= 120 ? 'QUEST COMPLETE' : 'QUEST'}
          </span>
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <p style={{ fontSize: '0.62rem', color: '#475569', letterSpacing: '0.15em', fontFamily: "'Orbitron', monospace", margin: 0 }}>
            ✦ FINANCIAL KNOWLEDGE RPG ✦
          </p>

          {progress.playerName && (
            <div style={{ 
              padding: '0.25rem 0.75rem', 
              background: totalSets >= 120 ? 'rgba(255,215,0,0.1)' : 'rgba(0,245,255,0.1)', 
              border: `1px solid ${totalSets >= 120 ? 'rgba(255,215,0,0.3)' : 'rgba(0,245,255,0.3)'}`, 
              borderRadius: '9999px', 
              display: 'inline-block' 
            }}>
              <span style={{ fontSize: '0.65rem', color: totalSets >= 120 ? '#ffd700' : '#00f5ff', fontWeight: 600 }}>
                {totalSets >= 120 ? `最強のマネーヒーロー ${progress.playerName}` : `${progress.playerName}の冒険`}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Overall progress card */}
      <GlassCard style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="slime-bounce"><SlimeSVG level={totalSets} size={72} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.7rem', color: '#00f5ff', fontWeight: 700 }}>
                OVERALL PROGRESS
              </span>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', color: '#64748b' }}>
                {progress.completedSets.size}/120
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', height: '10px', overflow: 'hidden', border: '1px solid rgba(0,245,255,0.15)', marginBottom: '6px' }}>
              <div className="progress-bar-inner" style={{ width: `${overall}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: "'Orbitron', monospace" }}>
                ✓ {progress.totalCorrect} / {progress.totalAnswered} correct
              </span>
              <span style={{ fontSize: '0.62rem', color: '#00f5ff', fontFamily: "'Orbitron', monospace" }}>{overall}%</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stage grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
        {STAGE_META.map(({ stage, title, colorFrom, colorTo }) => {
          const completedInStage = Array.from({ length: 10 }, (_, i) => i + 1)
            .filter(s => progress.completedSets.has(`${stage}-${s}`)).length;
          const perfectInStage = Array.from({ length: 10 }, (_, i) => i + 1)
            .filter(s => progress.perfectSets?.has(`${stage}-${s}`)).length;
          const stageComplete = completedInStage === 10;
          const stagePerfect = perfectInStage === 10;
          const locked = stage > 1 && !progress.completedSets.has(`${stage - 1}-1`);

          return (
            <button
              key={stage}
              onClick={() => !locked && onSelectStage(stage)}
              style={{
                background: locked
                  ? 'rgba(15,15,40,0.4)'
                  : `linear-gradient(135deg, ${colorFrom}18, ${colorTo}10)`,
                border: `1px solid ${locked ? 'rgba(255,255,255,0.05)' : colorFrom + '40'}`,
                borderRadius: '1rem',
                padding: '0.85rem 0.75rem',
                textAlign: 'left',
                cursor: locked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: locked ? 0.45 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!locked) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {stagePerfect && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)`, backgroundSize: '300% 300%', animation: 'shimmer 3s infinite linear' }} />
              )}

              {stagePerfect ? (
                <div style={{ position: 'absolute', top: '4px', right: '6px', fontSize: '1rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>👑</div>
              ) : stageComplete ? (
                <div style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '0.7rem' }}>⭐</div>
              ) : null}
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', color: locked ? '#334155' : colorFrom, marginBottom: '3px', letterSpacing: '0.05em' }}>
                STAGE {stage}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: locked ? '#1e293b' : '#e2e8f0', marginBottom: '6px', lineHeight: 1.3 }}>
                {locked ? '🔒 ???' : title}
              </div>
              {!locked && (
                <>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '9999px', height: '4px', overflow: 'hidden', marginBottom: '3px' }}>
                    <div style={{ width: `${(completedInStage / 10) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`, borderRadius: '9999px', boxShadow: `0 0 6px ${colorFrom}80` }} />
                  </div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.55rem', color: '#475569' }}>
                    {completedInStage}/10 sets
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset button */}
      {progress.totalAnswered > 0 && (
        <button
          onClick={() => { if (window.confirm('全てのデータをリセットしますか？')) onReset(); }}
          style={{ display: 'block', margin: '0.5rem auto 0', background: 'none', border: '1px solid rgba(255,68,102,0.3)', borderRadius: '0.5rem', padding: '0.4rem 1rem', color: '#ff4466', fontSize: '0.65rem', fontFamily: "'Orbitron', monospace", cursor: 'pointer', letterSpacing: '0.08em', opacity: 0.6 }}
        >
          ↺ RESET ALL
        </button>
      )}
    </div>
  );
};

export default WorldMap;
