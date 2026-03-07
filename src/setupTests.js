// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Web Audio API — not available in JSDOM
const mockGainNode = () => ({
  gain: { value: 0, setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
  connect: jest.fn(),
});
const mockOscillator = () => ({
  type: '',
  frequency: { setValueAtTime: jest.fn() },
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
});
window.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn().mockImplementation(mockOscillator),
  createGain: jest.fn().mockImplementation(mockGainNode),
  destination: {},
  currentTime: 0,
}));
window.webkitAudioContext = window.AudioContext;

// Suppress window.alert (used by DnD dice roll easter egg)
window.alert = jest.fn();
