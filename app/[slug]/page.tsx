// app/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;

  // ВАЖНО: чтобы не перехватывать системные разделы
  // (на всякий случай; обычно статические роуты и так приоритетнее)
  const reserved = new Set([
    "admin",
    "api",
    "catalog",
    "contacts",
    "debug",
    "product",
    "search",
    "thanks",
  ]);
  if (reserved.has(slug)) notFound();

  const page = await prisma.sitePage.findUnique({
    where: { slug },
  });

  if (!page || !page.isPublished) notFound();

  return (
    <main className="bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">{page.title}</h1>

        <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          {page.contentMd}
        </div>
      </div>
    </main>
  );
}
