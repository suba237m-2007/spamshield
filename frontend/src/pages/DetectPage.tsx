import { useEffect, useState } from "react";
import ResultCard from "../components/ResultCard";
import { api, ApiError } from "../services/api";
import type { Check, ModelInfo } from "../types";

export default function DetectPage() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Check[]>([]);
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bulk, setBulk] = useState(false);

  useEffect(() => { api.model().then(setInfo).catch(() => {}); }, []);

  async function run() {
    setError(""); setBusy(true);
    try {
      if (bulk) {
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length > 50) throw new ApiError("INVALID_INPUT", "Check up to 50 messages at a time.", 422);
        setResults(await api.detectBatch(lines));
      } else {
        setResults([await api.detect(text)]);
      }
    } catch (e) { setError(e instanceof ApiError ? e.message : "Could not check the message."); }
    finally { setBusy(false); }
  }

  return (
    <div className="mx-auto h-full max-w-3xl space-y-4 overflow-y-auto p-4 md:p-8">
      <h1 className="font-display text-2xl font-bold">Check a message</h1>
      {info?.note && <p className="rounded-lg bg-signal/20 p-3 text-sm">{info.note} Train one with <code>python -m app.ml.train</code>.</p>}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={bulk} onChange={(e) => setBulk(e.target.checked)} />
        Check several messages (one per line)
      </label>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={bulk ? 8 : 5} maxLength={bulk ? 50000 : 2000}
        aria-label="Message to check" placeholder={bulk ? "Paste one message per line" : "Paste the message you received"}
        className="w-full rounded-lg border border-ink/20 bg-white p-3" />
      <button onClick={run} disabled={!text.trim() || busy} className="rounded-lg bg-spruce px-5 py-2.5 font-medium text-mist disabled:opacity-50">
        {busy ? "Checking…" : "Check message"}
      </button>
      {error && <p role="alert" className="text-sm text-coral">{error}</p>}
      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.id}>
            {results.length > 1 && <p className="mb-1 truncate text-sm text-ink/60">{r.text}</p>}
            <ResultCard check={r} />
          </div>
        ))}
      </div>
    </div>
  );
}
