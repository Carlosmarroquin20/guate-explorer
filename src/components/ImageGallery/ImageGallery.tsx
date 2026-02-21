import { useState, useEffect } from 'react';
import { useWikimediaImages } from '../../hooks/useWikimediaImages';
import './ImageGallery.css';

interface ImageGalleryProps {
  query: string;
}

export default function ImageGallery({ query }: ImageGalleryProps) {
  const { images, loading, error } = useWikimediaImages(query, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);

  // Reset to first image when place changes
  useEffect(() => {
    setCurrentIndex(0);
    setImgLoading(true);
  }, [query]);

  const goToPrevious = () => {
    setImgLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setImgLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="gallery-placeholder">
        <div className="loader-spinner" />
        <p>Loading photos…</p>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="gallery-placeholder">
        <span className="gallery-placeholder-icon">🏔️</span>
        <p>No photos available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="gallery">
      <div className="gallery-main">
        {imgLoading && (
          <div className="gallery-loader">
            <div className="loader-spinner" />
          </div>
        )}
        <img
          key={currentImage.url}
          src={currentImage.url}
          alt={currentImage.alt}
          className={`gallery-image ${imgLoading ? 'loading' : ''}`}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        />

        {images.length > 1 && (
          <>
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
          </>
        )}

        <div className="gallery-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="gallery-caption-row">
        <p className="gallery-caption">{currentImage.alt}</p>
        {currentImage.sourceUrl && (
          <a
            href={currentImage.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-source-link"
            title="View on Wikimedia Commons"
          >
            © Wikimedia
          </a>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.url}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setImgLoading(true);
                setCurrentIndex(index);
              }}
            >
              <img src={image.url} alt={image.alt} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
