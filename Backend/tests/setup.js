// Test setup file
process.env.NODE_ENV = 'test';

// Suppress console warnings during tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes('deprecated')) {
    return;
  }
  originalConsoleWarn(...args);
};