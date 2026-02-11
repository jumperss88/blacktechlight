"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products"; // важно: в lib/products.ts должен быть экспорт products

const categories = [
  { title: "Вращающиеся головы", href: "/catalog/rotating-heads" },
  { title: "Светодиодные прожекторы", href: "/catalog/led-fixtures" },
  { title: "Театральный свет", href: "/catalog/theatre" },
  { title: "Прожекторы следящего света", href: "/catalog/followspots" },
  { title: "Блайндеры и стробоскопы", href: "/catalog/blinders-strobes" },
  { title: "Генераторы спецэффектов", href: "/catalog/sfx" },
  { title: "Пульты управления", href: "/catalog/consoles" },
  { title: "Распределение сигнала", href: "/catalog/signal-distribution" },
  { title: "Кабель и разъемы", href: "/catalog/cables-connectors" },
  { title: "Струбцины", href: "/catalog/clamps" },
];

function SearchIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className ?? "h-5 w-5"}>
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function XIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className ?? "h-5 w-5"}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

// маленький “нормализатор”, чтобы поиск был человечнее
function norm(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export default function Header() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // товары, которые “мелькают”
  const featured = useMemo(() => {
    return (products ?? []).filter((p: any) => p?.featuredInSearch);
  }, []);

  // индекс для ротации
  const [promoIdx, setPromoIdx] = useState(0);

  // крутилка раз в 2 секунды, но только когда поиск открыт и строка пустая
  useEffect(() => {
    if (!openSearch) return;
    if (q.trim().length > 0) return;
    if (featured.length <= 1) return;

    const t = setInterval(() => {
      setPromoIdx((prev) => (prev + 1) % featured.length);
    }, 2000);

    return () => clearInterval(t);
  }, [openSearch, q, featured.length]);

  // фокус при открытии
  useEffect(() => {
    if (openSearch) setTimeout(() => inputRef.current?.focus(), 0);
  }, [openSearch]);

  // Esc закрывает
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenSearch(false);
    }
    if (openSearch) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  function goSearch() {
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
    setOpenSearch(false);
  }

  function goProduct(slug: string) {
    router.push(`/product/${slug}`);
    setOpenSearch(false);
  }

  // автоподсказки по вводу (появляются после первой буквы)
  const suggestions = useMemo(() => {
    const needle = norm(q);
    if (needle.length < 1) return [];

    const list = (products ?? []).filter((p: any) => {
      const hay = norm(`${p?.brand ?? ""} ${p?.title ?? ""} ${p?.short ?? ""}`);
      const kw = Array.isArray(p?.searchKeywords) ? p.searchKeywords.map(norm).join(" ") : "";
      return hay.includes(needle) || kw.includes(needle);
    });

    // сначала featured, потом остальные
    list.sort((a: any, b: any) => {
      const af = a?.featuredInSearch ? 0 : 1;
      const bf = b?.featuredInSearch ? 0 : 1;
      return af - bf;
    });

    return list.slice(0, 8);
  }, [q]);

  const promo = featured.length > 0 ? featured[promoIdx % featured.length] : null;

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 border-b border-black/10">
        <a className="flex items-center gap-3" href="/">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-xs font-bold text-white">BTL</div>
          <div className="leading-tight">
            <div className="text-lg font-semibold text-black">BlackTechLight</div>
            <div className="text-xs text-black/60">Световое и звуковое оборудование</div>
          </div>
        </a>

        <nav className="flex items-center gap-5 text-sm text-black/70">
          {/* Каталог */}
          <div className="group relative">
            <a className="hover:text-black" href="/catalog">
              Каталог
            </a>

            <div className="invisible absolute right-0 top-full z-40 h-4 w-[340px] opacity-0 group-hover:visible group-hover:opacity-100" />

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-[340px] rounded-2xl border border-black/10 bg-white p-2 shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="max-h-[360px] overflow-auto">
                {categories.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    className="block rounded-xl px-3 py-2 text-sm text-black/80 hover:bg-black/5 hover:text-black"
                  >
                    {c.title}
                  </a>
                ))}
              </div>

              <div className="mt-2 px-2 pb-1">
                <a
                  href="/catalog"
                  className="block rounded-xl bg-black px-3 py-2 text-center text-sm font-semibold text-white hover:bg-black/90"
                >
                  Открыть каталог
                </a>
              </div>
            </div>
          </div>

          <a className="hover:text-black" href="/contacts">
            Контакты
          </a>

          {/* Кнопка поиска */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-black/15 bg-white text-black hover:bg-black/5"
            aria-label="Открыть поиск"
            title="Поиск"
          >
            <SearchIcon />
          </button>

          <a className="rounded-xl bg-black px-4 py-2 font-semibold text-white hover:bg-black/90" href="/catalog">
            Смотреть товары
          </a>
        </nav>
      </div>

      {/* Оверлей поиска */}
      {openSearch && (
        <div className="absolute left-0 right-0 top-full z-50">
          <div className="fixed inset-0 bg-black/20" onClick={() => setOpenSearch(false)} />

          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mt-3 rounded-2xl border border-black/10 bg-white shadow-lg">
              <div className="flex items-center gap-2 px-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white">
                  <SearchIcon className="h-5 w-5" />
                </div>

                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goSearch();
                  }}
                  placeholder={
                    q.trim().length === 0 && promo
                      ? `Например: ${promo.brand} ${promo.title}`
                      : "Поиск по товарам (beam, wash, профиль...)"
                  }
                  className="h-10 flex-1 rounded-xl border border-black/20 bg-white px-4 text-sm text-black outline-none placeholder:text-black/40 focus:border-black"
                />

                <button
                  type="button"
                  onClick={goSearch}
                  className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Найти
                </button>

                <button
                  type="button"
                  onClick={() => setOpenSearch(false)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-black/15 bg-white text-black hover:bg-black/5"
                  aria-label="Закрыть поиск"
                  title="Закрыть"
                >
                  <XIcon />
                </button>
              </div>

              {/* НИЖНЯЯ ЧАСТЬ: либо промо-ротация, либо подсказки по вводу */}
              <div className="px-4 pb-4">
                {q.trim().length === 0 ? (
                  <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                    {promo ? (
                      <button
                        type="button"
                        onClick={() => goProduct(promo.slug)}
                        className="w-full rounded-xl bg-white px-4 py-3 text-left shadow-sm hover:bg-black/5"
                      >
                        <div className="text-xs text-black/50">Сейчас в подборке</div>
                        <div className="mt-1 text-sm font-semibold text-black">
                          {promo.brand} {promo.title}
                        </div>
                        <div className="mt-1 text-xs text-black/60">{promo.short}</div>
                        <div className="mt-2 text-xs font-semibold text-black/70">
                          Нажми, чтобы открыть карточку →
                        </div>
                      </button>
                    ) : (
                      <div className="text-sm text-black/60">
                        Для промо-подсказок отметь товары флагом{" "}
                        <span className="font-mono">featuredInSearch: true</span> в{" "}
                        <span className="font-mono">lib/products.ts</span>.
                      </div>
                    )}
                    <div className="mt-2 text-xs text-black/50">Подсказка меняется раз в 2 секунды.</div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-black/10 bg-white">
                    <div className="px-3 py-2 text-xs font-semibold text-black/50">Подсказки</div>
                    <div className="max-h-[320px] overflow-auto p-2">
                      {suggestions.length === 0 ? (
                        <div className="rounded-xl px-3 py-3 text-sm text-black/60">
                          Ничего не найдено. Попробуй другие слова.
                        </div>
                      ) : (
                        suggestions.map((p: any) => (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => goProduct(p.slug)}
                            className="block w-full rounded-xl px-3 py-2 text-left hover:bg-black/5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-black">
                                {p.brand} {p.title}
                              </div>
                              {p.featuredInSearch && (
                                <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
                                  промо
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-xs text-black/60">{p.short}</div>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="px-4 pt-1 text-xs text-black/50">
                      Enter — полный поиск, клик по подсказке — карточка товара.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
