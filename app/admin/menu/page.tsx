import { prisma } from "@/lib/prisma";

async function saveMenu(fd: FormData) {
  "use server";
  const id = String(fd.get("id") || "");
  const label = String(fd.get("label") || "");
  const href = String(fd.get("href") || "");
  const isEnabled = fd.get("isEnabled") === "on";
  const sortOrder = Number(fd.get("sortOrder") || 0);

  await prisma.menuItem.update({
    where: { id },
    data: { label, href, isEnabled, sortOrder },
  });
}

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-bold">Хедер — меню</h1>
      <p className="mt-2 text-sm text-black/60">Можно править названия, ссылки, порядок и включение.</p>

      <div className="mt-6 grid gap-3">
        {items.map((m) => (
          <form key={m.id} action={saveMenu} className="rounded-2xl border border-black/10 p-4">
            <input type="hidden" name="id" value={m.id} />

            <div className="grid gap-3 md:grid-cols-4">
              <div className="grid gap-2 md:col-span-1">
                <label className="text-xs text-black/60">Порядок</label>
                <input
                  name="sortOrder"
                  defaultValue={m.sortOrder}
                  inputMode="numeric"
                  className="rounded-xl border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2 md:col-span-1">
                <label className="text-xs text-black/60">Название</label>
                <input
                  name="label"
                  defaultValue={m.label}
                  className="rounded-xl border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-xs text-black/60">Ссылка</label>
                <input
                  name="href"
                  defaultValue={m.href}
                  className="rounded-xl border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isEnabled" defaultChecked={m.isEnabled} />
                Показывать
              </label>

              <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90">
                Сохранить
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
