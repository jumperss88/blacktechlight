import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SavedToast from "@/components/SavedToast";

type Props = {
  searchParams?: Promise<{ saved?: string }>;
};

async function saveMenuItem(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();
  const href = String(formData.get("href") || "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") || "").trim();
  const isEnabled = formData.get("isEnabled") === "on";

  const sortOrder = Number.isFinite(Number(sortOrderRaw)) ? Number(sortOrderRaw) : 0;

  if (!id || !label || !href) redirect("/admin/menu");

  await prisma.menuItem.update({
    where: { id },
    data: { label, href, sortOrder, isEnabled },
  });

  // обновляем хедер на сайте + страницу админки
  revalidatePath("/");
  revalidatePath("/admin/menu");

  redirect("/admin/menu?saved=1");
}

export default async function AdminMenuPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const items = await prisma.menuItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <SavedToast show={sp.saved === "1"} />

      <h1 className="text-xl font-bold">Хедер — меню</h1>
      <p className="mt-2 text-sm text-black/60">
        Эти пункты показываются в верхнем меню сайта. После сохранения изменения применяются сразу.
      </p>

      <div className="mt-6 grid gap-4">
        {items.map((m) => (
          <form
            key={m.id}
            action={saveMenuItem}
            className="rounded-2xl border border-black/10 p-4"
          >
            <input type="hidden" name="id" value={m.id} />

            <div className="grid gap-3 md:grid-cols-[140px_1fr_1fr_160px] md:items-end">
              <label className="grid gap-2">
                <div className="text-xs text-black/60">Порядок</div>
                <input
                  name="sortOrder"
                  defaultValue={m.sortOrder}
                  inputMode="numeric"
                  className="rounded-xl border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
                />
              </label>

              <label className="grid gap-2">
                <div className="text-xs text-black/60">Название</div>
                <input
                  name="label"
                  defaultValue={m.label}
                  className="rounded-xl border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
                />
              </label>

              <label className="grid gap-2">
                <div className="text-xs text-black/60">Ссылка</div>
                <input
                  name="href"
                  defaultValue={m.href}
                  className="rounded-xl border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
                  placeholder="/about"
                />
              </label>

              <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90">
                Сохранить
              </button>
            </div>

            <label className="mt-3 flex items-center gap-3 text-sm">
              <input type="checkbox" name="isEnabled" defaultChecked={m.isEnabled} />
              Показывать
            </label>
          </form>
        ))}
      </div>
    </div>
  );
}
