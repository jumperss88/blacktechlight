"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { categories, products, formatRub, getCategoryTitle } from "@/lib/products";

type SortMode = "relevance" | "price-asc" | "price-desc";

export default function CategoryPage() {
  const params = useParams();
  const raw = params?.category;
  const category = Array.isArray(raw) ? raw[0] : raw;

  const [sort, setSort] = useState<SortMode>("relevance");

  const catExists = !!category && categories.some((c) => c.slug === category);
  const title = getCategoryTitle(category ?? "");

  const items = useMemo(() => {
    if (!category) return [];
    let list = products.filter((p) => p.category === category);

    if (sort === "price-asc") {
      list = list.slice().sort((a, b) => {
        const ap = a.price ?? Number.POSITIVE_INFINITY; // "по запросу" вниз
        const bp = b.price ?? Number.POSITIVE_INFINITY;
        return ap - bp;
      });
    }

    if (sort === "price-desc") {
      list = list.slice().sort((a, b) => {
        if (a.price === null && b.price !== null) return 1;
        if (a.price !== null && b.price === null) return -1;
        const ap = a.price ?? 0;
        const bp = b.price ?? 0;
        return bp - ap;
      });
    }

    return list;
  }, [category, sort]);

  if (!catExists) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
          <h1 className="text-2xl font-bold text-black">Категория не найдена</h1>
          <p className="mt-2 text-sm text-black/60">
            Проверь ссылку или перейди в каталог.
          </p>

          <a
            href="/catalog"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            В каталог
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
        <div className="text-sm text-black/60">
          <a className="hover:text-black" href="/catalog">
            Каталог
          </a>{" "}
          / {title}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">{title}</h1>
            <p className="mt-2 text-sm text-black/60">
              Товаров: <b className="text-black">{items.length}</b>
            </p>
          </div>

          {/* Только сортировка */}
          <div className="w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="w-full sm:w-auto rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black"
            >
              <option value="relevance">Сортировка: по умолчанию</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
            </select>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-black">Пока пусто</div>
            <p className="mt-2 text-sm text-black/60">
              В этой категории ещё нет товаров.
            </p>
            <a
              href="/catalog"
              className="mt-4 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
            >
              Назад в каталог
            </a>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <a
                key={p.slug}
                href={`/product/${p.slug}`}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="text-xs text-black/50">{p.brand}</div>
                <div className="mt-2 text-lg font-semibold text-black">{p.title}</div>
                <div className="mt-2 text-sm text-black/60">
                  {p.price === null ? "Цена: по запросу" : `Цена: ${formatRub(p.price)}`}
                </div>
                <div className="mt-2 text-xs text-black/50">{p.availability}</div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10">
          <a className="text-sm text-black/70 hover:text-black" href="/catalog">
            ← Назад в каталог
          </a>
        </div>
      </section>
    </main>
  );
}
