import React, { useState } from 'react';
import SlimeSVG from './SlimeSVG';
import { GlassCard } from './UIComponents';

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="slime-bounce" style={{ marginBottom: '2rem' }}>
        <SlimeSVG level={1} size={120} />
      </div>
      
      <h1 style={{ textAlign: 'center', lineHeight: 1.2, marginBottom: '2rem' }}>
        <span className="neon-text" style={{ fontSize: '2.5rem', fontWeight: 900, display: 'block' }}>MONEY SLIME</span>
        <span className="neon-text-purple" style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.4em' }}>QUEST</span>
      </h1>

      <GlassCard style={{ padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
          お金の知識を身につけ<br/>
          スライムと共に成長する物語。
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#00f5ff', fontFamily: "'Orbitron', monospace", fontWeight: 700 }}>
              PLAYER NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="プレイヤー名を入力"
              maxLength={12}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(0, 245, 255, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.8rem 1rem',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00f5ff';
                e.target.style.boxShadow = '0 0 10px rgba(0,245,255,0.2), inset 0 2px 4px rgba(0,0,0,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              background: name.trim() ? 'linear-gradient(135deg, #00c8ff, #0080ff)' : '#334155',
              color: name.trim() ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transform: name.trim() ? 'scale(1)' : 'scale(0.98)',
              transition: 'all 0.2s ease',
              boxShadow: name.trim() ? '0 4px 15px rgba(0, 200, 255, 0.4)' : 'none',
              marginTop: '0.5rem'
            }}
          >
            冒険をはじめる
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default LoginScreen;
