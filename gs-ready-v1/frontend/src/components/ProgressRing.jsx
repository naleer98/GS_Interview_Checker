import React from 'react';
export default function ProgressRing({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="ring" style={{ '--value': `${safe * 3.6}deg` }}>
      <div><strong>{safe}%</strong><span>READY</span></div>
    </div>
  );
}
