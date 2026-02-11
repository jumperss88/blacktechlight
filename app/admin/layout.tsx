"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function onLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      // перекидываем на логин и обновляем состояние
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Admin • BlackTechLight</div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
          >
            Выйти
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <nav className="grid gap-1 text-sm">
              <Link className="rounded-xl px-3 py-2 hover:bg-black/5" href="/admin">
                Главная (блоки)
              </Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-black/5" href="/admin/pages">
                Страницы
              </Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-black/5" href="/admin/products">
                Товары
              </Link>
              <Link className="rounded-xl px-3 py-2 hover:bg-black/5" href="/admin/menu">
                Хедер (меню)
              </Link>
            </nav>
          </aside>

          <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
