import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import SavedToast from "@/components/SavedToast";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

async function save(formData: FormData) {
  "use server";

  const productId = String(formData.get("productId") || "");
  if (!productId) redirect("/admin/products");

  const title = String(formData.get("title") || "");
  const brand = String(formData.get("brand") || "");
  const availability = String(formData.get("availability") || "");
  const short = String(formData.get("short") || "");
  const descriptionMd = String(formData.get("descriptionMd") || "");
  const featuredInSearch = formData.get("featuredInSearch") === "on";
  const searchKeywords = String(formData.get("searchKeywords") || "");
  const categoryId = String(formData.get("categoryId") || "");

  const priceRaw = String(formData.get("price") || "").trim();
  const price =
    priceRaw === ""
      ? null
      : Number.isFinite(Number(priceRaw))
      ? Number(priceRaw)
      : null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      title,
      brand,
      price,
      availability,
      short,
      descriptionMd,
      featuredInSearch,
      searchKeywords,
      categoryId,
    },
  });

  const updated = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  // ревалидация публичных и админских страниц
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/search");

  if (updated) {
    revalidatePath(`/product/${updated.slug}`);
    if (updated.category?.slug) revalidatePath(`/catalog/${updated.category.slug}`);

    // ВАЖНО: уникальный saved, чтобы Next точно перерисовал страницу
    redirect(`/admin/products/${encodeURIComponent(updated.slug)}?saved=${Date.now()}`);
  }

  redirect("/admin/products");
}

export default async function AdminProductEdit({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const savedKey = sp.saved ? String(sp.saved) : "";

  const product =
    (await prisma.product.findUnique({
      where: { slug: id },
      include: { category: true },
    })) ||
    (await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }));

  if (!product) {
    return (
      <div>
        <div className="text-lg font-semibold">Товар не найден</div>
        <p className="mt-2 text-sm text-black/60">
          Не найден товар по значению: <span className="font-mono">{id}</span>
        </p>
        <a
          href="/admin/products"
          className="mt-4 inline-flex rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Назад к товарам
        </a>
      </div>
    );
  }

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  // Ключ для перемонтирования формы:
  // меняется при каждом сохранении (saved=timestamp), иначе берём updatedAt.
  const formKey = savedKey || String(product.updatedAt.getTime());

  return (
    <div>
      <SavedToast />

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Редактирование товара</div>
          <div className="mt-1 text-sm text-black/60">
            <span className="font-mono text-xs">/product/{product.slug}</span>
          </div>
          <div className="mt-1 text-xs text-black/50">
            Последнее обновление: {new Date(product.updatedAt).toLocaleString("ru-RU")}
          </div>
        </div>

        <a
          href={`/product/${encodeURIComponent(product.slug)}`}
          className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
          target="_blank"
          rel="noreferrer"
        >
          Открыть на сайте
        </a>
      </div>

      <form key={formKey} action={save} className="mt-6 grid gap-4">
        <input type="hidden" name="productId" value={product.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <div className="text-sm font-medium">Бренд</div>
            <input
              name="brand"
              defaultValue={product.brand}
              className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              required
            />
          </label>

          <label className="grid gap-2">
            <div className="text-sm font-medium">Название</div>
            <input
              name="title"
              defaultValue={product.title}
              className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <div className="text-sm font-medium">Категория</div>
            <select
              name="categoryId"
              defaultValue={product.categoryId}
              className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <div className="text-sm font-medium">Цена (пусто = по запросу)</div>
            <input
              name="price"
              defaultValue={product.price ?? ""}
              inputMode="numeric"
              className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="например 129900"
            />
          </label>

          <label className="grid gap-2">
            <div className="text-sm font-medium">Наличие</div>
            <input
              name="availability"
              defaultValue={product.availability}
              className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="В наличии / Под заказ / По запросу"
              required
            />
          </label>
        </div>

        <label className="grid gap-2">
          <div className="text-sm font-medium">Короткое описание</div>
          <input
            name="short"
            defaultValue={product.short}
            className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />
        </label>

        <label className="grid gap-2">
          <div className="text-sm font-medium">Описание (Markdown)</div>
          <textarea
            name="descriptionMd"
            defaultValue={product.descriptionMd}
            rows={12}
            className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <div className="text-sm font-medium">Ключевые слова (через запятую)</div>
            <input
              name="searchKeywords"
              defaultValue={product.searchKeywords}
              className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="wash, заливка, led, 7x40"
            />
          </label>

          <label className="flex items-center gap-3 text-sm mt-7">
            <input
              type="checkbox"
              name="featuredInSearch"
              defaultChecked={product.featuredInSearch}
            />
            Показывать в “быстрых подсказках” поиска
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90">
            Сохранить
          </button>

          <a
            href="/admin/products"
            className="rounded-xl border border-black/15 px-5 py-3 text-sm hover:bg-black/5"
          >
            Назад
          </a>
        </div>
      </form>
    </div>
  );
}
