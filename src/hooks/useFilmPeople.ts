import { useState, useEffect } from 'react';
import type { FilmPerson } from '../types/film';

export function useFilmPeople(urls: string[]) {
  const [people, setPeople] = useState<FilmPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const key = urls.join(',');

  useEffect(() => {
    const validUrls = urls.filter((url) => typeof url === 'string' && url.startsWith('http'));

    if (validUrls.length === 0) return;

    setIsLoading(true);
    setPeople([]);

    Promise.all(validUrls.map((url) => fetch(url).then((r) => r.json())))
      .then((results) => setPeople(results as FilmPerson[]))
      .catch(() => setPeople([]))
      .finally(() => setIsLoading(false));
  }, [key]);

  return { people, isLoading };
}
