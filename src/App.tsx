import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useFilms, persistFilmsCache } from './hooks/useFilms';
import { useLocalStorageState } from './hooks/useLocalStorage';
import { FiltersPanel } from './components/FiltersPanel';
import { FilmCard } from './components/FilmCard';
import { useMovies } from './state/moviesContext';
import { useToast } from './state/toastContext';
import type { AppFilters, SortState } from './types/film';
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

function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-2xl border border-white/15 bg-slate-900/70"
        />
      ))}
    </div>
  );
}

export default function App() {
  const listRef = useRef<HTMLDivElement | null>(null);
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

  useLayoutEffect(() => {
    if (!listRef.current) {
      return;
    }

    const tween = gsap.fromTo(
      '.film-card',
      { autoAlpha: 0, y: 18, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.06,
        clearProps: 'all'
      }
    );

    return () => {
      tween.kill();
    };
  }, [visibleFilms]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <header className="mb-8 space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-emerald-200/90">Studio Ghibli</p>
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Catálogo de Filmes</h1>
        <p className="max-w-2xl text-sm text-slate-200 md:text-base">
          Explore, filtre, favoritar e registre suas impressões dos filmes. As ações ficam salvas localmente para você retomar de onde parou.
        </p>
      </header>

      <FiltersPanel
        filters={filters}
        sort={sort}
        onFiltersChange={(updater) => setFilters((previous) => updater(previous))}
        onSortChange={setSort}
      />

      <section className="mt-6">
        {isLoading && <LoadingSkeleton />}

        {isError && (
          <p className="rounded-xl border border-rose-400/40 bg-rose-900/30 p-4 text-rose-100">
            Não foi possível carregar os filmes da API do Studio Ghibli.
          </p>
        )}

        {!isLoading && !isError && visibleFilms.length === 0 && (
          <p className="rounded-xl border border-white/20 bg-slate-900/70 p-6 text-slate-200">
            Nenhum filme encontrado com os filtros atuais.
          </p>
        )}

        <div ref={listRef} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleFilms.map(({ film, meta }) => (
            <FilmCard
              key={film.id}
              film={film}
              meta={meta}
              searchTerm={filters.search}
              includeSynopsis={filters.includeSynopsis}
              onToggleWatched={() => {
                toggleWatched(film.id);
                addToast(meta.watched ? 'Filme marcado como não assistido.' : 'Filme marcado como assistido.');
              }}
              onToggleFavorite={() => {
                toggleFavorite(film.id);
                addToast(meta.favorite ? 'Filme removido dos favoritos.' : 'Filme favoritado.');
              }}
              onSaveNote={(note, personalRating) => {
                saveNote(film.id, note, personalRating);
                addToast(meta.note ? 'Anotação atualizada.' : 'Anotação salva.');
              }}
              onRemoveNote={() => {
                removeNote(film.id);
                addToast('Anotação removida.');
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
