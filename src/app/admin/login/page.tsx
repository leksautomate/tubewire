"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Wrong password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900/60 p-6"
      >
        <h1 className="mb-1 text-lg font-semibold">tubewire admin</h1>
        <p className="mb-5 text-sm text-neutral-500">Sign in to manage API keys.</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
