import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useFilms, persistFilmsCache } from './hooks/useFilms';
import { useLocalStorageState } from './hooks/useLocalStorage';
import { FiltersPanel } from './components/FiltersPanel';
import { FilmCard } from './components/FilmCard';
import { useMovies } from './state/moviesContext';
import { useToast } from './state/toastContext';
import type { AppFilters, Film, MovieMeta, SortState } from './types/film';
import { getVisibleFilms } from './utils/filmSelectors';

const INITIAL_FILTERS: AppFilters = {
  search: '',
  includeSynopsis: false,
  watchedOnly: false,
  favoriteOnly: false,
  notedOnly: false,
  stars: 0
};

const INITIAL_SORT: SortState = {
  field: 'title',
  direction: 'asc'
};

interface FilmItem {
  film: Film;
  meta: MovieMeta;
}

interface FilmRowProps {
  title: string;
  items: FilmItem[];
  searchTerm: string;
  includeSynopsis: boolean;
  emptyMessage: string;
  onToggleWatched: (filmId: string, watched: boolean) => void;
  onToggleFavorite: (filmId: string, favorite: boolean) => void;
  onSaveNote: (filmId: string, note: string, personalRating: number, hasNote: boolean) => void;
  onRemoveNote: (filmId: string) => void;
}

