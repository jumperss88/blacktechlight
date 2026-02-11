export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Запрос отправлен</h1>
        <p className="mt-3 text-sm text-black/60">
          Спасибо! Мы скоро свяжемся с вами.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="/catalog"
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            В каталог
          </a>
          <a
            href="/"
            className="rounded-xl border border-black/20 px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
          >
            На главную
          </a>
        </div>
      </section>
    </main>
  );
}
