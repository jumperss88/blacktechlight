import SearchPageClient from "@/components/search/SearchPageClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const initialQ = sp.q ? String(sp.q) : "";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        title: true,
        brand: true,
        price: true,
        availability: true,
        short: true,
        descriptionMd: true,
        searchKeywords: true,
        category: { select: { slug: true } },
      },
    }),
  ]);

  const items = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    price: p.price,
    availability: p.availability,
    short: p.short,
    descriptionMd: p.descriptionMd,
    searchKeywords: p.searchKeywords,
    categorySlug: p.category.slug,
  }));

  return <SearchPageClient categories={categories} products={items} initialQ={initialQ} />;
}
