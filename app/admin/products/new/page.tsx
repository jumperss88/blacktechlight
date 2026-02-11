import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createProduct(fd: FormData) {
  "use server";
  const slug = String(fd.get("slug") || "").trim();
  const title = String(fd.get("title") || "").trim();
  const brand = String(fd.get("brand") || "").trim();
  const availability = String(fd.get("availability") || "").trim();
  const short = String(fd.get("short") || "").trim();
  const descriptionMd = String(fd.get("descriptionMd") || "").trim();
  const featuredInSearch = fd.get("featuredInSearch") === "on";
  const searchKeywords = String(fd.get("searchKeywords") || "").trim();
  const categoryId = String(fd.get("categoryId") || "");

  const priceRaw = String(fd.get("price") || "").trim();
  const price = priceRaw.length ? Number(priceRaw) : null;

  const created = await prisma.product.create({
    data: {
      slug,
      title,
      brand,
      availability,
      short,
      descriptionMd,
      featuredInSearch,
      searchKeywords,
      price: price === null ? null : Math.max(0, Math.floor(price)),
      categoryId,
    },
  });

  redirect(`/admin/products/${created.id}`);
}

export default async function AdminProductNew() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-bold">Добавить товар</h1>

      <form action={createProduct} className="mt-6 grid gap-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs text-black/60">Slug (например beam-260)</label>
            <input name="slug" required className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-black/60">Категория</label>
            <select name="categoryId" className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs text-black/60">Название</label>
            <input name="title" required className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-black/60">Бренд</label>
            <input name="brand" defaultValue="BlackTechLight" className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-xs text-black/60">Цена (пусто = “по запросу”)</label>
            <input name="price" inputMode="numeric" className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label className="text-xs text-black/60">Наличие</label>
            <input name="availability" defaultValue="По запросу" className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featuredInSearch" />
          ⭐ Показывать в “быстрых подсказках” поиска (мини-реклама)
        </label>

        <div className="grid gap-2">
          <label className="text-xs text-black/60">Ключевые слова (через запятую)</label>
          <input name="searchKeywords" placeholder="wash, заливка, led, 7x40" className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-black/60">Короткое описание</label>
          <textarea name="short" rows={3} className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-black/60">Описание (Markdown)</label>
          <textarea name="descriptionMd" rows={10} className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black" />
        </div>

        <button className="w-fit rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90">
          Создать
        </button>
      </form>
    </div>
  );
}
