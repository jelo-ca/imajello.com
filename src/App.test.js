import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('framer-motion', () => {
  const React = require('react');
  const motion = new Proxy({}, {
    get(_, tag) {
      return ({ children, animate, initial, exit, variants, transition, ...props }) =>
        React.createElement(tag, props, children);
    },
  });
  return {
    motion,
    AnimatePresence: ({ children, mode: _ }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock('./utils/sounds', () => ({
  sfx: {
    click: jest.fn(), navHover: jest.fn(), open: jest.fn(), close: jest.fn(),
    toggle: jest.fn(), modeSwitch: jest.fn(), diceRoll: jest.fn(),
    nat20: jest.fn(), konami: jest.fn(),
  },
  setSfxVolume: jest.fn(),
  setMusicVolume: jest.fn(),
  startMusic: jest.fn(),
  stopMusic: jest.fn(),
}));

describe('App — initial render', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Anjoelo Calderon')).toBeInTheDocument();
  });

  test('shows all three mode buttons', () => {
    render(<App />);
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Fullstack')).toBeInTheDocument();
    expect(screen.getByText('Gamedev')).toBeInTheDocument();
  });

  test('AI/ML mode is active by default', () => {
    render(<App />);
    expect(screen.getByText('AI/ML')).toHaveClass('active');
    expect(screen.getByText('Fullstack')).not.toHaveClass('active');
  });

  test('renders Ability Scores panel', () => {
    render(<App />);
    expect(screen.getByText('Ability Scores')).toBeInTheDocument();
  });

  test('renders GPA in header', () => {
    render(<App />);
    expect(screen.getByText(/GPA: 3\.75/)).toBeInTheDocument();
  });

  test('renders all three NAV buttons', () => {
    render(<App />);
    expect(screen.getByText('[START]')).toBeInTheDocument();
    expect(screen.getByText('[CREDITS]')).toBeInTheDocument();
    expect(screen.getByText('[OPTIONS]')).toBeInTheDocument();
  });

  test('renders footer copyright', () => {
    render(<App />);
    expect(screen.getByText(/© \d{4} Anjoelo Calderon/)).toBeInTheDocument();
  });
});

describe('App — mode switching', () => {
  test('switching to Fullstack makes it active', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fullstack'));
    expect(screen.getByText('Fullstack')).toHaveClass('active');
    expect(screen.getByText('AI/ML')).not.toHaveClass('active');
  });

  test('switching to Gamedev makes it active', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Gamedev'));
    expect(screen.getByText('Gamedev')).toHaveClass('active');
  });

  test('Fullstack mode shows Fullstack Developer title', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fullstack'));
    expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
  });

  test('AI/ML mode shows projects tagged AI/ML', () => {
    render(<App />);
    expect(screen.getByText('deanzaexpo.org')).toBeInTheDocument();
  });

  test('Gamedev mode shows Gamedev-specific projects', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Gamedev'));
    expect(screen.getByText('De Anza Game Jam')).toBeInTheDocument();
  });

  test('Gamedev mode hides AI/ML-only projects', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Gamedev'));
    expect(
      screen.queryByText('Pfizer Extern — AI Document Intelligence')
    ).not.toBeInTheDocument();
  });
});

describe('App — panel overlays', () => {
  test('[OPTIONS] opens settings panel', () => {
    render(<App />);
    fireEvent.click(screen.getByText('[OPTIONS]'));
    expect(screen.getByText('══ OPTIONS ══')).toBeInTheDocument();
  });

  test('[START] opens contact panel', () => {
    render(<App />);
    fireEvent.click(screen.getByText('[START]'));
    expect(screen.getByText('══ CONTACT ══')).toBeInTheDocument();
  });

  test('[CREDITS] opens credits panel', () => {
    render(<App />);
    fireEvent.click(screen.getByText('[CREDITS]'));
    expect(screen.getByText('══ CREDITS ══')).toBeInTheDocument();
  });

  test('settings panel closes on RESUME click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('[OPTIONS]'));
    fireEvent.click(screen.getByText('▶ RESUME'));
    expect(screen.queryByText('══ OPTIONS ══')).not.toBeInTheDocument();
  });
});

describe('App — easter eggs', () => {
  test('clicking name triggers dice roll (no crash)', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Anjoelo Calderon'));
  });

  test('clicking GPA shows flash text', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/GPA: 3\.75/));
    expect(screen.getByText('NATURAL 20 ✦')).toBeInTheDocument();
  });

  test('Dungeons & Dragons hobby has a dice button', () => {
    render(<App />);
    expect(screen.getByTitle('Roll a d20')).toBeInTheDocument();
  });
});
