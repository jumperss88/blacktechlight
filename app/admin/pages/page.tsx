import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import SavedToast from "@/components/SavedToast";

type Props = {
  searchParams?: Promise<{ saved?: string }>;
};

async function togglePublishedAction(fd: FormData) {
  "use server";
  const slug = String(fd.get("slug") || "");
  if (!slug) redirect("/admin/pages");

  const p = await prisma.sitePage.findUnique({ where: { slug } });
  if (!p) redirect("/admin/pages");

  await prisma.sitePage.update({
    where: { slug },
    data: { isPublished: !p.isPublished },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
  revalidatePath("/");

  redirect(`/admin/pages?saved=${Date.now()}`);
}

export default async function AdminPagesList({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const savedKey = sp.saved ? String(sp.saved) : "";

  const pages = await prisma.sitePage.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // чтобы список гарантированно обновлялся после сохранений/переключений
  const pageKey =
    savedKey || String(Math.max(...pages.map((p) => p.updatedAt.getTime())) || Date.now());

  return (
    <div key={pageKey}>
      <SavedToast />

      <h1 className="text-xl font-bold">Страницы</h1>
      <p className="mt-2 text-sm text-black/60">
        Здесь редактируются страницы из хедера: О нас, Сервисный центр, Госзакупки, Контакты и т.д.
      </p>

      <div className="mt-6 grid gap-3">
        {pages.map((p) => (
          <div key={p.id} className="rounded-2xl border border-black/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="mt-1 text-xs text-black/60">
                  slug: <span className="font-mono">{p.slug}</span>
                </div>
                <div className="mt-1 text-xs text-black/50">
                  updated: {new Date(p.updatedAt).toLocaleString("ru-RU")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/admin/pages/${encodeURIComponent(p.slug)}`}
                  className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
                >
                  Редактировать
                </a>

                <a
                  href={`/${encodeURIComponent(p.slug)}`}
                  className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть на сайте
                </a>

                <form action={togglePublishedAction}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <button
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      p.isPublished
                        ? "bg-black text-white"
                        : "border border-black/15 hover:bg-black/5"
                    }`}
                  >
                    {p.isPublished ? "Опубликовано" : "Скрыто"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {pages.length === 0 && (
          <div className="rounded-2xl border border-black/10 p-4 text-sm text-black/60">
            Пока нет страниц в базе.
          </div>
        )}
      </div>
    </div>
  );
}
