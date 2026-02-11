import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Категории каталога
  const categoryData = [
    { slug: "rotating-heads", title: "Вращающиеся головы", sortOrder: 10 },
    { slug: "led-fixtures", title: "Светодиодные прожекторы", sortOrder: 20 },
    { slug: "theatre", title: "Театральный свет", sortOrder: 30 },
    { slug: "followspots", title: "Прожекторы следящего света", sortOrder: 40 },
    { slug: "blinders-strobes", title: "Блайндеры и стробоскопы", sortOrder: 50 },
    { slug: "sfx", title: "Генераторы спецэффектов", sortOrder: 60 },
    { slug: "consoles", title: "Пульты управления", sortOrder: 70 },
    { slug: "signal-distribution", title: "Распределение сигнала", sortOrder: 80 },
    { slug: "cables-connectors", title: "Кабель и разъемы", sortOrder: 90 },
    { slug: "clamps", title: "Струбцины", sortOrder: 100 },
  ];

  for (const c of categoryData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { title: c.title, sortOrder: c.sortOrder },
      create: c,
    });
  }

  // 2) Меню хедера (как ты хочешь)
  const menu = [
    { label: "Каталог", href: "/catalog", sortOrder: 10, isEnabled: true },
    { label: "О нас", href: "/about", sortOrder: 20, isEnabled: true },
    { label: "Сервисный центр", href: "/service", sortOrder: 30, isEnabled: true },
    { label: "Портфолио", href: "/portfolio", sortOrder: 40, isEnabled: true },
    {
      label: "Госзакупки 44-ФЗ и 223-ФЗ",
      href: "/procurement",
      sortOrder: 50,
      isEnabled: true,
    },
    { label: "Контакты", href: "/contacts", sortOrder: 60, isEnabled: true },
  ];

  // для предсказуемости: очистим и создадим заново
  await prisma.menuItem.deleteMany({});
  await prisma.menuItem.createMany({ data: menu });

  // 3) Страницы (Markdown)
  const pages = [
    {
      slug: "about",
      title: "О нас",
      contentMd:
        "## BlackTechLight\n\nПрофессиональное световое и звуковое оборудование.\n\n- Подбор под ТЗ\n- Документы и гарантия\n- Быстрый КП\n",
      isPublished: true,
    },
    {
      slug: "service",
      title: "Сервисный центр",
      contentMd:
        "## Сервисный центр\n\nДиагностика, ремонт, обслуживание, консультации.\n\nОпиши тут условия, сроки и гарантию.\n",
      isPublished: true,
    },
    {
      slug: "procurement",
      title: "Госзакупки 44-ФЗ и 223-ФЗ",
      contentMd:
        "## Госзакупки 44-ФЗ и 223-ФЗ\n\nРаботаем с учреждениями: подбор, КП, эквиваленты и документы.\n\n- Помощь с ТЗ\n- Подбор аналогов\n- Закрывающие документы\n",
      isPublished: true,
    },
    {
      slug: "contacts",
      title: "Контакты",
      contentMd:
        "## Контакты\n\nТелефон: ...\n\nTelegram: ...\n\nEmail: ...\n\nГород: ...\n",
      isPublished: true,
    },
  ];

  for (const p of pages) {
    await prisma.sitePage.upsert({
      where: { slug: p.slug },
      update: { title: p.title, contentMd: p.contentMd, isPublished: p.isPublished },
      create: p,
    });
  }

  // 4) Блоки главной: вкл/выкл + порядок + заголовки
  const blocks = [
    {
      key: "hero",
      title: "BlackTechLight",
      subtitle: "Световое и звуковое оборудование. Подбор, поставка, сопровождение.",
      sortOrder: 10,
      isEnabled: true,
    },
    {
      key: "catalog",
      title: "Каталог",
      subtitle: "Вращающиеся головы, прожекторы, пульты и коммутация.",
      sortOrder: 20,
      isEnabled: true,
    },
    {
      key: "procurement",
      title: "Госзакупки 44-ФЗ и 223-ФЗ",
      subtitle: "Подбор под ТЗ, КП, эквиваленты и документы.",
      sortOrder: 30,
      isEnabled: true,
    },
    {
      key: "about",
      title: "О нас",
      subtitle: "Поставка, консультации, документация и сопровождение.",
      sortOrder: 40,
      isEnabled: true,
    },
    {
      key: "service",
      title: "Сервисный центр",
      subtitle: "Диагностика, ремонт и обслуживание.",
      sortOrder: 50,
      isEnabled: true,
    },
    {
      key: "portfolio",
      title: "Портфолио",
      subtitle: "Примеры поставок и реализованных проектов.",
      sortOrder: 60,
      isEnabled: true,
    },
  ];

  for (const b of blocks) {
    await prisma.homeBlock.upsert({
      where: { key: b.key },
      update: {
        title: b.title,
        subtitle: b.subtitle,
        sortOrder: b.sortOrder,
        isEnabled: b.isEnabled,
      },
      create: b,
    });
  }

  // 5) Демонстрационные товары (как у тебя было)
  const catRot = await prisma.category.findUnique({ where: { slug: "rotating-heads" } });
  const catLed = await prisma.category.findUnique({ where: { slug: "led-fixtures" } });
  const catTheatre = await prisma.category.findUnique({ where: { slug: "theatre" } });

  if (!catRot || !catLed || !catTheatre) throw new Error("Не найдены категории для демо-товаров");

  const demoProducts = [
    {
      slug: "beam-260",
      title: "BEAM 260",
      brand: "BlackTechLight",
      categoryId: catRot.id,
      price: 129900,
      availability: "Под заказ",
      short: "Компактная лучевая голова для небольших и средних площадок.",
      descriptionMd:
        "Подходит для клубов, ДК и небольших сцен. Яркий луч, быстрые движения, хороший набор базовых эффектов.",
      featuredInSearch: true,
      searchKeywords: "beam,луч,голова,260,moving head",
    },
    {
      slug: "wash-7x40",
      title: "WASH 7x40",
      brand: "BlackTechLight",
      categoryId: catLed.id,
      price: null,
      availability: "По запросу",
      short: "Мощный LED wash с широкой заливкой и ровным полем.",
      descriptionMd:
        "Для заливки сцены и архитектурной подсветки. Ровная заливка, удобное управление, хорошо работает в комплектах.",
      featuredInSearch: true,
      searchKeywords: "wash,заливка,led,7x40",
    },
    {
      slug: "profile-300",
      title: "PROFILE 300",
      brand: "BlackTechLight",
      categoryId: catTheatre.id,
      price: 219900,
      availability: "В наличии",
      short: "Профильный прожектор: резкость, гобо, шторки.",
      descriptionMd:
        "Театр/ТВ/сцена: чёткая оптика и аккуратная геометрия луча. Удобно для постановочного света.",
      featuredInSearch: false,
      searchKeywords: "profile,профиль,театр,gobo,300",
    },
  ];

  for (const p of demoProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
