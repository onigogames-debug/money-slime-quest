import React from 'react';
import { GlassCard } from './UIComponents';
import SlimeSVG from './SlimeSVG';

const StageClearModal = ({ stage, title, onNext }) => {
  return (
    <div className="result-overlay" style={{ background: 'rgba(0, 5, 20, 0.85)' }}>
      <div className="result-card" style={{ maxWidth: '400px', width: '90%' }}>
        <GlassCard style={{ padding: '3rem 2rem', textAlign: 'center', border: '2px solid #ffd700', boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <div className="pulse-ring" style={{ position: 'absolute', inset: -20, border: '2px solid #ffd700', borderRadius: '50%' }} />
            <div className="slime-bounce">
              <SlimeSVG level={stage * 10} size={120} />
            </div>
          </div>

          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.8rem', color: '#ffd700', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            {stage === 12 ? 'ULTIMATE EVOLUTION COMPLETED!' : 'CONGRATULATIONS!'}
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
            {stage === 12 ? 'ULTIMATE HERO BORN' : `STAGE ${stage} CLEAR`}
          </h2>
          
          <div style={{ fontSize: '1.1rem', color: '#00f5ff', fontWeight: 700, marginBottom: '2rem' }}>
            {stage === 12 ? 'マネーヒーロースライム' : title}
          </div>

          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            {stage === 12 ? (
              <>
                ついに、全ての試練を乗り越えました！<br />
                あなたの深遠なるマネー知識により、<br />
                スライムは伝説の「マネーヒーロースライム」へと進化しました。
              </>
            ) : (
              <>
                素晴らしい功績です！<br />
                あなたのマネー知識は新たな次元へと到達し、<br />
                スライムも更なる進化を遂げました。
              </>
            )}
          </p>

          <button 
            className="next-btn" 
            onClick={onNext}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #ffd700, #ff9a00)', 
              color: '#1a0a00',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
              fontWeight: 900,
              letterSpacing: '0.1em'
            }}
          >
            {stage === 12 ? '伝説の勇者として生きる' : '冒険を続ける'}
          </button>
        </GlassCard>
      </div>
      
      {/* Decorative particles */}
      <div className="particle" style={{ left: '10%', top: '20%', animationDelay: '0s' }} />
      <div className="particle" style={{ left: '80%', top: '15%', animationDelay: '0.5s' }} />
      <div className="particle" style={{ left: '25%', top: '70%', animationDelay: '1s' }} />
      <div className="particle" style={{ left: '70%', top: '80%', animationDelay: '1.5s' }} />
    </div>
  );
};

export default StageClearModal;
