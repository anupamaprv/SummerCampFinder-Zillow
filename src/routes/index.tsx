import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { ProgramCard } from "@/components/ProgramCard";
import { PROGRAMS } from "@/lib/programs";
import { scorePrograms } from "@/lib/scoring";
import { Sparkles, Smile, GraduationCap, MapPin, Award } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Camp Hero — Find your kid's perfect summer program" },
      { name: "description", content: "Search summer camps and programs by ZIP, age, and interests. Compare cost, distance, uniqueness, fun and college impact." },
      { property: "og:title", content: "Camp Hero — Find your kid's perfect summer" },
      { property: "og:description", content: "Zillow for summer programs. Discover camps your kid will love." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = scorePrograms(PROGRAMS, { zip: "11201", age: 12, interests: [] })
    .sort((a, b) => b.uniqueness + b.fun - (a.uniqueness + a.fun))
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.92 }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 md:px-8 md:pt-24 md:pb-32 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Award className="h-3.5 w-3.5" /> The Zillow for summer programs
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              Find a summer<br />
              <span style={{
                background: "linear-gradient(90deg, oklch(0.85 0.16 60), oklch(0.78 0.2 30))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>your kid will love.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">
              Search thousands of camps and programs by ZIP, age and interests. Compare cost, fun factor, uniqueness and even college impact.
            </p>
          </div>

          <div className="mt-10 max-w-4xl">
            <SearchForm />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Hyper-local matching</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Uniqueness scoring</span>
            <span className="inline-flex items-center gap-2"><Smile className="h-4 w-4" /> Fun factor ratings</span>
            <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4" /> College impact (13+)</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Standouts</span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Truly unique programs</h2>
            <p className="mt-2 text-muted-foreground">The summer experiences kids talk about for years.</p>
          </div>
          <Link
            to="/search"
            search={{ zip: "11201", age: 12, interests: [], sort: "uniqueness", maxCost: 1000, maxDistance: 50, types: [], schedules: [] }}
            className="hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProgramCard key={p.id} p={p} />)}
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Camp Hero</span>
          <span>Made for parents who want the best summer.</span>
        </div>
      </footer>
    </div>
  );
}
