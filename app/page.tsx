// app/page.tsx
import HomeBlocks from "@/components/home/HomeBlocks";

// ГЛАВНОЕ: отключаем статическую оптимизацию главной,
// чтобы изменения из админки подхватывались сразу.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-14">
        <HomeBlocks />
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-black/50">
        © {new Date().getFullYear()} BlackTechLight
      </footer>
    </main>
  );
}
