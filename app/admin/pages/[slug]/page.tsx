import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import SavedToast from "@/components/SavedToast";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

async function saveAction(fd: FormData) {
  "use server";

  const slug = String(fd.get("slug") || "");
  if (!slug) redirect("/admin/pages");

  const title = String(fd.get("title") || "");
  const contentMd = String(fd.get("contentMd") || "");
  const isPublished = fd.get("isPublished") === "on";

  await prisma.sitePage.update({
    where: { slug },
    data: { title, contentMd, isPublished },
  });

  // обновить админку и публичную страницу
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
  revalidatePath(`/${slug}`);
  revalidatePath("/");

  redirect(`/admin/pages/${encodeURIComponent(slug)}?saved=${Date.now()}`);
}

export default async function AdminPageEdit({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const savedKey = sp.saved ? String(sp.saved) : "";

  const page = await prisma.sitePage.findUnique({ where: { slug } });

  if (!page) {
    return (
      <div>
        <div className="text-lg font-semibold">Страница не найдена</div>
        <p className="mt-2 text-sm text-black/60">
          Не найдена страница: <span className="font-mono">{slug}</span>
        </p>
        <a
          href="/admin/pages"
          className="mt-4 inline-flex rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Назад к страницам
        </a>
      </div>
    );
  }

  // key заставляет форму перемонтироваться после каждого сохранения
  const formKey = savedKey || String(page.updatedAt.getTime());

  return (
    <div>
      <SavedToast />

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Редактирование страницы</div>
          <div className="mt-1 text-sm text-black/60">
            <span className="font-mono text-xs">/{page.slug}</span>
          </div>
          <div className="mt-1 text-xs text-black/50">
            Последнее обновление: {new Date(page.updatedAt).toLocaleString("ru-RU")}
          </div>
        </div>

        <a
          href={`/${encodeURIComponent(page.slug)}`}
          className="rounded-xl border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
          target="_blank"
          rel="noreferrer"
        >
          Открыть на сайте
        </a>
      </div>

      <form key={formKey} action={saveAction} className="mt-6 grid gap-4">
        <input type="hidden" name="slug" value={page.slug} />

        <label className="grid gap-2">
          <div className="text-sm font-medium">Заголовок</div>
          <input
            name="title"
            defaultValue={page.title}
            className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
            required
          />
        </label>

        <label className="grid gap-2">
          <div className="text-sm font-medium">Контент (Markdown)</div>
          <textarea
            name="contentMd"
            defaultValue={page.contentMd}
            rows={16}
            className="rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isPublished" defaultChecked={page.isPublished} />
          Опубликовано (видно на сайте)
        </label>

        <div className="flex items-center gap-3">
          <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90">
            Сохранить
          </button>

          <a
            href="/admin/pages"
            className="rounded-xl border border-black/15 px-5 py-3 text-sm hover:bg-black/5"
          >
            Назад
          </a>
        </div>
      </form>
    </div>
  );
}
