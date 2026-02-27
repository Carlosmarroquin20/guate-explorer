import type { Place } from '../../types';
import { TOUR_INTERVAL_MS, TOUR_RING_CIRCUMFERENCE } from '../../hooks/useTour';
import './TourControls.css';

interface TourControlsProps {
  active: boolean;
  index: number;
  total: number;
  currentPlace: Place | null;
  onStart: () => void;
  onStop: () => void;
  onNext: () => void;
}

export default function TourControls({
  active,
  index,
  total,
  currentPlace,
  onStart,
  onStop,
  onNext,
}: TourControlsProps) {
  if (!active) {
    return (
      <button className="tour-start-btn" onClick={onStart} title="Start guided tour">
        <span className="tour-start-icon">▶</span>
        <span>Tour</span>
      </button>
    );
  }

  return (
    <div className="tour-panel" role="status" aria-live="polite">
      {/* SVG progress ring — remounted on each index change to retrigger CSS animation */}
      <div className="tour-ring-wrap" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40">
          {/* Track */}
          <circle
            cx="20" cy="20" r="14"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="3"
          />
          {/* Draining progress arc */}
          <circle
            key={index}
            cx="20" cy="20" r="14"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={TOUR_RING_CIRCUMFERENCE}
            strokeDashoffset={0}
            transform="rotate(-90 20 20)"
            className="tour-progress-arc"
            style={{ '--tour-ms': `${TOUR_INTERVAL_MS}ms` } as React.CSSProperties}
          />
        </svg>
        <span className="tour-counter">{index + 1}/{total}</span>
      </div>

      {/* Current place name */}
      {currentPlace && (
        <span className="tour-place-name">{currentPlace.name}</span>
      )}

      {/* Controls */}
      <div className="tour-btns">
        <button
          className="tour-btn"
          onClick={onNext}
          title="Skip to next place"
          aria-label="Next place"
        >
          ⏭
        </button>
        <button
          className="tour-btn tour-btn--stop"
          onClick={onStop}
          title="Stop tour"
          aria-label="Stop tour"
        >
          ⏹
        </button>
      </div>
    </div>
  );
}
