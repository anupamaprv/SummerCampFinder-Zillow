import type { FilterState } from "@/lib/scoring";
import { ALL_TYPES, ALL_SCHEDULES } from "@/lib/programs";

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground/70 hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

export function Filters({ value, onChange }: Props) {
  const toggle = (key: "types" | "schedules", v: string) => {
    const cur = value[key];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    onChange({ ...value, [key]: next });
  };

  return (
    <aside className="space-y-6 rounded-2xl border bg-card p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Program Type</h3>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((t) => (
            <Toggle key={t} active={value.types.includes(t)} onClick={() => toggle("types", t)}>
              {t}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Schedule</h3>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SCHEDULES.map((s) => (
            <Toggle key={s} active={value.schedules.includes(s)} onClick={() => toggle("schedules", s)}>
              {s}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Max Cost</h3>
          <span className="text-sm font-bold text-foreground">${value.maxCost}/wk</span>
        </div>
        <input
          type="range" min={200} max={1000} step={25}
          value={value.maxCost}
          onChange={(e) => onChange({ ...value, maxCost: Number(e.target.value) })}
          className="w-full accent-[oklch(0.7_0.19_30)]"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Max Distance</h3>
          <span className="text-sm font-bold text-foreground">{value.maxDistance} mi</span>
        </div>
        <input
          type="range" min={1} max={50} step={1}
          value={value.maxDistance}
          onChange={(e) => onChange({ ...value, maxDistance: Number(e.target.value) })}
          className="w-full accent-[oklch(0.7_0.19_30)]"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange({ types: [], schedules: [], maxCost: 1000, maxDistance: 50 })}
        className="w-full rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
      >
        Reset filters
      </button>
    </aside>
  );
}