export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-white text-black">

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h1 className="text-2xl font-bold">Контакты</h1>
        <p className="mt-2 max-w-2xl text-sm text-black/60">
          Здесь позже добавим форму заявки и автосбор лидов в Telegram/почту/CRM.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold">Связь</div>
            <div className="mt-3 space-y-2 text-sm text-black/70">
              <div>
                <span className="text-black/50">Телефон:</span> +7 XXX XXX-XX-XX
              </div>
              <div>
                <span className="text-black/50">Telegram:</span> @blacktechlight
              </div>
              <div>
                <span className="text-black/50">Email:</span> info@blacktechlight.ru
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold">Режим работы</div>
            <div className="mt-3 space-y-2 text-sm text-black/70">
              <div>
                <span className="text-black/50">Пн–Пт:</span> 10:00–19:00
              </div>
              <div>
                <span className="text-black/50">Сб:</span> по договорённости
              </div>
              <div>
                <span className="text-black/50">Вс:</span> выходной
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/catalog"
            className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            Перейти в каталог
          </a>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-black/50">
        © {new Date().getFullYear()} BlackTechLight
      </footer>
    </main>
  );
}
