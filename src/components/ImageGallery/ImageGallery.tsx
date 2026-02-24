import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWikimediaImages } from '../../hooks/useWikimediaImages';
import Lightbox from '../Lightbox/Lightbox';
import './ImageGallery.css';

interface ImageGalleryProps {
  query: string;
}

export default function ImageGallery({ query }: ImageGalleryProps) {
  const { t } = useTranslation();
  const { images, loading, error } = useWikimediaImages(query, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setImgLoading(true);
    setLightboxOpen(false);
  }, [query]);

  const goToPrevious = useCallback(() => {
    setImgLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setImgLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Arrow-key navigation for the gallery thumbnail strip (disabled when lightbox is open)
  useEffect(() => {
    if (images.length <= 1 || lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      else if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, lightboxOpen, goToPrevious, goToNext]);

  if (loading) {
    return (
      <div className="gallery-placeholder">
        <div className="loader-spinner" />
        <p>{t('gallery.loading')}</p>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="gallery-placeholder">
        <span className="gallery-placeholder-icon">🏔️</span>
        <p>{t('gallery.noPhotos')}</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
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
            className={`gallery-image gallery-image--clickable ${imgLoading ? 'loading' : ''}`}
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            onClick={() => setLightboxOpen(true)}
          />

          {/* Expand hint — visible on hover */}
          <div className="gallery-expand-hint" aria-hidden="true">⤢</div>

          {images.length > 1 && (
            <>
              <button
                className="gallery-nav gallery-nav-prev"
                onClick={goToPrevious}
                aria-label={t('gallery.prevImage')}
              >
                ‹
              </button>
              <button
                className="gallery-nav gallery-nav-next"
                onClick={goToNext}
                aria-label={t('gallery.nextImage')}
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
              title={t('gallery.viewOnWikimedia')}
            >
              {t('gallery.wikimediaLink')}
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

      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  );
}
