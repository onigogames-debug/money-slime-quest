import React from 'react';

export const GlassCard = ({ children, style, className = '' }) => (
  <div className={`glass-card ${className}`} style={style}>{children}</div>
);

export const NeonDivider = () => <div className="neon-divider" />;

export const LETTERS = ['A', 'B', 'C', 'D'];
