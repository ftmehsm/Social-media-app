import { renderHook, act, waitFor } from '@testing-library/react';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast-forward time but not enough
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast-forward to complete delay
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated'); // Should now be updated
  });

  it('should use custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      },
    );

    rerender({ value: 'updated', delay: 1000 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    rerender({ value: 'first', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({ value: 'third', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('initial'); // Should still be initial

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('third'); // Should be the last value
  });

  it('should work with numbers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 500 },
      },
    );

    rerender({ value: 100, delay: 500 });
    expect(result.current).toBe(0);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(100);
  });

  it('should work with objects', () => {
    const initialObj = { name: 'initial' };
    const updatedObj = { name: 'updated' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 500 },
      },
    );

    rerender({ value: updatedObj, delay: 500 });
    expect(result.current).toBe(initialObj);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(updatedObj);
  });

  it('should use default delay of 250ms when not provided', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'initial' },
      },
    );

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated');
  });
});

