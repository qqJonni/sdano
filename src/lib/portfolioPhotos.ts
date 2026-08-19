import type { ImageMetadata } from 'astro';

// Фото объектов портфолио подтягиваются автоматически из
// src/assets/portfolio/<slug>/ — папка называется точно как slug объекта.
// Достаточно положить файлы в нужную папку: правок кода не требуется.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/portfolio/*/*.{jpeg,jpg,JPG,JPEG,png,webp,avif}',
  { eager: true }
);

// Все фото объекта по его slug, отсортированные по имени файла (1, 2, 3, …).
export function getProjectPhotos(slug: string): ImageMetadata[] {
  return Object.entries(files)
    .filter(([path]) => path.includes(`/portfolio/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, mod]) => mod.default);
}

// Первое фото объекта (для обложки в каталоге), либо null если папка пуста.
export function getProjectCover(slug: string): ImageMetadata | null {
  return getProjectPhotos(slug)[0] ?? null;
}
