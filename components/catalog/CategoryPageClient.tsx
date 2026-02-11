"use client";

import { useMemo, useState } from "react";

type SortMode = "relevance" | "price-asc" | "price-desc";

type ProductItem = {
  slug: string;
  title: string;
  brand: string;
  price: number | null;
  availability: string;
};

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export default function CategoryPageClient({
  title,
  items,
}: {
  title: string;
  items: ProductItem[];
}) {
  const [sort, setSort] = useState<SortMode>("relevance");

  const sortedItems = useMemo(() => {
    let list = items;

    if (sort === "price-asc") {
      list = list.slice().sort((a, b) => {
        const ap = a.price ?? Number.POSITIVE_INFINITY;
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
  }, [items, sort]);

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
              Товаров: <b className="text-black">{sortedItems.length}</b>
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black sm:w-auto"
            >
              <option value="relevance">Сортировка: по умолчанию</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
            </select>
          </div>
        </div>

        {sortedItems.length === 0 ? (
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
            {sortedItems.map((p) => (
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
