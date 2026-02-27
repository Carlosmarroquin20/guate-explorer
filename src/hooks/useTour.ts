import { useState, useEffect, useRef, useCallback } from 'react';
import type { Place } from '../types';

/** Duration each place is shown during the tour (ms) */
export const TOUR_INTERVAL_MS = 7000;

/** Circumference of the SVG progress ring (r=14, 2π×14 ≈ 87.96) */
export const TOUR_RING_CIRCUMFERENCE = 2 * Math.PI * 14;

interface UseTourReturn {
  active: boolean;
  index: number;
  total: number;
  start: () => void;
  stop: () => void;
  next: () => void;
}

export function useTour(
  places: Place[],
  onPlaceChange: (place: Place) => void
): UseTourReturn {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  /**
   * Snapshot of places captured at tour start.
   * Immune to filter changes while the tour is running.
   */
  const tourPlaces = useRef<Place[]>([]);

  /**
   * Keep a stable ref to the callback so the interval closure
   * never captures a stale version.
   */
  const onChangeRef = useRef(onPlaceChange);
  onChangeRef.current = onPlaceChange;

  const stop = useCallback(() => setActive(false), []);

  const advance = useCallback(() => {
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= tourPlaces.current.length) {
        setActive(false);
        return prev;
      }
      onChangeRef.current(tourPlaces.current[next]);
      return next;
    });
  }, []);

  const start = useCallback(() => {
    if (places.length === 0) return;
    tourPlaces.current = [...places];
    setTotal(places.length);
    setIndex(0);
    setActive(true);
    onChangeRef.current(places[0]);
  }, [places]);

  const next = useCallback(() => advance(), [advance]);

  // Start / clear the interval whenever active state changes
  useEffect(() => {
    if (!active) return;
    const id = setInterval(advance, TOUR_INTERVAL_MS);
    return () => clearInterval(id);
  }, [active, advance]);

  return { active, index, total, start, stop, next };
}
