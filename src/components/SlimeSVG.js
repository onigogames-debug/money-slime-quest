import React from 'react';

const SLIME_COLORS = [
  { body: '#00d4ff', eye: '#003366', shine: '#80eeff' },
  { body: '#7c3aed', eye: '#1a003f', shine: '#c4b5fd' },
  { body: '#10b981', eye: '#052e16', shine: '#6ee7b7' },
  { body: '#f59e0b', eye: '#451a03', shine: '#fde68a' },
  { body: '#ef4444', eye: '#450a0a', shine: '#fca5a5' },
  { body: '#ec4899', eye: '#4a001f', shine: '#fbcfe8' },
  { body: '#8b5cf6', eye: '#2e1065', shine: '#ddd6fe' },
  { body: '#14b8a6', eye: '#042f2e', shine: '#99f6e4' },
  { body: '#f97316', eye: '#431407', shine: '#fed7aa' },
  { body: '#06b6d4', eye: '#083344', shine: '#a5f3fc' },
  { body: '#84cc16', eye: '#1a2e05', shine: '#d9f99d' },
  { body: '#ffd700', eye: '#3d2400', shine: '#fef9c3' },
];

const SlimeSVG = ({ level = 0, size = 80 }) => {
  const isHero = level >= 120;
  
  // Color changes every 10 levels (Stage-based)
  const colorIdx = Math.floor(level / 10);
  const c = SLIME_COLORS[Math.min(colorIdx, 11)];
  
  // Linear scale growth: Level 0 (0.8) to Level 120 (1.6)
  const scale = 0.8 + (Math.min(level, 120) * (0.8 / 120));
  
  // Multi-tiered aura
  const auraTier = level < 40 ? 0 : level < 80 ? 1 : level < 110 ? 2 : level < 120 ? 3 : 4;
  const showAura = auraTier > 0;

  // 5-level shape variability
  const shapeIdx = Math.floor(Math.min(level, 115) / 5);
  const topY = 18 - (shapeIdx * 0.25); // Slime gets taller as it grows
  const sideW = 15 + (shapeIdx * 0.15); // Slime gets slightly Fuller
  const curveY = 30 - (shapeIdx * 0.1);

  // Hero stance for level 120
  const heroPath = "M20,60 Q15,25 50,12 Q85,25 80,60 Q78,85 70,92 Q50,98 30,92 Q22,85 20,60 Z";
  const standardPath = `M20,60 Q${sideW},${curveY} 50,${topY} Q${100-sideW},${curveY} 80,60 Q75,85 65,90 Q50,95 35,90 Q25,85 20,60 Z`;
  const pathD = isHero ? heroPath : standardPath;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showAura && (
        <div style={{
          position: 'absolute',
          width: auraTier === 1 ? '110%' : auraTier === 2 ? '130%' : auraTier === 3 ? '150%' : '180%',
          height: auraTier === 1 ? '110%' : auraTier === 2 ? '130%' : auraTier === 3 ? '150%' : '180%',
          background: auraTier === 4 
            ? `radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(0,245,255,0.3) 40%, transparent 70%)`
            : `radial-gradient(circle, ${c.body}${auraTier === 1 ? '20' : auraTier === 2 ? '40' : '60'} 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: `pulse-ring ${auraTier >= 3 ? '1.5s' : '2.5s'} infinite`,
          zIndex: 0,
          border: auraTier >= 3 ? '1px solid rgba(255, 215, 0, 0.3)' : 'none',
          boxShadow: auraTier === 4 ? '0 0 50px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(0, 245, 255, 0.4)' : auraTier === 3 ? '0 0 30px rgba(255, 215, 0, 0.4)' : 'none'
        }} />
      )}
      <svg 
        viewBox="0 0 100 100" 
        width={size * scale * (isHero ? 0.95 : 0.9)} 
        height={size * scale * (isHero ? 0.95 : 0.9)} 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          position: 'relative', 
          zIndex: 1, 
          filter: showAura ? `drop-shadow(0 0 ${auraTier * 8}px ${auraTier === 4 ? '#ffd700' : c.shine}80)` : 'none',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <defs>
          <radialGradient id={`sg${level}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={isHero ? '#fffce0' : c.shine} stopOpacity="0.9" />
            <stop offset={auraTier >= 3 ? "40%" : "60%"} stopColor={c.body} stopOpacity="1" />
            <stop offset="100%" stopColor={c.body} stopOpacity="0.8" />
          </radialGradient>
          <filter id={`gf${level}`}>
            <feGaussianBlur stdDeviation={auraTier >= 3 ? "1.5" : "2.5"} result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Hero Cape */}
        {isHero && (
          <path d="M25,50 Q5,40 2,75 Q15,95 50,98 Q85,95 98,75 Q95,40 75,50" 
            fill="#ef4444" stroke="#991b1b" strokeWidth="1"
            style={{ animation: 'pulse-ring 2s infinite ease-in-out' }}
          />
        )}

        <path d={pathD} fill={`url(#sg${level})`} filter={`url(#gf${level})`} />
        
        {/* Crown */}
        {level >= 110 && (
          <g transform={isHero ? "translate(0, -5) scale(1.1)" : ""}>
            <path d="M35,12 L42,22 L50,12 L58,22 L65,12 L65,25 L35,25 Z" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
            {isHero && <circle cx="50" cy="18" r="2" fill="#ef4444" />}
          </g>
        )}

        {/* Hero Sword & Shield */}
        {isHero && (
          <>
            {/* Sword */}
            <g transform="translate(82, 55) rotate(15)">
              <rect x="-2" y="0" width="4" height="25" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.5" />
              <rect x="-6" y="20" width="12" height="3" rx="1" fill="#ffd700" />
              <rect x="-2" y="23" width="4" height="6" fill="#78350f" />
              <circle cx="0" cy="5" r="1.5" fill="#00f5ff" opacity="0.8" />
            </g>
            {/* Shield */}
            <g transform="translate(18, 70)">
              <circle r="12" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
              <circle r="9" fill="none" stroke="#b8860b" strokeWidth="0.5" strokeDasharray="2 1" />
              <text x="0" y="4" fontSize="10" fontWeight="900" textAnchor="middle" fill="#b8860b" style={{ fontFamily: 'serif' }}>$</text>
            </g>
          </>
        )}

        <ellipse cx="35" cy="32" rx="10" ry="7" fill="white" opacity={0.22 + (auraTier * 0.05)} />
        
        {/* Eyes */}
        {isHero ? (
          <>
            <path d="M30,50 Q38,45 45,52 L42,55 Q35,50 30,52 Z" fill="#1a003f" />
            <path d="M70,50 Q62,45 55,52 L58,55 Q65,50 70,52 Z" fill="#1a003f" />
            <circle cx="38" cy="52" r="2.5" fill="white" />
            <circle cx="62" cy="52" r="2.5" fill="white" />
          </>
        ) : (
          <>
            <ellipse cx="38" cy="52" rx="9" ry="10" fill={c.eye} />
            <ellipse cx="62" cy="52" rx="9" ry="10" fill={c.eye} />
            <circle cx="40" cy="53" r="4" fill="white" />
            <circle cx="64" cy="53" r="4" fill="white" />
          </>
        )}
        
        <circle cx="41" cy="50" r="2" fill="white" opacity="0.9" />
        <circle cx="65" cy="50" r="2" fill="white" opacity="0.9" />
        
        <path d={isHero ? "M42,72 Q50,68 58,72" : "M40,67 Q50,75 60,67"} stroke={isHero ? '#1a003f' : c.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        
        <ellipse cx="32" cy="87" rx="10" ry="6" fill={c.body} opacity="0.7" filter={`url(#gf${level})`} />
        <ellipse cx="68" cy="87" rx="10" ry="6" fill={c.body} opacity="0.7" filter={`url(#gf${level})`} />
      </svg>
    </div>
  );
};

export default SlimeSVG;
