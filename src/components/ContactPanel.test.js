import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPanel from './ContactPanel';

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

jest.mock('../utils/sounds', () => ({
  sfx: { nat20: jest.fn() },
}));

global.fetch = jest.fn();

const onClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('ContactPanel — rendering', () => {
  test('renders CONTACT title', () => {
    render(<ContactPanel onClose={onClose} />);
    expect(screen.getByText('══ CONTACT ══')).toBeInTheDocument();
  });

  test('renders name, email, and message fields', () => {
    render(<ContactPanel onClose={onClose} />);
    expect(screen.getByPlaceholderText('your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('say something...')).toBeInTheDocument();
  });

  test('honeypot field exists and is aria-hidden', () => {
    render(<ContactPanel onClose={onClose} />);
    const honeypot = document.querySelector('[name="website"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot.closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  test('BACK button calls onClose', () => {
    render(<ContactPanel onClose={onClose} />);
    fireEvent.click(screen.getByText('▶ BACK'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('SEND IT button is present', () => {
    render(<ContactPanel onClose={onClose} />);
    expect(screen.getByText('▶ SEND IT')).toBeInTheDocument();
  });
});

describe('ContactPanel — bot protection', () => {
  test('blocks submission when filled too quickly (timing check)', () => {
    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));
    // < 3000ms have elapsed since render — fetch must NOT be called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('blocks submission when honeypot is filled', () => {
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1000000)
      .mockReturnValue(1005000);

    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(document.querySelector('[name="website"]'), { target: { value: 'bot' } });
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('ContactPanel — submission', () => {
  function mockTime() {
    const T = 1000000;
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(T)      // useRef(Date.now()) on render
      .mockReturnValue(T + 5000);  // Date.now() inside handleSubmit
  }

  test('shows success screen after successful submit', async () => {
    mockTime();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));

    await waitFor(() =>
      expect(screen.getByText('★ MESSAGE SENT ★')).toBeInTheDocument()
    );
  });

  test('success screen has a CLOSE button that calls onClose', async () => {
    mockTime();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));

    await waitFor(() => screen.getByText('▶ CLOSE'));
    fireEvent.click(screen.getByText('▶ CLOSE'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('shows network error message on fetch failure', async () => {
    mockTime();
    global.fetch.mockRejectedValueOnce(new Error('offline'));

    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));

    await waitFor(() =>
      expect(screen.getByText('Network error. Check your connection.')).toBeInTheDocument()
    );
  });

  test('shows server error message when response is not ok', async () => {
    mockTime();
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rate limit exceeded.' }),
    });

    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));

    await waitFor(() =>
      expect(screen.getByText('Rate limit exceeded.')).toBeInTheDocument()
    );
  });

  test('inputs are disabled while submitting', async () => {
    mockTime();
    // Never resolve so we can observe the submitting state
    global.fetch.mockReturnValueOnce(new Promise(() => {}));

    render(<ContactPanel onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('your name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('say something...'), { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('▶ SEND IT'));

    await waitFor(() =>
      expect(screen.getByPlaceholderText('your name')).toBeDisabled()
    );
  });
});
