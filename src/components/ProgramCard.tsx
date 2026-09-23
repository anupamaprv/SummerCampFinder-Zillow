import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MapPin, Calendar, DollarSign, Sparkles, Smile, GraduationCap } from "lucide-react";
import type { ScoredProgram } from "@/lib/scoring";
import { useFavorites } from "@/lib/favorites";
import { toast } from "sonner";

function ScorePill({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1">
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

export function ProgramCard({ p }: { p: ScoredProgram }) {
  const { has, toggle } = useFavorites();
  const fav = has(p.id);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <Link
        to="/program/$programId"
        params={{ programId: p.id }}
        className="block"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary">
              {p.type}
            </span>
            {p.matchedInterests > 0 && (
              <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-accent-foreground"
                    style={{ background: "var(--gradient-coral)" }}>
                {p.matchedInterests} match{p.matchedInterests > 1 ? "es" : ""}
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-lg font-bold leading-tight">{p.name}</h3>
            <p className="text-xs font-medium opacity-90">{p.organization}</p>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.distanceMi.toFixed(1)} mi · {p.city}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.weeks}w · {p.schedule}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-foreground"><DollarSign className="h-3 w-3" /> {p.costPerWeek}/wk</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <ScorePill icon={Sparkles} label="Unique" value={p.uniqueness} color="var(--score-unique)" />
            <ScorePill icon={Smile} label="Fun" value={p.fun} color="var(--score-fun)" />
            {p.showCollege && (
              <ScorePill icon={GraduationCap} label="College" value={p.collegeImpact} color="var(--score-college)" />
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); toggle(p.id); }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-primary shadow-md transition-all hover:scale-110 active:scale-95"
        aria-label={fav ? "Remove from saved" : "Save program"}
      >
        <Heart className={`h-4 w-4 ${fav ? "fill-accent text-accent" : ""}`} />
      </button>
    </article>
  );
}