import { prisma } from "@/lib/prisma";

export default async function DebugPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const menu = await prisma.menuItem.findMany({ orderBy: { sortOrder: "asc" } });
  const blocks = await prisma.homeBlock.findMany({ orderBy: { sortOrder: "asc" } });
  const pages = await prisma.sitePage.findMany({ orderBy: { slug: "asc" } });

  return (
    <main className="mx-auto max-w-4xl p-6 text-black">
      <h1 className="text-2xl font-bold">DB Debug</h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Меню</h2>
        <pre className="mt-2 rounded-xl border border-black/10 bg-white p-4 text-sm overflow-auto">
          {JSON.stringify(menu, null, 2)}
        </pre>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Категории</h2>
        <pre className="mt-2 rounded-xl border border-black/10 bg-white p-4 text-sm overflow-auto">
          {JSON.stringify(categories, null, 2)}
        </pre>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Блоки главной</h2>
        <pre className="mt-2 rounded-xl border border-black/10 bg-white p-4 text-sm overflow-auto">
          {JSON.stringify(blocks, null, 2)}
        </pre>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Страницы</h2>
        <pre className="mt-2 rounded-xl border border-black/10 bg-white p-4 text-sm overflow-auto">
          {JSON.stringify(pages, null, 2)}
        </pre>
      </section>
    </main>
  );
}
