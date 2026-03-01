import { useState } from 'react';
import type { Film, MovieMeta } from '../types/film';
import { HighlightedText } from './HighlightedText';
import { FilmDetailModal } from './FilmDetailModal';

interface FilmCardProps {
  film: Film;
  meta: MovieMeta;
  searchTerm: string;
  includeSynopsis: boolean;
  onToggleFavorite: () => void;
  onToggleWatched: () => void;
  onSaveNote: (note: string, personalRating: number) => void;
  onRemoveNote: () => void;
}

export function FilmCard({
  film,
  meta,
  searchTerm,
  includeSynopsis,
  onToggleFavorite,
  onToggleWatched,
  onSaveNote,
  onRemoveNote
}: FilmCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <article className="film-card group relative min-w-[200px] max-w-[220px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] transition duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:border-white/30 hover:shadow-[0_24px_48px_rgba(0,0,0,0.65)]">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <img
            src={film.image}
            alt={`Pôster de ${film.title}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <div className="group/badge absolute right-2.5 top-2.5 z-10">
            <div className="cursor-help rounded bg-[#e50914] px-2 py-0.5 font-display text-sm tracking-wider text-white shadow-lg">
              {film.rt_score}
            </div>
            <div className="pointer-events-none absolute right-0 top-full mt-1.5 rounded border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] whitespace-nowrap text-zinc-200 opacity-0 transition-opacity duration-200 group-hover/badge:opacity-100">
              Rotten Tomatoes
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 space-y-0.5 p-3 pb-4">
            <h3 className="font-display text-lg leading-none tracking-wide text-white drop-shadow-lg">{film.title}</h3>
            <p className="text-[10px] font-body tracking-widest uppercase text-zinc-400">
              {film.release_date} • {film.running_time} min
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            <div className="bg-gradient-to-t from-black via-black/97 to-transparent px-3 pb-3 pt-10 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={onToggleWatched}
                  className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                    meta.watched
                      ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                      : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                  }`}
                >
                  {meta.watched ? 'Assistido' : 'Marcar como assistido'}
                </button>

                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                    meta.favorite
                      ? 'bg-[#e50914] text-white hover:bg-[#f6121d]'
                      : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                  }`}
                >
                  {meta.favorite ? 'Na Coleção' : 'Adicionar à Coleção'}
                </button>
              </div>

              <p className="line-clamp-3 text-[10px] leading-relaxed text-zinc-300">
                <HighlightedText text={film.description} query={searchTerm} enabled={includeSynopsis} />
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded border border-white/15 bg-white/8 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-300 transition hover:bg-white/15 hover:text-white"
              >
                Ver detalhes e anotação
              </button>
            </div>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <FilmDetailModal
          film={film}
          meta={meta}
          searchTerm={searchTerm}
          includeSynopsis={includeSynopsis}
          onClose={() => setIsModalOpen(false)}
          onToggleWatched={onToggleWatched}
          onToggleFavorite={onToggleFavorite}
          onSaveNote={onSaveNote}
          onRemoveNote={onRemoveNote}
        />
      )}
    </>
  );
}
