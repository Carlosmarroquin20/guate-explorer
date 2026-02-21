import { useState, useEffect } from 'react';
import type { PlaceImage } from '../types';

interface WikimediaPage {
  title: string;
  imageinfo?: Array<{
    url: string;
    descriptionurl: string;
    extmetadata?: {
      ImageDescription?: { value: string };
      Artist?: { value: string };
    };
  }>;
}

interface WikimediaResponse {
  query?: {
    pages: Record<string, WikimediaPage>;
  };
}

export interface WikimediaImagesState {
  images: PlaceImage[];
  loading: boolean;
  error: string | null;
}

const BASE_URL = 'https://commons.wikimedia.org/w/api.php';

// Strip HTML tags from Wikimedia description strings
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function useWikimediaImages(
  query: string,
  limit = 5
): WikimediaImagesState {
  const [state, setState] = useState<WikimediaImagesState>({
    images: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!query) return;

    setState({ images: [], loading: true, error: null });

    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `${query} Guatemala`,
      gsrnamespace: '6',           // namespace 6 = File:
      gsrlimit: String(limit + 5), // fetch a few extra to filter out bad ones
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiextmetadatafilter: 'ImageDescription|Artist',
      format: 'json',
      origin: '*',
    });

    fetch(`${BASE_URL}?${params}`)
      .then((res) => res.json())
      .then((data: WikimediaResponse) => {
        if (!data.query?.pages) {
          setState({ images: [], loading: false, error: 'No images found' });
          return;
        }

        const pages = Object.values(data.query.pages);
        const images: PlaceImage[] = pages
          .filter((page) => {
            const url = page.imageinfo?.[0]?.url ?? '';
            // Only include common image formats, skip SVG/OGG/etc.
            return /\.(jpg|jpeg|png|webp)$/i.test(url);
          })
          .slice(0, limit)
          .map((page) => {
            const info = page.imageinfo![0];
            const rawDesc =
              info.extmetadata?.ImageDescription?.value ?? page.title.replace('File:', '');
            const artist = info.extmetadata?.Artist?.value;
            const attribution = artist
              ? `© ${stripHtml(artist)} · Wikimedia Commons`
              : 'Wikimedia Commons';

            return {
              url: info.url,
              alt: stripHtml(rawDesc) || page.title.replace('File:', ''),
              attribution,
              sourceUrl: info.descriptionurl,
            };
          });

        setState({ images, loading: false, error: images.length === 0 ? 'No images found' : null });
      })
      .catch(() => {
        setState({ images: [], loading: false, error: 'Failed to load images' });
      });
  }, [query, limit]);

  return state;
}
