import React from 'react';
import { render, screen } from '@testing-library/react';
import StatBlock from './StatBlock';

// Scores chosen so each modifier is unique for easy assertion
const mockStats = [
  { name: 'STR', label: 'Python',     score: 18 }, // +4
  { name: 'DEX', label: 'React',      score: 16 }, // +3
  { name: 'CON', label: 'Git',        score: 12 }, // +1
  { name: 'INT', label: 'SQL',        score: 10 }, // +0
  { name: 'WIS', label: 'HTML/CSS',   score: 8  }, // -1
  { name: 'CHA', label: 'Design',     score: 5  }, // -3
];

describe('StatBlock', () => {
  test('renders the panel title', () => {
    render(<StatBlock stats={mockStats} />);
    expect(screen.getByText('Ability Scores')).toBeInTheDocument();
  });

  test('renders all six stat names', () => {
    render(<StatBlock stats={mockStats} />);
    ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].forEach(name =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
  });

  test('renders all stat scores', () => {
    render(<StatBlock stats={mockStats} />);
    [18, 16, 12, 10, 8, 5].forEach(score =>
      expect(screen.getByText(String(score))).toBeInTheDocument()
    );
  });

  test('renders all stat labels', () => {
    render(<StatBlock stats={mockStats} />);
    ['Python', 'React', 'Git', 'SQL', 'HTML/CSS', 'Design'].forEach(label =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );
  });

  test('calculates positive modifiers correctly', () => {
    render(<StatBlock stats={mockStats} />);
    expect(screen.getByText('+4')).toBeInTheDocument(); // 18
    expect(screen.getByText('+3')).toBeInTheDocument(); // 16
    expect(screen.getByText('+1')).toBeInTheDocument(); // 12
    expect(screen.getByText('+0')).toBeInTheDocument(); // 10
  });

  test('calculates negative modifiers correctly', () => {
    render(<StatBlock stats={mockStats} />);
    expect(screen.getByText('-1')).toBeInTheDocument(); // 8
    expect(screen.getByText('-3')).toBeInTheDocument(); // 5
  });

  test('renders one stat-box per stat', () => {
    render(<StatBlock stats={mockStats} />);
    expect(document.querySelectorAll('.stat-box')).toHaveLength(6);
  });

  test('modifier formula: floor((score - 10) / 2)', () => {
    const edgeCases = [
      { name: 'A', label: 'a', score: 1  }, // floor(-4.5) = -5
      { name: 'B', label: 'b', score: 20 }, // floor(5)    = +5
    ];
    render(<StatBlock stats={edgeCases} />);
    expect(screen.getByText('-5')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });
});
