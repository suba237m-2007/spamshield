import { useEffect, useState } from "react";
import { api, ApiError } from "../services/api";
import type { ModelInfo, Stats } from "../types";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.stats().then(setStats).catch((e) => setError(e instanceof ApiError ? e.message : "Could not load stats."));
    api.model().then(setInfo).catch(() => {});
  }, []);

  const card = "rounded-xl bg-white p-4 shadow-sm";
  const max = Math.max(1, ...(stats?.per_day.map((d) => d.spam + d.ham) ?? [1]));
  return (
    <div className="mx-auto h-full max-w-4xl space-y-4 overflow-y-auto p-4 md:p-8">
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      {error && <p role="alert" className="text-sm text-coral">{error}</p>}
      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className={card}><p className="text-sm text-ink/60">Checked</p><p className="font-display text-3xl font-bold">{stats.total}</p></div>
            <div className={card}><p className="text-sm text-ink/60">Spam</p><p className="font-display text-3xl font-bold text-coral">{stats.spam}</p></div>
            <div className={card}><p className="text-sm text-ink/60">Not spam</p><p className="font-display text-3xl font-bold text-spruce">{stats.ham}</p></div>
            <div className={card}><p className="text-sm text-ink/60">Spam rate</p><p className="font-display text-3xl font-bold">{Math.round(stats.spam_rate * 100)}%</p></div>
          </div>
          <div className={card}>
            <h2 className="mb-3 font-medium">Last 14 days</h2>
            {stats.per_day.length === 0 ? <p className="text-sm text-ink/60">No messages checked in this period.</p> : (
              <div className="flex h-40 items-end gap-2">
                {stats.per_day.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full flex-1 flex-col justify-end" title={`${d.date}: ${d.spam} spam, ${d.ham} not spam`}>
                      <div className="w-full bg-coral" style={{ height: `${(d.spam / max) * 100}%` }} />
                      <div className="w-full bg-sage" style={{ height: `${(d.ham / max) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-ink/50">{d.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-ink/60">Red is spam, green is not spam.</p>
          </div>
        </>
      )}
      {info && (
        <div className={card}>
          <h2 className="mb-1 font-medium">Detection engine</h2>
          {info.metrics ? (
            <p className="text-sm">Trained model on {info.metrics.dataset_size} messages. Held-out test: accuracy {info.metrics.accuracy}, precision {info.metrics.precision}, recall {info.metrics.recall}, F1 {info.metrics.f1}.</p>
          ) : <p className="text-sm">{info.note ?? "Trained model loaded."}</p>}
        </div>
      )}
    </div>
  );
}
