import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { ProgramCard } from "@/components/ProgramCard";
import { Filters } from "@/components/Filters";
import { PROGRAMS } from "@/lib/programs";
import { scorePrograms, applyFilters, sortPrograms, type FilterState } from "@/lib/scoring";
import type { Interest, SortKey } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";

const interestEnum = z.enum([
  "Coding","Robotics","Music","Theater","Art","Sports","Nature","Science",
  "Writing","Leadership","Cooking","Languages","Math","Engineering","Filmmaking",
]);

const sortEnum = z.enum(["relevance","cost-asc","cost-desc","distance","uniqueness","fun","college"]);

const searchSchema = z.object({
  zip: fallback(z.string(), "").default(""),
  age: fallback(z.number(), 10).default(10),
  interests: fallback(z.array(interestEnum), []).default([]),
  sort: fallback(sortEnum, "relevance").default("relevance"),
  maxCost: fallback(z.number(), 1000).default(1000),
  maxDistance: fallback(z.number(), 50).default(50),
  types: fallback(z.array(z.string()), []).default([]),
  schedules: fallback(z.array(z.string()), []).default([]),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search Programs — Kodanz" },
      { name: "description", content: "Browse summer camps and year-round enrichment programs filtered by age, interests, cost, and distance." },
    ],
  }),
  component: SearchPage,
});

const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Best Match",
  "cost-asc": "Cost: Low to High",
  "cost-desc": "Cost: High to Low",
  distance: "Distance",
  uniqueness: "Most Unique",
  fun: "Fun Factor",
  college: "College Impact",
};

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: FilterState = {
    types: search.types,
    schedules: search.schedules,
    maxCost: search.maxCost,
    maxDistance: search.maxDistance,
  };

  const results = useMemo(() => {
    const scored = scorePrograms(PROGRAMS, {
      zip: search.zip,
      age: search.age,
      interests: search.interests as Interest[],
    });
    const filtered = applyFilters(scored, filters);
    return sortPrograms(filtered, search.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const setFilters = (next: FilterState) => {
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...next }) });
  };

  const sortOptions: SortKey[] = search.age >= 13
    ? ["relevance","cost-asc","cost-desc","distance","uniqueness","fun","college"]
    : ["relevance","cost-asc","cost-desc","distance","uniqueness","fun"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <SearchForm
            variant="compact"
            initial={{ zip: search.zip, age: search.age, interests: search.interests as Interest[] }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {results.length} program{results.length !== 1 ? "s" : ""}
              <span className="text-muted-foreground font-medium"> for age {search.age}</span>
            </h1>
            {search.interests.length > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Interests: {search.interests.join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={search.sort}
              onChange={(e) => navigate({ search: (p: Record<string, unknown>) => ({ ...p, sort: e.target.value as SortKey }) })}
              className="rounded-full border bg-card px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((k) => <option key={k} value={k}>Sort: {SORT_LABELS[k]}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Filters value={filters} onChange={setFilters} />
            </div>
          </div>

          <div>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
                <h3 className="text-lg font-bold">No programs match.</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try widening your filters or checking another age.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {results.map((p) => <ProgramCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-full p-2 hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Filters value={filters} onChange={setFilters} />
          </div>
        </div>
      )}
    </div>
  );
}