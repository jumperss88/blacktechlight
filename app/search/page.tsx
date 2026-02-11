"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, formatRub } from "@/lib/products";

type SortMode = "relevance" | "price-asc" | "price-desc";
type StockMode = "all" | "in-stock" | "preorder" | "request";

function matchesStock(mode: StockMode, availability: string, price: number | null) {
  const a = (availability || "").toLowerCase();

  if (mode === "all") return true;
  if (mode === "request") return price === null || a.includes("запрос");
  if (mode === "in-stock") return a.includes("в наличии") || a.includes("налич");
  if (mode === "preorder") return a.includes("под заказ") || a.includes("заказ");
  return true;
}

export default function SearchPage() {
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState<string>("all");
  const [stock, setStock] = useState<StockMode>("all");
  const [sort, setSort] = useState<SortMode>("relevance");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = products;

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    list = list.filter((p) => matchesStock(stock, p.availability, p.price));

    if (query) {
      list = list.filter((p) => {
        const hay = `${p.brand} ${p.title} ${p.short} ${p.description}`.toLowerCase();
        return hay.includes(query);
      });
    }

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
  }, [q, category, stock, sort]);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-black">Поиск</h1>
        <p className="mt-2 text-sm text-black/60">
          Введи запрос и уточни параметры — как тебе удобно.
        </p>

        {/* Панель поиска */}
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid gap-2 md:grid-cols-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Что ищем? (например: beam, wash, профильный)"
              className="md:col-span-2 w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-black"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-black/20 bg-white px-3 py-3 text-sm text-black outline-none focus:border-black"
            >
              <option value="all">Все категории</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={stock}
              onChange={(e) => setStock(e.target.value as StockMode)}
              className="w-full rounded-xl border border-black/20 bg-white px-3 py-3 text-sm text-black outline-none focus:border-black"
            >
              <option value="all">Наличие: любое</option>
              <option value="in-stock">В наличии</option>
              <option value="preorder">Под заказ</option>
              <option value="request">По запросу</option>
            </select>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-black/60">
              Найдено: <b className="text-black">{items.length}</b>
            </div>

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

        {/* Результаты */}
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-black">Ничего не найдено</div>
            <p className="mt-2 text-sm text-black/60">
              Попробуй изменить запрос или фильтры.
            </p>
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
      </section>
    </main>
  );
}
