import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreditsPanel from './CreditsPanel';

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
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

const onClose = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe('CreditsPanel', () => {
  test('renders CREDITS title', () => {
    render(<CreditsPanel onClose={onClose} />);
    expect(screen.getByText('══ CREDITS ══')).toBeInTheDocument();
  });

  test('shows COMING SOON placeholder', () => {
    render(<CreditsPanel onClose={onClose} />);
    expect(screen.getByText('COMING SOON')).toBeInTheDocument();
  });

  test('shows fill-in-later subtitle', () => {
    render(<CreditsPanel onClose={onClose} />);
    expect(screen.getByText('[ fill in later ]')).toBeInTheDocument();
  });

  test('BACK button calls onClose', () => {
    render(<CreditsPanel onClose={onClose} />);
    fireEvent.click(screen.getByText('▶ BACK'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('clicking overlay calls onClose', () => {
    render(<CreditsPanel onClose={onClose} />);
    fireEvent.click(document.querySelector('.settings-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
