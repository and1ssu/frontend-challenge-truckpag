import type { MovieMeta } from '../types/film';

export type MoviesState = Record<string, MovieMeta>;

export type MoviesAction =
  | { type: 'toggle_watched'; filmId: string }
  | { type: 'toggle_favorite'; filmId: string }
  | { type: 'save_note'; filmId: string; note: string; personalRating: number }
  | { type: 'remove_note'; filmId: string };

export const EMPTY_META: MovieMeta = {
  watched: false,
  favorite: false,
  note: '',
  personalRating: 0
};

function getMeta(state: MoviesState, filmId: string): MovieMeta {
  return state[filmId] ?? EMPTY_META;
}

export function moviesReducer(state: MoviesState, action: MoviesAction): MoviesState {
  const current = getMeta(state, action.filmId);

  switch (action.type) {
    case 'toggle_watched':
      return {
        ...state,
        [action.filmId]: {
          ...current,
          watched: !current.watched
        }
      };

    case 'toggle_favorite':
      return {
        ...state,
        [action.filmId]: {
          ...current,
          favorite: !current.favorite
        }
      };

    case 'save_note':
      return {
        ...state,
        [action.filmId]: {
          ...current,
          note: action.note.trim(),
          personalRating: action.personalRating
        }
      };

    case 'remove_note':
      return {
        ...state,
        [action.filmId]: {
          ...current,
          note: '',
          personalRating: 0
        }
      };

    default:
      return state;
  }
}
