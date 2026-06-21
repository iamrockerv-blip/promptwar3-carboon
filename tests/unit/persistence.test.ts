// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { debouncedLocalStorage } from '@/lib/persistence';

describe('debounced local storage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  it('debounces writes and supports reads and removal', () => {
    debouncedLocalStorage.setItem('carbon', 'first');
    debouncedLocalStorage.setItem('carbon', 'latest');

    expect(localStorage.getItem('carbon')).toBeNull();
    vi.advanceTimersByTime(300);
    expect(debouncedLocalStorage.getItem('carbon')).toBe('latest');

    debouncedLocalStorage.removeItem('carbon');
    expect(debouncedLocalStorage.getItem('carbon')).toBeNull();
  });

  it('does not crash when browser storage rejects a write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    expect(() => {
      debouncedLocalStorage.setItem('carbon', 'value');
      vi.advanceTimersByTime(300);
    }).not.toThrow();
  });
});