function FilmRow({
  title,
  items,
  searchTerm,
  includeSynopsis,
  emptyMessage,
  onToggleWatched,
  onToggleFavorite,
  onSaveNote,
  onRemoveNote
}: FilmRowProps) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 font-body text-xl font-bold text-white">{title}</h2>

      {items.length === 0 ? (
        <p className="rounded-lg border border-white/15 bg-[#1b1b1b] px-4 py-3 text-sm text-zinc-300">
          {emptyMessage}
        </p>
      ) : (
        <div className="film-strip flex gap-4 overflow-x-auto pb-4">
          {items.map(({ film, meta }) => (
            <FilmCard
              key={film.id}
              film={film}
              meta={meta}
              searchTerm={searchTerm}
              includeSynopsis={includeSynopsis}
              onToggleWatched={() => onToggleWatched(film.id, meta.watched)}
              onToggleFavorite={() => onToggleFavorite(film.id, meta.favorite)}
              onSaveNote={(note, personalRating) =>
                onSaveNote(film.id, note, personalRating, meta.note.trim().length > 0)
              }
              onRemoveNote={() => onRemoveNote(film.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="space-y-3">
      <div className="h-7 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="film-strip flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-[420px] min-w-[290px] animate-pulse rounded-xl border border-white/10 bg-zinc-900"
          />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { data: films = [], isLoading, isError } = useFilms();
  const { getMovieMeta, toggleFavorite, toggleWatched, saveNote, removeNote } = useMovies();
  const { addToast } = useToast();

  const [filters, setFilters] = useLocalStorageState<AppFilters>('ghibli-filters', INITIAL_FILTERS);
  const [sort, setSort] = useLocalStorageState<SortState>('ghibli-sort', INITIAL_SORT);

  useEffect(() => {
    if (films.length > 0) {
      persistFilmsCache(films);
    }
  }, [films]);

  const moviesWithMeta = useMemo(
    () => films.map((film) => ({ film, meta: getMovieMeta(film.id) })),
    [films, getMovieMeta]
  );

  const visibleFilms = useMemo(
    () => getVisibleFilms(moviesWithMeta, filters, sort),
    [moviesWithMeta, filters, sort]
  );

  const favoriteFilms = useMemo(
    () => visibleFilms.filter(({ meta }) => meta.favorite),
    [visibleFilms]
  );

  const watchedFilms = useMemo(
    () => visibleFilms.filter(({ meta }) => meta.watched),
    [visibleFilms]
  );

  const notedFilms = useMemo(
    () => visibleFilms.filter(({ meta }) => meta.note.trim().length > 0),
    [visibleFilms]
  );

  const featuredFilm = visibleFilms[0]?.film ?? films[0];

  useLayoutEffect(() => {
    if (!pageRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-content',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.film-card',
        { autoAlpha: 0, y: 16, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.04,
          clearProps: 'all'
        }
      );
    }, pageRef);

    return () => {
      context.revert();
    };
  }, [visibleFilms]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#141414] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-8">
          <p className="font-display text-3xl tracking-[0.06em] text-[#e50914]">GHIBLIX</p>
          <p className="hidden text-sm text-zinc-300 md:block">Studio Ghibli Collection</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-20 md:px-8">
        {featuredFilm && (
          <section className="relative mb-6 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={featuredFilm.movie_banner || featuredFilm.image}
              alt={`Banner de ${featuredFilm.title}`}
              className="h-[300px] w-full object-cover md:h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
            <div className="hero-content absolute bottom-0 left-0 right-0 space-y-3 p-5 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-300">Filme em destaque</p>
              <h1 className="max-w-xl font-body text-3xl font-extrabold md:text-5xl">{featuredFilm.title}</h1>
              <p className="max-w-2xl text-sm text-zinc-200 md:text-base">{featuredFilm.description}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded bg-white/10 px-3 py-1">{featuredFilm.release_date}</span>
                <span className="rounded bg-white/10 px-3 py-1">{featuredFilm.running_time} min</span>
                <span className="rounded bg-[#e50914] px-3 py-1 font-semibold">rt_score {featuredFilm.rt_score}</span>
              </div>
            </div>
          </section>
        )}

        <FiltersPanel
          filters={filters}
          sort={sort}
          onFiltersChange={(updater) => setFilters((previous) => updater(previous))}
          onSortChange={setSort}
        />

        <section className="mt-8 space-y-8">
          {isLoading && <LoadingSkeleton />}

          {isError && (
            <p className="rounded-lg border border-red-500/50 bg-red-900/30 p-4 text-red-100">
              Não foi possível carregar os filmes da API do Studio Ghibli.
            </p>
          )}

          {!isLoading && !isError && visibleFilms.length === 0 && (
            <p className="rounded-lg border border-white/15 bg-[#1b1b1b] p-4 text-zinc-300">
              Nenhum filme encontrado com os filtros atuais.
            </p>
          )}

          {!isLoading && !isError && visibleFilms.length > 0 && (
            <>
              <FilmRow
                title="Minha Lista"
                items={notedFilms}
                searchTerm={filters.search}
                includeSynopsis={filters.includeSynopsis}
                emptyMessage="Adicione anotações para montar sua lista pessoal."
                onToggleWatched={(filmId, watched) => {
                  toggleWatched(filmId);
                  addToast(watched ? 'Filme marcado como não assistido.' : 'Filme marcado como assistido.');
                }}
                onToggleFavorite={(filmId, favorite) => {
                  toggleFavorite(filmId);
                  addToast(favorite ? 'Filme removido dos favoritos.' : 'Filme favoritado.');
                }}
                onSaveNote={(filmId, note, personalRating, hasNote) => {
                  saveNote(filmId, note, personalRating);
                  addToast(hasNote ? 'Anotação atualizada.' : 'Anotação salva.');
                }}
                onRemoveNote={(filmId) => {
                  removeNote(filmId);
                  addToast('Anotação removida.');
                }}
              />

              <FilmRow
                title="Favoritos"
                items={favoriteFilms}
                searchTerm={filters.search}
                includeSynopsis={filters.includeSynopsis}
                emptyMessage="Nenhum filme favoritado com os filtros atuais."
                onToggleWatched={(filmId, watched) => {
                  toggleWatched(filmId);
                  addToast(watched ? 'Filme marcado como não assistido.' : 'Filme marcado como assistido.');
                }}
                onToggleFavorite={(filmId, favorite) => {
                  toggleFavorite(filmId);
                  addToast(favorite ? 'Filme removido dos favoritos.' : 'Filme favoritado.');
                }}
                onSaveNote={(filmId, note, personalRating, hasNote) => {
                  saveNote(filmId, note, personalRating);
                  addToast(hasNote ? 'Anotação atualizada.' : 'Anotação salva.');
                }}
                onRemoveNote={(filmId) => {
                  removeNote(filmId);
                  addToast('Anotação removida.');
                }}
              />

              <FilmRow
                title="Assistidos"
                items={watchedFilms}
                searchTerm={filters.search}
                includeSynopsis={filters.includeSynopsis}
                emptyMessage="Nenhum filme assistido com os filtros atuais."
                onToggleWatched={(filmId, watched) => {
                  toggleWatched(filmId);
                  addToast(watched ? 'Filme marcado como não assistido.' : 'Filme marcado como assistido.');
                }}
                onToggleFavorite={(filmId, favorite) => {
                  toggleFavorite(filmId);
                  addToast(favorite ? 'Filme removido dos favoritos.' : 'Filme favoritado.');
                }}
                onSaveNote={(filmId, note, personalRating, hasNote) => {
                  saveNote(filmId, note, personalRating);
                  addToast(hasNote ? 'Anotação atualizada.' : 'Anotação salva.');
                }}
                onRemoveNote={(filmId) => {
                  removeNote(filmId);
                  addToast('Anotação removida.');
                }}
              />

              <FilmRow
                title={`Catálogo (${visibleFilms.length})`}
                items={visibleFilms}
                searchTerm={filters.search}
                includeSynopsis={filters.includeSynopsis}
                emptyMessage="Sem filmes para exibir."
                onToggleWatched={(filmId, watched) => {
                  toggleWatched(filmId);
                  addToast(watched ? 'Filme marcado como não assistido.' : 'Filme marcado como assistido.');
                }}
                onToggleFavorite={(filmId, favorite) => {
                  toggleFavorite(filmId);
                  addToast(favorite ? 'Filme removido dos favoritos.' : 'Filme favoritado.');
                }}
                onSaveNote={(filmId, note, personalRating, hasNote) => {
                  saveNote(filmId, note, personalRating);
                  addToast(hasNote ? 'Anotação atualizada.' : 'Anotação salva.');
                }}
                onRemoveNote={(filmId) => {
                  removeNote(filmId);
                  addToast('Anotação removida.');
                }}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
