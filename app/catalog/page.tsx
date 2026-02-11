import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-black">Каталог</h1>
        <p className="mt-2 max-w-3xl text-sm text-black/60">
          Выберите категорию — внутри будут товары.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="text-lg font-semibold text-black">{c.title}</div>
              <div className="mt-2 text-sm text-black/60">
                Товаров: <b className="text-black">{c._count.products}</b>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
