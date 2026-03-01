import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
      <div className="flex items-center gap-4 px-1">
        <span className="block h-5 w-1 rounded-full bg-[#e50914]" />
        <h2 className="font-display text-2xl tracking-wider text-white">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>

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
            className="aspect-[2/3] min-w-[200px] animate-pulse rounded-xl border border-white/10 bg-zinc-800"
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
  const [featuredIndex, setFeaturedIndex] = useState(0);

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

  const collectionFilms = useMemo(
    () => visibleFilms.filter(({ meta }) => meta.favorite || meta.note.trim().length > 0),
    [visibleFilms]
  );

  const watchedFilms = useMemo(
    () => visibleFilms.filter(({ meta }) => meta.watched),
    [visibleFilms]
  );

  const featuredFilms = useMemo(() => {
    const source = visibleFilms.length > 0 ? visibleFilms : moviesWithMeta;
    return source.slice(0, 8).map(({ film }) => film);
  }, [visibleFilms, moviesWithMeta]);

  const featuredFilm = featuredFilms[featuredIndex];

  useEffect(() => {
    if (featuredFilms.length === 0) {
      setFeaturedIndex(0);
      return;
    }

    setFeaturedIndex((previous) => {
      if (previous >= featuredFilms.length) {
        return 0;
      }

      return previous;
    });
  }, [featuredFilms]);

  useEffect(() => {
    if (featuredFilms.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex((previous) => (previous + 1) % featuredFilms.length);
    }, 5500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [featuredFilms.length]);

  useLayoutEffect(() => {
    if (!pageRef.current) {
      return;
    }

    const context = gsap.context(() => {
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

  useLayoutEffect(() => {
    if (!pageRef.current || !featuredFilm) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-media',
        { autoAlpha: 0.5, scale: 1.03 },
        { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.hero-content',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }
      );
    }, pageRef);

    return () => {
      context.revert();
    };
  }, [featuredFilm, featuredIndex]);

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
              key={featuredFilm.id}
              src={featuredFilm.movie_banner || featuredFilm.image}
              alt={`Banner de ${featuredFilm.title}`}
              className="hero-media h-[380px] w-full object-cover object-top md:h-[560px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent md:via-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            <div className="hero-content absolute bottom-0 left-0 right-0 space-y-4 p-5 pb-7 md:max-w-[55%] md:p-10 md:pb-12">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e50914] font-semibold">Filme em destaque</p>
              <h1 className="font-display text-4xl leading-none tracking-wider md:text-6xl lg:text-7xl">{featuredFilm.title}</h1>
              <p className="max-w-lg text-sm leading-relaxed text-zinc-300 md:text-[15px] line-clamp-3">{featuredFilm.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-sm border border-white/20 bg-white/8 px-2.5 py-1 font-body font-semibold tracking-wider">{featuredFilm.release_date}</span>
                <span className="rounded-sm border border-white/20 bg-white/8 px-2.5 py-1 font-body font-semibold tracking-wider">{featuredFilm.running_time} min</span>
                <span className="rounded-sm bg-[#e50914] px-3 py-1 font-display tracking-widest text-sm">rt {featuredFilm.rt_score}</span>
              </div>
            </div>

            {featuredFilms.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Slide anterior"
                  onClick={() =>
                    setFeaturedIndex((previous) =>
                      previous === 0 ? featuredFilms.length - 1 : previous - 1
                    )
                  }
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 text-2xl text-white shadow-lg transition hover:bg-black/85 hover:border-white/40"
                >
                  ‹
                </button>

                <button
                  type="button"
                  aria-label="Próximo slide"
                  onClick={() =>
                    setFeaturedIndex((previous) => (previous + 1) % featuredFilms.length)
                  }
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 text-2xl text-white shadow-lg transition hover:bg-black/85 hover:border-white/40"
                >
                  ›
                </button>

                <div className="absolute bottom-3 right-4 z-10 flex gap-2">
                  {featuredFilms.map((film, index) => (
                    <button
                      key={film.id}
                      type="button"
                      aria-label={`Ir para destaque ${index + 1}`}
                      onClick={() => setFeaturedIndex(index)}
                      className={`transition-all duration-300 rounded-full ${
                        featuredIndex === index ? 'h-2 w-6 bg-[#e50914]' : 'h-2 w-2 bg-white/35 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <FiltersPanel
          filters={filters}
          sort={sort}
          filmTitles={films.map((f) => f.title)}
          onFiltersChange={(updater) => setFilters((previous) => updater(previous))}
          onSortChange={setSort}
        />

        <section className="mt-10 space-y-10">
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
                title={`Coleção (${collectionFilms.length})`}
                items={collectionFilms}
                searchTerm={filters.search}
                includeSynopsis={filters.includeSynopsis}
                emptyMessage="Favorite filmes ou adicione anotações para montar sua coleção."
                onToggleWatched={(filmId, watched) => {
                  toggleWatched(filmId);
                  addToast(watched ? 'Filme marcado como não assistido.' : 'Filme marcado como assistido.');
                }}
                onToggleFavorite={(filmId, favorite) => {
                  toggleFavorite(filmId);
                  addToast(favorite ? 'Filme removido da coleção.' : 'Filme adicionado à coleção.');
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
