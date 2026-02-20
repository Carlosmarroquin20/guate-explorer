import { DivIcon } from 'leaflet';
import type { Category } from '../types';

const CATEGORY_COLORS: Record<Category, string> = {
  archaeological: '#8B4513',
  volcano: '#DC2626',
  lake: '#0EA5E9',
  nature: '#16A34A',
  colonial: '#9333EA',
  beach: '#F59E0B',
  cave: '#475569',
};

const CATEGORY_ICONS: Record<Category, string> = {
  archaeological: '🏛️',
  volcano: '🌋',
  lake: '💧',
  nature: '🌿',
  colonial: '⛪',
  beach: '🏖️',
  cave: '🕳️',
};

export function getCategoryColor(category: Category): string {
  return CATEGORY_COLORS[category];
}

export function getCategoryIcon(category: Category): string {
  return CATEGORY_ICONS[category];
}

export function createCategoryIcon(category: Category): DivIcon {
  const color = CATEGORY_COLORS[category];
  const emoji = CATEGORY_ICONS[category];

  return new DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">${emoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// Pre-create all icons for better performance
export const categoryIcons: Record<Category, DivIcon> = {
  archaeological: createCategoryIcon('archaeological'),
  volcano: createCategoryIcon('volcano'),
  lake: createCategoryIcon('lake'),
  nature: createCategoryIcon('nature'),
  colonial: createCategoryIcon('colonial'),
  beach: createCategoryIcon('beach'),
  cave: createCategoryIcon('cave'),
};
