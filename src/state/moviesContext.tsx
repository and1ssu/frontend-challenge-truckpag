import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren
} from 'react';
import { EMPTY_META, moviesReducer, type MoviesState } from './moviesReducer';
import type { MovieMeta } from '../types/film';

const STORAGE_KEY = 'ghibli-movies-meta';

interface MoviesContextValue {
  state: MoviesState;
  getMovieMeta: (filmId: string) => MovieMeta;
  toggleWatched: (filmId: string) => void;
  toggleFavorite: (filmId: string) => void;
  saveNote: (filmId: string, note: string, personalRating: number) => void;
  removeNote: (filmId: string) => void;
}

const MoviesContext = createContext<MoviesContextValue | null>(null);

function getInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as MoviesState) : {};
  } catch {
    return {};
  }
}

export function MoviesProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(moviesReducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<MoviesContextValue>(
    () => ({
      state,
      getMovieMeta: (filmId) => state[filmId] ?? EMPTY_META,
      toggleWatched: (filmId) => dispatch({ type: 'toggle_watched', filmId }),
      toggleFavorite: (filmId) => dispatch({ type: 'toggle_favorite', filmId }),
      saveNote: (filmId, note, personalRating) =>
        dispatch({ type: 'save_note', filmId, note, personalRating }),
      removeNote: (filmId) => dispatch({ type: 'remove_note', filmId })
    }),
    [state]
  );

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies() {
  const context = useContext(MoviesContext);

  if (!context) {
    throw new Error('useMovies deve ser utilizado dentro de MoviesProvider');
  }

  return context;
}
