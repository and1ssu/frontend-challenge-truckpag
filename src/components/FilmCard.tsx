import { useEffect, useState } from 'react';
import type { Film, MovieMeta } from '../types/film';
import { HighlightedText } from './HighlightedText';
import { StarRatingInput } from './StarRatingInput';

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
  const [noteDraft, setNoteDraft] = useState(meta.note);
  const [ratingDraft, setRatingDraft] = useState(meta.personalRating);
  const hasAnyNoteContent = noteDraft.trim().length > 0 || ratingDraft > 0;

  useEffect(() => {
    setNoteDraft(meta.note);
    setRatingDraft(meta.personalRating);
  }, [meta.note, meta.personalRating]);

  return (
    <article className="film-card group min-w-[290px] max-w-[300px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-white/30 hover:shadow-[0_18px_35px_rgba(0,0,0,0.45)]">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={film.image}
          alt={`Pôster de ${film.title}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 space-y-1 p-3">
          <h3 className="font-body text-lg font-bold leading-tight text-white">{film.title}</h3>
          <p className="text-xs text-zinc-300">
            {film.release_date} • {film.running_time} min • rt {film.rt_score}
          </p>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleWatched}
            className={`rounded px-3 py-1 text-xs font-semibold transition ${
              meta.watched
                ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                : 'bg-zinc-700 text-white hover:bg-zinc-600'
            }`}
          >
            {meta.watched ? 'Assistido' : 'Marcar assistido'}
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`rounded px-3 py-1 text-xs font-semibold transition ${
              meta.favorite
                ? 'bg-[#e50914] text-white hover:bg-[#f6121d]'
                : 'bg-zinc-700 text-white hover:bg-zinc-600'
            }`}
          >
            {meta.favorite ? 'Na Minha Lista' : 'Adicionar à Lista'}
          </button>
        </div>

        <p className="max-h-14 overflow-hidden text-xs leading-relaxed text-zinc-300">
          <HighlightedText text={film.description} query={searchTerm} enabled={includeSynopsis} />
        </p>

        <details className="rounded-lg border border-white/10 bg-black/25 p-2">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wide text-zinc-200">
            Detalhes e anotação
          </summary>

          <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
            <p className="text-xs text-zinc-400">
              Diretor: <span className="text-zinc-200">{film.director}</span> | Produtor:{' '}
              <span className="text-zinc-200">{film.producer}</span>
            </p>

            <p className="text-xs leading-relaxed text-zinc-300">
              <HighlightedText text={film.description} query={searchTerm} enabled={includeSynopsis} />
            </p>

            <textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              className="h-20 w-full rounded border border-white/15 bg-[#101010] p-2 text-xs text-zinc-100 outline-none transition focus:border-[#e50914]"
              placeholder="Escreva sua anotação sobre o filme"
            />

            <div className="space-y-2">
              <p className="text-xs text-zinc-300">
                Sua nota: {meta.personalRating > 0 ? `${meta.personalRating}/5` : 'não avaliado'}
              </p>
              <StarRatingInput value={ratingDraft} onChange={setRatingDraft} />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSaveNote(noteDraft, ratingDraft)}
                className="rounded bg-[#e50914] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#f6121d]"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={onRemoveNote}
                disabled={!hasAnyNoteContent}
                className="rounded bg-zinc-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                Remover
              </button>
            </div>
          </div>
        </details>
      </div>
    </article>
  );
}
