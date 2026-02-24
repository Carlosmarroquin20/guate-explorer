import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { PlaceImage } from '../../types';
import './Lightbox.css';

interface LightboxProps {
  images: PlaceImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Focus close button on mount for keyboard accessibility
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Reset loading state when image changes
  useEffect(() => {
    setImgLoaded(false);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  const image = images[currentIndex];
  const hasMultiple = images.length > 1;

  return createPortal(
    <div
      className="lb-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close */}
      <button
        ref={closeRef}
        className="lb-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Counter */}
      {hasMultiple && (
        <div className="lb-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {hasMultiple && (
        <button
          className="lb-nav lb-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Image wrapper */}
      <div className="lb-content" onClick={(e) => e.stopPropagation()}>
        {!imgLoaded && (
          <div className="lb-spinner-wrap">
            <div className="lb-spinner" />
          </div>
        )}
        <img
          src={image.url}
          alt={image.alt}
          className={`lb-image ${imgLoaded ? 'lb-image--loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />
        <div className="lb-footer">
          <p className="lb-caption">{image.alt}</p>
          {image.sourceUrl && (
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lb-source"
              onClick={(e) => e.stopPropagation()}
            >
              © Wikimedia
            </a>
          )}
        </div>
      </div>

      {/* Next */}
      {hasMultiple && (
        <button
          className="lb-nav lb-next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>,
    document.body
  );
}
