"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const fd = new FormData();
    fd.set("password", password);

    const r = await fetch("/api/admin/login", { method: "POST", body: fd });
    setLoading(false);

    if (!r.ok) {
      setErr("Неверный пароль");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-bold">Админка</h1>
        <p className="mt-2 text-sm text-black/60">Введи пароль администратора.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            disabled={loading}
            className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </main>
  );
}
