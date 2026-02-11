import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SavedToast from "@/components/SavedToast";

// --- Server Actions ---
async function toggleBlock(id: string) {
  "use server";

  const b = await prisma.homeBlock.findUnique({ where: { id } });
  if (!b) redirect("/admin");

  await prisma.homeBlock.update({
    where: { id },
    data: { isEnabled: !b.isEnabled },
  });

  // После POST-экшена делаем redirect, чтобы страница заново отрендерилась
  // и ты сразу увидел новое состояние.
  redirect(`/admin?saved=${Date.now()}`);
}

async function moveBlock(id: string, dir: "up" | "down") {
  "use server";

  const blocks = await prisma.homeBlock.findMany({ orderBy: { sortOrder: "asc" } });
  const idx = blocks.findIndex((x) => x.id === id);
  if (idx === -1) redirect("/admin");

  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= blocks.length) redirect("/admin");

  const a = blocks[idx];
  const b = blocks[swapWith];

  await prisma.$transaction([
    prisma.homeBlock.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.homeBlock.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);

  redirect(`/admin?saved=${Date.now()}`);
}

async function updateBlock(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const subtitleRaw = String(formData.get("subtitle") || "").trim();

  if (!id) redirect("/admin");

  await prisma.homeBlock.update({
    where: { id },
    data: {
      title,
      subtitle: subtitleRaw.length ? subtitleRaw : null,
    },
  });

  redirect(`/admin?saved=${Date.now()}`);
}

// В Next 16 searchParams приходит как Promise (как и params), поэтому await.
type Props = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function AdminHomeBlocksPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const savedKey = sp.saved ? String(sp.saved) : "";

  const blocks = await prisma.homeBlock.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <SavedToast showId={savedKey || undefined} />

      <h1 className="text-xl font-bold">Главная — блоки</h1>
      <p className="mt-2 text-sm text-black/60">
        Включай/выключай блоки и меняй порядок. Это управляет главной страницей.
      </p>

      <div className="mt-6 grid gap-3">
        {blocks.map((b) => (
          <div key={b.id} className="rounded-2xl border border-black/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{b.key}</div>
                <div className="text-xs text-black/60">sortOrder: {b.sortOrder}</div>
              </div>

              <div className="flex items-center gap-2">
                <form action={moveBlock.bind(null, b.id, "up")}>
                  <button
                    type="submit"
                    className="rounded-xl border border-black/15 px-3 py-2 text-sm hover:bg-black/5"
                    aria-label="Вверх"
                    title="Вверх"
                  >
                    ▲
                  </button>
                </form>

                <form action={moveBlock.bind(null, b.id, "down")}>
                  <button
                    type="submit"
                    className="rounded-xl border border-black/15 px-3 py-2 text-sm hover:bg-black/5"
                    aria-label="Вниз"
                    title="Вниз"
                  >
                    ▼
                  </button>
                </form>

                <form action={toggleBlock.bind(null, b.id)}>
                  <button
                    type="submit"
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                      b.isEnabled
                        ? "bg-black text-white"
                        : "border border-black/15 hover:bg-black/5"
                    }`}
                  >
                    {b.isEnabled ? "Включён" : "Выключен"}
                  </button>
                </form>
              </div>
            </div>

            <form action={updateBlock} className="mt-4 grid gap-2">
              <input type="hidden" name="id" value={b.id} />

              <label className="text-xs text-black/60">Заголовок</label>
              <input
                name="title"
                defaultValue={b.title}
                className="rounded-xl border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
                required
              />

              <label className="text-xs text-black/60">Подзаголовок</label>
              <input
                name="subtitle"
                defaultValue={b.subtitle ?? ""}
                className="rounded-xl border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
              />

              <button
                type="submit"
                className="mt-2 w-fit rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
              >
                Сохранить
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
