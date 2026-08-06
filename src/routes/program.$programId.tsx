import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PROGRAMS } from "@/lib/programs";
import { useFavorites } from "@/lib/favorites";
import { ArrowLeft, Calendar, MapPin, DollarSign, Heart, Sparkles, Smile, GraduationCap, Check } from "lucide-react";

export const Route = createFileRoute("/program/$programId")({
  loader: ({ params }) => {
    const program = PROGRAMS.find((p) => p.id === params.programId);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.program ? [
      { title: `${loaderData.program.name} — Kodanz` },
      { name: "description", content: loaderData.program.description },
      { property: "og:title", content: loaderData.program.name },
      { property: "og:description", content: loaderData.program.description },
      { property: "og:image", content: loaderData.program.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Program not found</h1>
        <Link to="/" className="mt-6 inline-block text-accent font-semibold">← Back home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  component: ProgramPage,
});

function ScoreBar({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ElementType }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <Icon className="h-4 w-4" style={{ color }} /> {label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ProgramPage() {
  const { program: p } = Route.useLoaderData();
  const { has, toggle } = useFavorites();
  const fav = has(p.id);
  const showCollege = p.ageMax >= 13;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative aspect-[16/7] max-h-[480px] w-full overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 md:px-8 md:pb-12 text-white">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold opacity-90 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary">{p.type}</span>
            <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">Ages {p.ageMin}–{p.ageMax}</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">{p.name}</h1>
          <p className="mt-1 text-base font-medium opacity-90 md:text-lg">{p.organization}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <p className="text-lg leading-relaxed text-foreground/90">{p.description}</p>

            <section>
              <h2 className="mb-4 text-xl font-bold">Highlights</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {p.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2 rounded-xl bg-card border p-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">Score breakdown</h2>
              <div className="space-y-4 rounded-2xl border bg-card p-6">
                <ScoreBar label="Uniqueness" value={p.uniqueness} color="var(--score-unique)" icon={Sparkles} />
                <ScoreBar label="Fun Factor" value={p.fun} color="var(--score-fun)" icon={Smile} />
                {showCollege && (
                  <ScoreBar label="College Impact" value={p.collegeImpact} color="var(--score-college)" icon={GraduationCap} />
                )}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {p.interests.map((i: string) => (
                  <span key={i} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold">{i}</span>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 self-start space-y-4 rounded-2xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per Week</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">${p.costPerWeek}</span>
                <span className="text-sm text-muted-foreground">· {p.weeks} week{p.weeks > 1 ? "s" : ""} total</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-sm border-y py-4">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {p.distanceMi.toFixed(1)} mi · {p.city}, {p.state}</li>
              <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {p.startDate} → {p.endDate}</li>
              <li className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Total ~${p.costPerWeek * p.weeks}</li>
            </ul>

            <button
              className="w-full rounded-xl py-3 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-coral)", boxShadow: "var(--shadow-glow)" }}
            >
              Request Info
            </button>
            <button
              onClick={() => toggle(p.id)}
              className={`w-full rounded-xl border py-3 text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors ${
                fav ? "border-accent bg-accent/10 text-accent" : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <Heart className={`h-4 w-4 ${fav ? "fill-accent" : ""}`} />
              {fav ? "Saved" : "Save program"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}