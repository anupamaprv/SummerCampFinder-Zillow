import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, MapPin, Cake, Sparkles } from "lucide-react";
import { ALL_INTERESTS } from "@/lib/programs";
import type { Interest } from "@/lib/types";

interface Props {
  initial?: { zip?: string; age?: number; interests?: Interest[] };
  variant?: "hero" | "compact";
}

export function SearchForm({ initial, variant = "hero" }: Props) {
  const navigate = useNavigate();
  const [zip, setZip] = useState(initial?.zip ?? "");
  const [age, setAge] = useState<number>(initial?.age ?? 10);
  const [interests, setInterests] = useState<Interest[]>(initial?.interests ?? []);

  const toggleInterest = (i: Interest) => {
    setInterests((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: {
        zip: zip || "00000",
        age,
        interests,
        sort: "relevance",
        maxCost: 1000,
        maxDistance: 50,
        types: [],
        schedules: [],
      },
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-card p-3 md:p-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_auto] md:gap-2">
        <label className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">ZIP</div>
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="19702"
              inputMode="numeric"
              className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
          <Cake className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Age <span className="text-accent">*</span></div>
            <input
              type="number" min={4} max={18} required
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-transparent text-base font-semibold text-black outline-none"
            />
          </div>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "var(--gradient-coral)", boxShadow: "var(--shadow-glow)" }}
        >
          <Search className="h-5 w-5" />
          Find Programs
        </button>
      </div>

      {variant === "hero" && (
        <div className="mt-4 px-1">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Interests (optional)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_INTERESTS.map((i) => {
              const active = interests.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
}