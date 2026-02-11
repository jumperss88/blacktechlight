import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SavedToast from "@/components/SavedToast";

type Props = {
  searchParams?: Promise<{ saved?: string }>;
};

async function toggleBlock(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin");

  const b = await prisma.homeBlock.findUnique({ where: { id } });
  if (!b) redirect("/admin");

  await prisma.homeBlock.update({
    where: { id },
    data: { isEnabled: !b.isEnabled },
  });

  // Чтобы главная и админка обновились
  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin?saved=1");
}

async function moveBlock(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const dir = String(formData.get("dir") || "");

  if (!id || (dir !== "up" && dir !== "down")) redirect("/admin");

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

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin?saved=1");
}

async function updateBlock(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();

  if (!id || !title) redirect("/admin");

  await prisma.homeBlock.update({
    where: { id },
    data: { title, subtitle: subtitle.length ? subtitle : null },
  });

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin?saved=1");
}

export default async function AdminHomeBlocksPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const blocks = await prisma.homeBlock.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <SavedToast show={sp.saved === "1"} />

      <h1 className="text-xl font-bold">Главная — блоки</h1>
      <p className="mt-2 text-sm text-black/60">
        Включай/выключай блоки и меняй порядок. Изменения применяются сразу после сохранения.
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
                <form action={moveBlock}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button className="rounded-xl border border-black/15 px-3 py-2 text-sm hover:bg-black/5">
                    ▲
                  </button>
                </form>

                <form action={moveBlock}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button className="rounded-xl border border-black/15 px-3 py-2 text-sm hover:bg-black/5">
                    ▼
                  </button>
                </form>

                <form action={toggleBlock}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                      b.isEnabled ? "bg-black text-white" : "border border-black/15 hover:bg-black/5"
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
              />

              <label className="text-xs text-black/60">Подзаголовок</label>
              <input
                name="subtitle"
                defaultValue={b.subtitle ?? ""}
                className="rounded-xl border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
              />

              <button className="mt-2 w-fit rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90">
                Сохранить
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
