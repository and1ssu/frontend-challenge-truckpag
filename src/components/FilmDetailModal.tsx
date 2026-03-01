import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Film, MovieMeta } from '../types/film';
import { HighlightedText } from './HighlightedText';
import { StarRatingInput } from './StarRatingInput';
import { useFilmPeople } from '../hooks/useFilmPeople';

interface FilmDetailModalProps {
  film: Film;
  meta: MovieMeta;
  searchTerm: string;
  includeSynopsis: boolean;
  onClose: () => void;
  onToggleWatched: () => void;
  onToggleFavorite: () => void;
  onSaveNote: (note: string, personalRating: number) => void;
  onRemoveNote: () => void;
}

export function FilmDetailModal({
  film,
  meta,
  searchTerm,
  includeSynopsis,
  onClose,
  onToggleWatched,
  onToggleFavorite,
  onSaveNote,
  onRemoveNote
}: FilmDetailModalProps) {
  const [noteDraft, setNoteDraft] = useState(meta.note);
  const [ratingDraft, setRatingDraft] = useState(meta.personalRating);
  const hasAnyNoteContent = noteDraft.trim().length > 0 || ratingDraft > 0;
  const { people, isLoading: isPeopleLoading } = useFilmPeople(film.people ?? []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1a1a1a] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-zinc-300 transition hover:bg-black hover:text-white"
        >
          ×
        </button>

        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={film.movie_banner || film.image}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#1a1a1a]" />
        </div>

        <div className="flex gap-5 px-6 pb-6">
          <div className="-mt-14 hidden shrink-0 md:block">
            <img
              src={film.image}
              alt={`Pôster de ${film.title}`}
              className="aspect-[2/3] w-[100px] rounded-lg border border-white/15 object-cover shadow-xl"
            />
          </div>

          <div className="overflow-y-auto max-h-[60vh] flex-1 space-y-4 pt-3 pb-1">
            <div className="space-y-1">
              {film.original_title && (
                <p className="font-display text-sm tracking-widest text-zinc-500">
                  {film.original_title}
                  {film.original_title_romanised && (
                    <span className="ml-2 text-zinc-600">· {film.original_title_romanised}</span>
                  )}
                </p>
              )}
              <h2 className="font-display text-3xl leading-none tracking-wider text-white">{film.title}</h2>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="rounded-sm border border-white/20 bg-white/8 px-2 py-0.5 font-semibold tracking-wider">{film.release_date}</span>
                <span className="rounded-sm border border-white/20 bg-white/8 px-2 py-0.5 font-semibold tracking-wider">{film.running_time} min</span>
                <span className="rounded-sm bg-[#e50914] px-2 py-0.5 font-display tracking-widest">RT {film.rt_score}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onToggleWatched}
                className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  meta.watched
                    ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {meta.watched ? 'Assistido' : 'Marcar como assistido'}
              </button>
              <button
                type="button"
                onClick={onToggleFavorite}
                className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  meta.favorite
                    ? 'bg-[#e50914] text-white hover:bg-[#f6121d]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {meta.favorite ? 'Na Coleção' : 'Adicionar à Coleção'}
              </button>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-1">
              <p className="text-xs text-zinc-400">
                Diretor: <span className="text-zinc-200">{film.director}</span>
              </p>
              <p className="text-xs text-zinc-400">
                Produtor: <span className="text-zinc-200">{film.producer}</span>
              </p>
            </div>

            <p className="text-sm leading-relaxed text-zinc-300">
              <HighlightedText text={film.description} query={searchTerm} enabled={includeSynopsis} />
            </p>

            {(isPeopleLoading || people.length > 0) && (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Personagens</p>
                {isPeopleLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {people.map((person) => (
                      <span
                        key={person.id}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                      >
                        {person.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-white/10 pt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Sua anotação</p>
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                className="h-24 w-full rounded-lg border border-white/15 bg-[#101010] p-3 text-sm text-zinc-100 outline-none transition focus:border-[#e50914] resize-none"
                placeholder="Escreva sua anotação sobre o filme…"
              />
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">
                  Sua nota:{' '}
                  <span className="text-zinc-200">
                    {meta.personalRating > 0 ? `${meta.personalRating}/5` : 'não avaliado'}
                  </span>
                </p>
                <StarRatingInput value={ratingDraft} onChange={setRatingDraft} />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onSaveNote(noteDraft, ratingDraft)}
                  className="rounded bg-[#e50914] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#f6121d]"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={onRemoveNote}
                  disabled={!hasAnyNoteContent}
                  className="rounded bg-zinc-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

