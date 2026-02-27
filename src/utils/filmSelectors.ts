import type { AppFilters, Film, MovieMeta, SortState } from '../types/film';

interface FilmItem {
  film: Film;
  meta: MovieMeta;
}

function containsQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function compare(a: number | string, b: number | string) {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

export function getVisibleFilms(items: FilmItem[], filters: AppFilters, sort: SortState): FilmItem[] {
  const query = filters.search.trim();

  const filtered = items.filter(({ film, meta }) => {
    const matchesSearch =
      query.length === 0 ||
      containsQuery(film.title, query) ||
      (filters.includeSynopsis && containsQuery(film.description, query));

    if (!matchesSearch) {
      return false;
    }

    if (filters.watchedOnly && !meta.watched) {
      return false;
    }

    if (filters.favoriteOnly && !meta.favorite) {
      return false;
    }

    if (filters.notedOnly && meta.note.trim().length === 0) {
      return false;
    }

    if (filters.stars > 0 && meta.personalRating !== filters.stars) {
      return false;
    }

    return true;
  });

  const direction = sort.direction === 'asc' ? 1 : -1;

  return filtered.sort((first, second) => {
    const left = first;
    const right = second;

    if (sort.field === 'title') {
      return direction * compare(left.film.title.toLowerCase(), right.film.title.toLowerCase());
    }

    if (sort.field === 'duration') {
      return direction * compare(Number(left.film.running_time), Number(right.film.running_time));
    }

    if (sort.field === 'personalRating') {
      return direction * compare(left.meta.personalRating, right.meta.personalRating);
    }

    return direction * compare(Number(left.film.rt_score), Number(right.film.rt_score));
  });
}
