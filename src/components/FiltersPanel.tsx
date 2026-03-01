import { useState, useRef } from 'react';
import type { AppFilters, SortState } from '../types/film';

interface FiltersPanelProps {
  filters: AppFilters;
  sort: SortState;
  filmTitles: string[];
  onFiltersChange: (updater: (previous: AppFilters) => AppFilters) => void;
  onSortChange: (value: SortState) => void;
}

export function FiltersPanel({ filters, sort, filmTitles, onFiltersChange, onSortChange }: FiltersPanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = filters.search.trim().length > 0
    ? filmTitles
        .filter((title) => title.toLowerCase().includes(filters.search.toLowerCase()))
        .slice(0, 6)
    : [];

  function selectSuggestion(title: string) {
    onFiltersChange((previous) => ({ ...previous, search: title }));
    setShowSuggestions(false);
    inputRef.current?.blur();
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#181818] p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-body text-lg font-bold text-white">Filtrar e ordenar</h2>
        <button
          type="button"
          onClick={() =>
            onFiltersChange(() => ({
              search: '',
              includeSynopsis: false,
              watchedOnly: false,
              favoriteOnly: false,
              notedOnly: false,
              stars: 0
            }))
          }
          className="rounded bg-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-600"
        >
          Limpar filtros
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative space-y-1">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Buscar por título</span>
          <input
            ref={inputRef}
            type="text"
            value={filters.search}
            onChange={(event) => {
              onFiltersChange((previous) => ({ ...previous, search: event.target.value }));
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            placeholder="Ex: spirited away…"
            className="w-full rounded border border-white/15 bg-[#101010] px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-[#e50914]"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-white/10 bg-[#1f1f1f] shadow-2xl">
              {suggestions.map((title) => {
                const query = filters.search.toLowerCase();
                const idx = title.toLowerCase().indexOf(query);
                const before = title.slice(0, idx);
                const match = title.slice(idx, idx + filters.search.length);
                const after = title.slice(idx + filters.search.length);
                return (
                  <li key={title}>
                    <button
                      type="button"
                      onMouseDown={() => selectSuggestion(title)}
                      className="w-full px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/8 hover:text-white"
                    >
                      {before}
                      <span className="text-[#e50914]">{match}</span>
                      {after}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Ordenar por</span>
          <select
            value={sort.field}
            onChange={(event) => onSortChange({ ...sort, field: event.target.value as SortState['field'] })}
            className="w-full rounded border border-white/15 bg-[#101010] px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-[#e50914]"
          >
            <option value="title">Título</option>
            <option value="duration">Duração</option>
            <option value="personalRating">Avaliação pessoal</option>
            <option value="rtScore">Rotten Tomatoes</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Direção</span>
          <select
            value={sort.direction}
            onChange={(event) =>
              onSortChange({ ...sort, direction: event.target.value as SortState['direction'] })
            }
            className="w-full rounded border border-white/15 bg-[#101010] px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-[#e50914]"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Avaliação pessoal</span>
          <select
            value={filters.stars}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, stars: Number(event.target.value) }))
            }
            className="w-full rounded border border-white/15 bg-[#101010] px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-[#e50914]"
          >
            <option value={0}>Todas</option>
            <option value={1}>★ 1 estrela</option>
            <option value={2}>★★ 2 estrelas</option>
            <option value={3}>★★★ 3 estrelas</option>
            <option value={4}>★★★★ 4 estrelas</option>
            <option value={5}>★★★★★ 5 estrelas</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-200">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-zinc-800 px-3 py-1.5">
          <input
            type="checkbox"
            checked={filters.includeSynopsis}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, includeSynopsis: event.target.checked }))
            }
          />
          Incluir sinopse
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-zinc-800 px-3 py-1.5">
          <input
            type="checkbox"
            checked={filters.watchedOnly}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, watchedOnly: event.target.checked }))
            }
          />
          Assistidos
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-zinc-800 px-3 py-1.5">
          <input
            type="checkbox"
            checked={filters.favoriteOnly}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, favoriteOnly: event.target.checked }))
            }
          />
          Favoritos
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-zinc-800 px-3 py-1.5">
          <input
            type="checkbox"
            checked={filters.notedOnly}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, notedOnly: event.target.checked }))
            }
          />
          Com anotação
        </label>
      </div>
    </section>
  );
}
