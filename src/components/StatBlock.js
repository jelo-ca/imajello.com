import React from 'react';

function modifier(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function StatBox({ stat }) {
  return (
    <div className="stat-box">
      <div className="stat-name">{stat.name}</div>
      <div className="stat-score">{stat.score}</div>
      <div className="stat-mod">{modifier(stat.score)}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

export default function StatBlock({ stats }) {
  return (
    <div className="panel stat-block-panel">
      <h2 className="panel-title">Ability Scores</h2>
      <div className="stat-grid">
        {stats.map(s => <StatBox key={s.name} stat={s} />)}
      </div>
    </div>
  );
}
