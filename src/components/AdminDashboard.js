import React from 'react';
import { GlassCard, NeonDivider } from './UIComponents';
import { calcOverallProgress } from '../QuizEngine';
import SlimeSVG from './SlimeSVG';

const AdminDashboard = ({ allAccounts, activeName, onSwitch, onDelete, onBack }) => {
  const sortedAccounts = [...allAccounts].sort((a, b) => b.totalCorrect - a.totalCorrect);

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'rgba(30, 41, 59, 0.5)', 
            border: '1px solid rgba(148, 163, 184, 0.2)', 
            color: '#94a3b8', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontFamily: "'Orbitron', monospace"
          }}
        >
          ← EXIT
        </button>
        <h2 className="neon-text" style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, letterSpacing: '0.2em' }}>
          ADMIN DASHBOARD
        </h2>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Summary Stats */}
        <GlassCard style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>TOTAL USERS</div>
            <div style={{ fontSize: '1.5rem', color: '#00f5ff', fontWeight: 800 }}>{allAccounts.length}</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.25rem' }}>AVG PROGRESS</div>
            <div style={{ fontSize: '1.5rem', color: '#00f5ff', fontWeight: 800 }}>
              {allAccounts.length > 0 
                ? Math.round(allAccounts.reduce((acc, p) => acc + calcOverallProgress(p.completedSets), 0) / allAccounts.length)
                : 0}%
            </div>
          </div>
        </GlassCard>

        {/* User List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, fontFamily: "'Orbitron', monospace" }}>USER REGISTRY</span>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>Sorted by Score</span>
          </div>

          {sortedAccounts.map((account) => {
            const progress = calcOverallProgress(account.completedSets);
            const isActive = account.playerName === activeName;
            const level = account.completedSets.size;
            
            return (
              <GlassCard 
                key={account.playerName} 
                style={{ 
                  padding: '1rem', 
                  border: isActive ? '1px solid rgba(0, 245, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isActive ? '0 0 15px rgba(0, 245, 255, 0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px' }}>
                    <SlimeSVG level={level} size={40} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isActive ? '#00f5ff' : 'white' }}>
                        {account.playerName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {account.totalCorrect} Correct
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#64748b', marginBottom: '0.2rem' }}>
                        <span>PROGRESS</span>
                        <span>{progress}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${progress}%`, 
                            background: 'linear-gradient(90deg, #00c8ff, #0080ff)',
                            boxShadow: '0 0 8px rgba(0, 200, 255, 0.5)'
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                  {!isActive && (
                    <button 
                      onClick={() => onSwitch(account.playerName)}
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid #00c8ff', 
                        color: '#00c8ff', 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '0.4rem', 
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      SWITCH
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (window.confirm(`${account.playerName}を削除しますか？`)) {
                        onDelete(account.playerName);
                      }
                    }}
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid rgba(239, 68, 68, 0.3)', 
                      color: 'rgba(239, 68, 68, 0.7)', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '0.4rem', 
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </GlassCard>
            );
          })}

          {sortedAccounts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#475569', fontSize: '0.9rem' }}>
              No accounts registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
