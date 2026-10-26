export type Category = { id: string; label: string };

type BaseDish = { id: string; name: string; categoryId: string };

export type VerifiedDish = BaseDish & {
  kind: 'verified';
  priceRub: number;
  imageUrl: string;
  imageSourceUrl: string;
  description?: string;
  portion?: string;
  sourceUrl: string;
  verifiedOn: string;
};

export type DemoDish = BaseDish & {
  kind: 'demo';
  visualTone: 'wine' | 'ember' | 'olive' | 'cream' | 'plum' | 'stone';
};

export type Dish = VerifiedDish | DemoDish;

// Presentation categories and positions. They do not claim to be the restaurant's menu.
export const categories: Category[] = [
  { id: 'starters', label: 'Закуски' },
  { id: 'mains', label: 'Горячее' },
  { id: 'desserts', label: 'Десерты' },
  { id: 'drinks', label: 'Напитки' },
];

const demoDishes: DemoDish[] = [
  { id: 'demo-01', name: 'Закуска № 1', categoryId: 'starters', kind: 'demo', visualTone: 'wine' },
  { id: 'demo-02', name: 'Закуска № 2', categoryId: 'starters', kind: 'demo', visualTone: 'olive' },
  { id: 'demo-03', name: 'Горячее № 1', categoryId: 'mains', kind: 'demo', visualTone: 'ember' },
  { id: 'demo-04', name: 'Горячее № 2', categoryId: 'mains', kind: 'demo', visualTone: 'stone' },
  { id: 'demo-05', name: 'Десерт № 1', categoryId: 'desserts', kind: 'demo', visualTone: 'cream' },
  { id: 'demo-06', name: 'Напиток № 1', categoryId: 'drinks', kind: 'demo', visualTone: 'plum' },
];

// Add verified dishes here; demo cards disappear as soon as real menu data is supplied.
// Each dish needs a current price, matching photograph, source URLs and verification date.
export const verifiedDishes: VerifiedDish[] = [];
export const dishes: Dish[] = verifiedDishes.length ? verifiedDishes : demoDishes;
export const isDemoMenu = verifiedDishes.length === 0;

export const menuUrl = 'https://yandex.com/maps/org/hmel_i_sol/72053749432/menu/';
