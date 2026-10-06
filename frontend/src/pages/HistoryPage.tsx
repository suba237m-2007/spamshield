import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../services/api";
import type { Check } from "../types";

export default function HistoryPage() {
  const [rows, setRows] = useState<Check[]>([]);
  const [filter, setFilter] = useState<"all" | "spam" | "ham">("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRows(await api.history(filter === "all" ? undefined : filter)); }
    catch (e) { setError(e instanceof ApiError ? e.message : "Could not load history."); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  async function remove(id: number) {
    try { await api.deleteCheck(id); setRows((r) => r.filter((x) => x.id !== id)); }
    catch (e) { setError(e instanceof ApiError ? e.message : "Could not delete."); }
  }

  return (
    <div className="mx-auto h-full max-w-3xl space-y-4 overflow-y-auto p-4 md:p-8">
      <h1 className="font-display text-2xl font-bold">History</h1>
      <div className="flex gap-2" role="group" aria-label="Filter results">
        {(["all", "spam", "ham"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`rounded-full px-4 py-1.5 text-sm ${filter === f ? "bg-spruce text-mist" : "bg-white"}`}>
            {f === "all" ? "All" : f === "spam" ? "Spam" : "Not spam"}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="text-sm text-coral">{error}</p>}
      {loading ? <p className="text-ink/60">Loading…</p> : rows.length === 0 ? (
        <p className="text-ink/60">Nothing here yet. Check a message and it will show up in this list.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((c) => (
            <li key={c.id} className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm">
              <span className={`mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.label === "spam" ? "bg-coral/15 text-coral" : "bg-sage/15 text-spruce"}`}>
                {c.label === "spam" ? "Spam" : "Not spam"} {Math.round(c.spam_probability * 100)}%
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 break-words text-sm">{c.text}</p>
                <time className="text-xs text-ink/50">{new Date(c.created_at).toLocaleString()}</time>
              </div>
              <button onClick={() => remove(c.id)} aria-label="Delete result" className="p-1 opacity-60 hover:opacity-100"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
