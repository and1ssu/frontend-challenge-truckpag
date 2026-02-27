import { useQuery } from '@tanstack/react-query';
import { fetchFilms } from '../services/ghibliApi';
import type { Film } from '../types/film';

const FILMS_CACHE_KEY = 'ghibli-films-cache';

function getCachedFilms() {
  try {
    const cached = localStorage.getItem(FILMS_CACHE_KEY);
    return cached ? (JSON.parse(cached) as Film[]) : undefined;
  } catch {
    return undefined;
  }
}

export function useFilms() {
  return useQuery({
    queryKey: ['ghibli-films'],
    queryFn: fetchFilms,
    initialData: getCachedFilms,
    staleTime: 1000 * 60 * 10
  });
}

export function persistFilmsCache(films: Film[]) {
  localStorage.setItem(FILMS_CACHE_KEY, JSON.stringify(films));
}
