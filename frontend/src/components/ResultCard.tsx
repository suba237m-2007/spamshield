import type { Check } from "../types";

export default function ResultCard({ check }: { check: Check }) {
  const spam = check.label === "spam";
  const pct = Math.round(check.spam_probability * 100);
  return (
    <div className={`rounded-xl border-l-4 bg-white p-4 shadow-sm ${spam ? "border-coral" : "border-sage"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={`font-display text-2xl font-bold ${spam ? "text-coral" : "text-spruce"}`}>{spam ? "Spam" : "Not spam"}</p>
        <p className="text-sm text-ink/60">{pct}% spam score</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10" role="img" aria-label={`Spam score ${pct} percent`}>
        <div className={`h-full ${spam ? "bg-coral" : "bg-sage"}`} style={{ width: `${pct}%` }} />
      </div>
      {check.reasons.length > 0 ? (
        <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm">{check.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
      ) : (
        <p className="mt-3 text-sm text-ink/60">No spam signals found.</p>
      )}
      <p className="mt-3 text-xs text-ink/50">
        {check.engine === "model" ? "Scored by the trained model." : "Scored by rule-based signals (no trained model loaded)."}
      </p>
    </div>
  );
}
