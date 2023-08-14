import { pauseEvent, stopPropagation } from '../ReactSlider.utils';
import { vi } from 'vitest';

describe('ReactSlider.utils', () => {
  describe('pauseEvent', () => {
    it('prevents default', () => {
      const event = {
        preventDefault: vi.fn(),
      };
      pauseEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('stops propagation', () => {
      const event = {
        stopPropagation: vi.fn(),
      };
      pauseEvent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('returns false for undefined event', () => {
      expect(pauseEvent(undefined)).toBe(false);
    });
  });

  describe('stopPropagation', () => {
    it('stops propagation', () => {
      const event = {
        stopPropagation: vi.fn(),
      };
      stopPropagation(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });
});
