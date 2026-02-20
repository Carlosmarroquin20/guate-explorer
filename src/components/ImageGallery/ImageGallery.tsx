import { useState } from 'react';
import type { PlaceImage } from '../../types';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: PlaceImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const goToPrevious = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="gallery">
      <div className="gallery-main">
        {isLoading && (
          <div className="gallery-loader">
            <div className="loader-spinner" />
          </div>
        )}
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className={`gallery-image ${isLoading ? 'loading' : ''}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        <button
          className="gallery-nav gallery-nav-prev"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          className="gallery-nav gallery-nav-next"
          onClick={goToNext}
          aria-label="Next image"
        >
          ›
        </button>

        <div className="gallery-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <p className="gallery-caption">{currentImage.alt}</p>

      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsLoading(true);
              setCurrentIndex(index);
            }}
          >
            <img src={image.url} alt={image.alt} />
          </button>
        ))}
      </div>
    </div>
  );
}
