"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type KeyStatus = { configured: boolean; preview: string | null };
type SettingsResponse = {
  storeConfigured: boolean;
  keys: Record<"YOUTUBE_API_KEY" | "ANTHROPIC_API_KEY", KeyStatus>;
};

const FIELDS: { key: "YOUTUBE_API_KEY" | "ANTHROPIC_API_KEY"; label: string; help: string }[] = [
  {
    key: "YOUTUBE_API_KEY",
    label: "YouTube Data API v3 key",
    help: "From Google Cloud Console — powers Faceless Outliers search.",
  },
  {
    key: "ANTHROPIC_API_KEY",
    label: "Anthropic (Claude) API key",
    help: "From console.anthropic.com — powers AI Recommendations.",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/settings");
    if (res.ok) setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(key: string) {
    const value = drafts[key];
    if (!value?.trim()) return;
    setError(null);
    setStatus(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Save failed");
      return;
    }
    setStatus(`${key} saved.`);
    setDrafts((d) => ({ ...d, [key]: "" }));
    load();
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 text-neutral-50">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin · Settings</h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-neutral-400 hover:bg-white/5"
          >
            Sign out
          </button>
        </div>

        {data && !data.storeConfigured && (
          <div className="mb-6 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            No settings database connected yet, so keys saved here won&apos;t persist.
            Create a free Upstash Redis database (upstash.com), then add its REST URL
            and token as <code>UPSTASH_REDIS_REST_URL</code> /{" "}
            <code>UPSTASH_REDIS_REST_TOKEN</code> env vars on the Vercel project.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        {status && (
          <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            {status}
          </div>
        )}

        <div className="space-y-5">
          {FIELDS.map((field) => {
            const current = data?.keys[field.key];
            return (
              <div key={field.key} className="rounded-lg border border-white/10 bg-neutral-900/60 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{field.label}</span>
                  <span
                    className={`text-xs ${current?.configured ? "text-emerald-400" : "text-neutral-500"}`}
                  >
                    {current?.configured ? `connected (${current.preview})` : "not set"}
                  </span>
                </div>
                <p className="mb-3 text-xs text-neutral-500">{field.help}</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={drafts[field.key] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [field.key]: e.target.value }))}
                    placeholder="Paste new key"
                    className="flex-1 rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => handleSave(field.key)}
                    className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400"
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
