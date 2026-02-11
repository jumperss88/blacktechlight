import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsList() {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="text-lg font-semibold">Товары</div>
      <p className="mt-1 text-sm text-black/60">
        Редактируй карточки товаров и параметры для поиска.
      </p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.03]">
            <tr className="text-left">
              <th className="px-4 py-3">Товар</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Наличие</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-black/10">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {p.brand} {p.title}
                  </div>
                  <div className="font-mono text-xs text-black/50">{p.slug}</div>
                </td>
                <td className="px-4 py-3">{p.category?.title ?? "—"}</td>
                <td className="px-4 py-3">{p.availability}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    className="rounded-xl border border-black/15 px-3 py-2 text-xs hover:bg-black/5"
                    href={`/admin/products/${encodeURIComponent(p.slug)}`}
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-sm text-black/60" colSpan={4}>
                  Пока нет товаров.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
