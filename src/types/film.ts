export interface Film {
  id: string;
  title: string;
  original_title: string;
  image: string;
  movie_banner: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
}

export interface MovieMeta {
  watched: boolean;
  favorite: boolean;
  note: string;
  personalRating: number;
}

export interface AppFilters {
  search: string;
  includeSynopsis: boolean;
  watchedOnly: boolean;
  favoriteOnly: boolean;
  notedOnly: boolean;
  stars: number;
}

export interface SortState {
  field: 'title' | 'duration' | 'personalRating' | 'rtScore';
  direction: 'asc' | 'desc';
}
