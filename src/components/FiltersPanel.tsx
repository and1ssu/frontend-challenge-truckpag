import type { AppFilters, SortState } from '../types/film';

interface FiltersPanelProps {
  filters: AppFilters;
  sort: SortState;
  onFiltersChange: (updater: (previous: AppFilters) => AppFilters) => void;
  onSortChange: (value: SortState) => void;
}

export function FiltersPanel({ filters, sort, onFiltersChange, onSortChange }: FiltersPanelProps) {
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
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Buscar por título</span>
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, search: event.target.value }))
            }
            placeholder="Ex: spirited"
            className="w-full rounded border border-white/15 bg-[#101010] px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-[#e50914]"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Filtrar por estrelas</span>
          <select
            value={filters.stars}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, stars: Number(event.target.value) }))
            }
            className="w-full rounded border border-white/15 bg-[#101010] px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-[#e50914]"
          >
            <option value={0}>Todas</option>
            <option value={1}>1 estrela</option>
            <option value={2}>2 estrelas</option>
            <option value={3}>3 estrelas</option>
            <option value={4}>4 estrelas</option>
            <option value={5}>5 estrelas</option>
          </select>
        </label>

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
            <option value="rtScore">rt_score</option>
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
