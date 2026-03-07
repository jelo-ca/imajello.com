import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from './ProjectCard';

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

jest.mock('../utils/sounds', () => ({
  sfx: { open: jest.fn(), close: jest.fn() },
}));

const mockProject = {
  name: 'Test Project',
  dates: 'Jan 2025 – Present',
  status: 'Shipped',
  description: 'A test project description.',
  bullets: ['First bullet', 'Second bullet'],
  tech: ['React', 'TypeScript'],
  url: 'https://example.com',
  modes: ['Fullstack'],
};

describe('ProjectCard', () => {
  test('renders project name and dates', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Jan 2025 – Present')).toBeInTheDocument();
  });

  test('renders the status badge', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Shipped')).toBeInTheDocument();
  });

  test('is collapsed by default — description not visible', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.queryByText('A test project description.')).not.toBeInTheDocument();
  });

  test('header button has aria-expanded=false by default', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking header expands the card', () => {
    render(<ProjectCard project={mockProject} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('A test project description.')).toBeInTheDocument();
  });

  test('aria-expanded becomes true when expanded', () => {
    render(<ProjectCard project={mockProject} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  test('shows bullet points when expanded', () => {
    render(<ProjectCard project={mockProject} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('First bullet')).toBeInTheDocument();
    expect(screen.getByText('Second bullet')).toBeInTheDocument();
  });

  test('shows tech tags when expanded', () => {
    render(<ProjectCard project={mockProject} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  test('shows "Visit Site →" link when url is provided', () => {
    render(<ProjectCard project={mockProject} />);
    fireEvent.click(screen.getByRole('button'));
    const link = screen.getByText('Visit Site →');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('hides "Visit Site →" link when url is null', () => {
    render(<ProjectCard project={{ ...mockProject, url: null }} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Visit Site →')).not.toBeInTheDocument();
  });

  test('clicking header again collapses the card', () => {
    render(<ProjectCard project={mockProject} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.queryByText('A test project description.')).not.toBeInTheDocument();
  });

  test('renders without dates when omitted', () => {
    const noDate = { ...mockProject, dates: undefined };
    render(<ProjectCard project={noDate} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  test('renders without status when omitted', () => {
    const noStatus = { ...mockProject, status: undefined };
    render(<ProjectCard project={noStatus} />);
    expect(screen.queryByText('Shipped')).not.toBeInTheDocument();
  });
});
