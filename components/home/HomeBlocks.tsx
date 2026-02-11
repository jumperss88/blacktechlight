import Link from "next/link";
import { prisma } from "@/lib/prisma";

type BlockKey =
  | "hero"
  | "catalog"
  | "procurement"
  | "about"
  | "service"
  | "portfolio";

export default async function HomeBlocks() {
  const blocks = await prisma.homeBlock.findMany({
    where: { isEnabled: true },
    orderBy: { sortOrder: "asc" },
  });

  // Для блока "Каталог" и "Портфолио" подтянем данные
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const projects = await prisma.portfolioProject.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });

  return (
    <div className="grid gap-10">
      {blocks.map((b) => {
        const key = b.key as BlockKey;

        // HERO
        if (key === "hero") {
          return (
            <section
              key={b.id}
              className="rounded-3xl border border-black/10 bg-white p-10 shadow-sm"
            >
              <div className="text-sm text-black/50">Каталог • КП • Подбор</div>
              <h1 className="mt-3 text-5xl font-black leading-[1.05] tracking-tight">
                {b.title}
              </h1>
              {b.subtitle ? (
                <p className="mt-4 max-w-3xl text-black/70">{b.subtitle}</p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/catalog"
                  className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Перейти в каталог
                </Link>
                <Link
                  href="/contacts"
                  className="rounded-2xl border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5"
                >
                  Связаться
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold">Подбор под ТЗ</div>
                  <div className="mt-2 text-sm text-black/60">
                    Поможем собрать комплект под зал, сцену, прокат, театр.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold">Документы и гарантия</div>
                  <div className="mt-2 text-sm text-black/60">
                    Паспорт, даташит, гарантийные условия — всё по полкам.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold">Быстрый КП</div>
                  <div className="mt-2 text-sm text-black/60">
                    Заявка с сайта → почта/Telegram → ты отвечаешь клиенту.
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // CATALOG
        if (key === "catalog") {
          return (
            <section key={b.id}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold">{b.title}</div>
                  {b.subtitle ? (
                    <div className="mt-1 text-sm text-black/60">{b.subtitle}</div>
                  ) : null}
                </div>
                <Link
                  href="/catalog"
                  className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
                >
                  Открыть
                </Link>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {categories.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    href={`/catalog/${c.slug}`}
                    className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:bg-black/[0.02]"
                  >
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="mt-2 text-xs text-black/50">
                      Перейти в категорию →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        // PROCUREMENT
        if (key === "procurement") {
          return (
            <section
              key={b.id}
              className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm"
            >
              <div className="text-2xl font-bold">{b.title}</div>
              {b.subtitle ? (
                <div className="mt-2 text-sm text-black/60">{b.subtitle}</div>
              ) : null}

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 p-5">
                  <div className="text-sm font-semibold">Подбор эквивалентов</div>
                  <div className="mt-2 text-sm text-black/60">
                    Под ТЗ / КТРУ, без лишней воды.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 p-5">
                  <div className="text-sm font-semibold">Документы</div>
                  <div className="mt-2 text-sm text-black/60">
                    Декларации, паспорта, письма, КП — всё соберём.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 p-5">
                  <div className="text-sm font-semibold">Сроки и логистика</div>
                  <div className="mt-2 text-sm text-black/60">
                    Планирование поставки, комплектация, сопровождение.
                  </div>
                </div>
              </div>

              <Link
                href="/procurement"
                className="mt-6 inline-flex rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                Подробнее
              </Link>
            </section>
          );
        }

        // ABOUT / SERVICE -> ведём на страницу
        if (key === "about" || key === "service") {
          const href = key === "about" ? "/about" : "/service";
          return (
            <section
              key={b.id}
              className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm"
            >
              <div className="text-2xl font-bold">{b.title}</div>
              {b.subtitle ? (
                <div className="mt-2 text-sm text-black/60">{b.subtitle}</div>
              ) : null}
              <Link
                href={href}
                className="mt-6 inline-flex rounded-2xl border border-black/15 px-6 py-3 text-sm font-semibold hover:bg-black/5"
              >
                Открыть страницу
              </Link>
            </section>
          );
        }

        // PORTFOLIO
        if (key === "portfolio") {
          return (
            <section key={b.id}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold">{b.title}</div>
                  {b.subtitle ? (
                    <div className="mt-1 text-sm text-black/60">{b.subtitle}</div>
                  ) : null}
                </div>
                <Link
                  href="/portfolio"
                  className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
                >
                  Все проекты
                </Link>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/60">
                    Пока проектов нет — добавишь 2–3 в админке, и тут появится сетка.
                  </div>
                ) : (
                  projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/portfolio/${p.slug}`}
                      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:bg-black/[0.02]"
                    >
                      <div className="text-sm font-semibold">{p.title}</div>
                      <div className="mt-2 text-xs text-black/50">
                        {p.city ? `${p.city} • ` : ""}
                        {p.year ? p.year : ""}
                      </div>
                      <div className="mt-2 text-sm text-black/60 line-clamp-3">
                        {p.summary}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          );
        }

        // если ключ неизвестный — не рендерим
        return null;
      })}
    </div>
  );
}
