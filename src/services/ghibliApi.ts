import type { Film } from '../types/film';

const API_URL = 'https://ghibliapi.vercel.app/films';

export async function fetchFilms(): Promise<Film[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Falha ao buscar os filmes do Studio Ghibli.');
  }

  return response.json() as Promise<Film[]>;
}
