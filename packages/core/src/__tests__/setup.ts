import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  // Reset any global state before each test
  global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  };
});