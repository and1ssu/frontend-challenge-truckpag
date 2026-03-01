export interface Film {
  id: string;
  title: string;
  original_title: string;
  original_title_romanised?: string;
  image: string;
  movie_banner: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
  people?: string[];
  species?: string[];
  locations?: string[];
  vehicles?: string[];
}

export interface FilmPerson {
  id: string;
  name: string;
  gender: string;
  age: string;
  eye_color: string;
  hair_color: string;
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
