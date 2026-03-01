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

  const stop = useCallback(() => setActive(false), []);

  /**
   * onPlaceChange is setSelectedPlace from App, which React guarantees is
   * referentially stable — safe to include in deps without causing re-creation.
   */
  const advance = useCallback(() => {
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= tourPlaces.current.length) {
        setActive(false);
        return prev;
      }
      onPlaceChange(tourPlaces.current[next]);
      return next;
    });
  }, [onPlaceChange]);

  const start = useCallback(() => {
    if (places.length === 0) return;
    tourPlaces.current = [...places];
    setTotal(places.length);
    setIndex(0);
    setActive(true);
    onPlaceChange(places[0]);
  }, [places, onPlaceChange]);

  const next = useCallback(() => advance(), [advance]);

  // Start / clear the interval whenever active state changes
  useEffect(() => {
    if (!active) return;
    const id = setInterval(advance, TOUR_INTERVAL_MS);
    return () => clearInterval(id);
  }, [active, advance]);

  return { active, index, total, start, stop, next };
}
