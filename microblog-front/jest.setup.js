import '@testing-library/jest-dom';
import { act } from 'react'; // Use React's act, not react-dom's

// Ensure stable test environment
global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock Next Router
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '',
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Socket.io client
jest.mock('socket.io-client', () => {
  const mockOn = jest.fn();
  const mockOff = jest.fn();
  const mockEmit = jest.fn();
  const mockDisconnect = jest.fn();
  
  return {
    io: jest.fn(() => ({
      on: mockOn,
      off: mockOff,
      emit: mockEmit,
      disconnect: mockDisconnect,
      connect: jest.fn(),
    })),
  };
});

// Fix: Remove incorrect service API mocking from setup file
// Individual tests should mock this as needed

// Mock window.confirm
global.confirm = jest.fn(() => true);

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Filter out noisy console messages
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out common testing warnings
  const ignored = [
    'not wrapped in act',
    'The current testing environment is not configured',
    'overlapping act',
    'ReactDOMTestUtils.act is deprecated',
    'is deprecated in favor of `React.act`'
  ];
  
  if (args[0] && typeof args[0] === 'string' && ignored.some(msg => args[0].includes(msg))) {
    return;
  }
  originalConsoleError(...args);
};

const originalConsoleLog = console.log;
console.log = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Connecting to socket server')) {
    return;
  }
  originalConsoleLog(...args);
};

// Ensure each test has clean starting state
beforeEach(() => {
  jest.clearAllMocks();
});
