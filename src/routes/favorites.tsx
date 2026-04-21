import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ProgramCard } from "@/components/ProgramCard";
import { PROGRAMS } from "@/lib/programs";
import { scorePrograms } from "@/lib/scoring";
import { useFavorites } from "@/lib/favorites";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Saved Programs — Camp Hero" },
      { name: "description", content: "Programs you've saved for your kid's summer." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { ids } = useFavorites();
  const saved = scorePrograms(
    PROGRAMS.filter((p) => ids.includes(p.id)),
    { zip: "", age: 12, interests: [] },
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl text-accent-foreground"
                style={{ background: "var(--gradient-coral)" }}>
            <Heart className="h-6 w-6 fill-current" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your saved programs</h1>
            <p className="text-sm text-muted-foreground">{saved.length} program{saved.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {saved.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-bold">No saved programs yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Tap the heart on any program to save it for later.
            </p>
            <Link
              to="/search"
              search={{ zip: "", age: 10, interests: [], sort: "relevance", maxCost: 1000, maxDistance: 50, types: [], schedules: [] }}
              className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-accent-foreground"
              style={{ background: "var(--gradient-coral)" }}
            >
              Browse programs
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => <ProgramCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}