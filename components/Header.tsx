import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Header() {
  const menu = await prisma.menuItem.findMany({
    where: { isEnabled: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-white text-xs font-bold">
            BTL
          </div>
          <div>
            <div className="text-lg font-bold">BlackTechLight</div>
            <div className="text-xs text-black/50">Световое и звуковое оборудование</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {menu.map((m) => (
            <Link key={m.id} className="hover:text-black/70" href={m.href}>
              {m.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-black/15 hover:bg-black/5"
            aria-label="Поиск"
            title="Поиск"
          >
            🔍
          </Link>

          <Link
            href="/catalog"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            Смотреть товары
          </Link>
        </div>
      </div>
    </header>
  );
}
