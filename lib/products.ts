export type CategorySlug =
  | "rotating-heads"
  | "led-fixtures"
  | "theatre"
  | "followspots"
  | "blinders-strobes"
  | "sfx"
  | "consoles"
  | "signal-distribution"
  | "cables-connectors"
  | "clamps";

export const categories: { slug: CategorySlug; title: string }[] = [
  { slug: "rotating-heads", title: "Вращающиеся головы" },
  { slug: "led-fixtures", title: "Светодиодные прожекторы" },
  { slug: "theatre", title: "Театральный свет" },
  { slug: "followspots", title: "Прожекторы следящего света" },
  { slug: "blinders-strobes", title: "Блайндеры и стробоскопы" },
  { slug: "sfx", title: "Генераторы спецэффектов" },
  { slug: "consoles", title: "Пульты управления" },
  { slug: "signal-distribution", title: "Распределение сигнала" },
  { slug: "cables-connectors", title: "Кабель и разъемы" },
  { slug: "clamps", title: "Струбцины" },
];

export type Product = {
  slug: string; // для /product/slug
  title: string;
  brand: string;
  category: CategorySlug;
  price: number | null; // null = “по запросу”
  availability: string; // “В наличии / Под заказ / По запросу”
  short: string;
  description: string;

  // ⬇️ Новое для поиска/промо
  featuredInSearch?: boolean; // если true — мелькает в промо-подсказках
  searchKeywords?: string[];  // доп. ключевые слова для поиска
};

export const products: Product[] = [
  {
    slug: "beam-260",
    title: "BEAM 260",
    brand: "BlackTechLight",
    category: "rotating-heads",
    price: 129900,
    availability: "Под заказ",
    short: "Компактная лучевая голова для небольших и средних площадок.",
    description:
      "Подходит для клубов, ДК и небольших сцен. Яркий луч, быстрые движения, хороший набор базовых эффектов.",
    featuredInSearch: true,
    searchKeywords: ["beam", "луч", "moving head", "260", "голова"],
  },
  {
    slug: "wash-7x40",
    title: "WASH 7x40",
    brand: "BlackTechLight",
    category: "led-fixtures",
    price: null,
    availability: "По запросу",
    short: "Мощный LED wash с широкой заливкой и ровным полем.",
    description:
      "Для заливки сцены и архитектурной подсветки. Ровная заливка, удобное управление, хорошо работает в комплектах.",
    featuredInSearch: true,
    searchKeywords: ["wash", "заливка", "led", "7x40", "прожектор"],
  },
  {
    slug: "profile-300",
    title: "PROFILE 300",
    brand: "BlackTechLight",
    category: "theatre",
    price: 219900,
    availability: "В наличии",
    short: "Профильный прожектор: резкость, гобо, шторки.",
    description:
      "Театр/ТВ/сцена: чёткая оптика и аккуратная геометрия луча. Удобно для постановочного света.",
    // этот можно не крутить — оставил без featured
    searchKeywords: ["profile", "профиль", "театр", "шторки", "gobo", "300"],
  },
];

export function formatRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export function getCategoryTitle(slug: string) {
  return categories.find((c) => c.slug === slug)?.title ?? "Категория";
}

// Удобный хелпер: получить товары категории
export function getProductsByCategory(category: CategorySlug) {
  return products.filter((p) => p.category === category);
}

// Удобный хелпер: промо-товары (для ротации в поиске)
export function getFeaturedProducts() {
  return products.filter((p) => p.featuredInSearch);
}
