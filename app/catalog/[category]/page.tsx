import CategoryPageClient from "@/components/catalog/CategoryPageClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const categoryRow = await prisma.category.findUnique({
    where: { slug: category },
  });

  if (!categoryRow) {
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

  const items = await prisma.product.findMany({
    where: { category: { slug: category } },
    select: {
      slug: true,
      title: true,
      brand: true,
      price: true,
      availability: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <CategoryPageClient title={categoryRow.title} items={items} />;
}
