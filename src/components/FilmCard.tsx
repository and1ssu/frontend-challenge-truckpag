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

  useEffect(() => {
    setNoteDraft(meta.note);
    setRatingDraft(meta.personalRating);
  }, [meta.note, meta.personalRating]);

  return (
    <article className="film-card overflow-hidden rounded-2xl border border-white/20 bg-slate-900/80 shadow-glow backdrop-blur-sm">
      <img
        src={film.image}
        alt={`Pôster de ${film.title}`}
        className="h-72 w-full object-cover object-center md:h-80"
      />

      <div className="space-y-4 p-5">
        <header className="space-y-2">
          <h2 className="font-display text-2xl font-bold leading-tight text-white">{film.title}</h2>
          <p className="text-sm text-slate-300">
            {film.release_date} • {film.running_time} min
          </p>
          <p className="text-sm text-emerald-200">
            Diretor: <span className="font-semibold">{film.director}</span> | Produtor:{' '}
            <span className="font-semibold">{film.producer}</span>
          </p>
        </header>

        <p className="text-sm leading-relaxed text-slate-200">
          <HighlightedText text={film.description} query={searchTerm} enabled={includeSynopsis} />
        </p>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-100">rt_score: {film.rt_score}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-100">
            Sua nota: {meta.personalRating > 0 ? `${meta.personalRating}/5` : 'Não avaliado'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleWatched}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              meta.watched
                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
            }`}
          >
            {meta.watched ? 'Assistido' : 'Marcar como assistido'}
          </button>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              meta.favorite
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
            }`}
          >
            {meta.favorite ? 'Favorito ★' : 'Favoritar'}
          </button>
        </div>

        <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">Anotações</h3>
          <textarea
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            className="h-24 w-full rounded-lg border border-white/20 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-300"
            placeholder="Anote seus pensamentos sobre o filme..."
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <StarRatingInput value={ratingDraft} onChange={setRatingDraft} />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSaveNote(noteDraft, ratingDraft)}
                className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Salvar anotação
              </button>

              <button
                type="button"
                onClick={onRemoveNote}
                className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
