import type { AppFilters, SortState } from '../types/film';

interface FiltersPanelProps {
  filters: AppFilters;
  sort: SortState;
  onFiltersChange: (updater: (previous: AppFilters) => AppFilters) => void;
  onSortChange: (value: SortState) => void;
}

export function FiltersPanel({ filters, sort, onFiltersChange, onSortChange }: FiltersPanelProps) {
  return (
    <section className="rounded-2xl border border-white/15 bg-slate-900/70 p-5 backdrop-blur-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1">
          <span className="text-sm text-slate-200">Buscar por título</span>
          <input
            type="text"
            value={filters.search}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, search: event.target.value }))
            }
            placeholder="Ex: spirited"
            className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-300"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-200">Filtrar por estrelas</span>
          <select
            value={filters.stars}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, stars: Number(event.target.value) }))
            }
            className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-300"
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
          <span className="text-sm text-slate-200">Ordenar por</span>
          <select
            value={sort.field}
            onChange={(event) => onSortChange({ ...sort, field: event.target.value as SortState['field'] })}
            className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-300"
          >
            <option value="title">Título</option>
            <option value="duration">Duração</option>
            <option value="personalRating">Avaliação pessoal</option>
            <option value="rtScore">rt_score</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-slate-200">Direção</span>
          <select
            value={sort.direction}
            onChange={(event) =>
              onSortChange({ ...sort, direction: event.target.value as SortState['direction'] })
            }
            className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-300"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-200">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.includeSynopsis}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, includeSynopsis: event.target.checked }))
            }
          />
          Incluir sinopse na busca
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.watchedOnly}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, watchedOnly: event.target.checked }))
            }
          />
          Somente assistidos
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.favoriteOnly}
            onChange={(event) =>
              onFiltersChange((previous) => ({ ...previous, favoriteOnly: event.target.checked }))
            }
          />
          Somente favoritos
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2">
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
