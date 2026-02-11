import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function PageFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-black/50">
      © {new Date().getFullYear()} BlackTechLight
    </footer>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({
    where: { slug },
  });

  if (!p) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
          <h1 className="text-2xl font-bold text-black">Товар не найден</h1>
          <p className="mt-2 text-sm text-black/60">
            Вернись в каталог и выбери товар.
          </p>

          <a
            href="/catalog"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            В каталог
          </a>
        </section>

        <PageFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
        <div className="text-sm text-black/60">
          <a className="hover:text-black" href="/catalog">
            Каталог
          </a>{" "}
          / {p.title}
        </div>

        <h1 className="mt-3 text-3xl font-bold text-black">
          {p.brand} {p.title}
        </h1>
        <p className="mt-2 max-w-3xl text-black/70">{p.short}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:col-span-1">
            <div className="text-sm text-black/60">Цена</div>
            <div className="mt-2 text-2xl font-bold text-black">
              {p.price === null ? "По запросу" : formatRub(p.price)}
            </div>
            <div className="mt-2 text-sm text-black/60">{p.availability}</div>

            <a
              href="#kp"
              className="mt-5 inline-flex w-full justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
            >
              Запросить КП
            </a>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:col-span-2">
            <div className="text-sm font-semibold text-black">Описание</div>
            <p className="mt-2 text-sm text-black/70">{p.descriptionMd}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-xs text-black/60">
                  Пример характеристики
                </div>
                <div className="mt-1 text-sm font-semibold text-black">
                  DMX / RDM
                </div>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="text-xs text-black/60">
                  Пример характеристики
                </div>
                <div className="mt-1 text-sm font-semibold text-black">
                  Питание 100–240V
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="kp"
          className="mt-8 rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
        >
          <div className="text-lg font-semibold text-black">Запросить КП</div>
          <p className="mt-1 text-sm text-black/60">
            Тестовый режим: заявка сохранится локально в файл. Потом подключим
            Telegram/почту.
          </p>

          <form
            className="mt-4 grid gap-3 md:max-w-xl"
            action="/api/lead"
            method="post"
          >
            <input
              type="hidden"
              name="product"
              value={`${p.brand} ${p.title}`}
            />

            <input
              name="name"
              placeholder="Имя"
              required
              className="rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-black"
            />
            <input
              name="contact"
              placeholder="Телефон или Telegram"
              required
              className="rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-black"
            />
            <textarea
              name="message"
              placeholder="Комментарий (город, количество, сроки)"
              rows={4}
              className="rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-black"
            />

            <button
              type="submit"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
            >
              Отправить запрос
            </button>
          </form>
        </div>

        <div className="mt-8">
          <a className="text-sm text-black/70 hover:text-black" href="/catalog">
            ← Назад в каталог
          </a>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
