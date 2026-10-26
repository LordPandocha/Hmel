export type Category = { id: string; label: string };
export type Dish = {
  id: string;
  name: string;
  categoryId: string;
  priceRub: number;
  imageUrl: string;
  imageSourceUrl: string;
  description?: string;
  portion?: string;
  sourceUrl: string;
  verifiedOn: string;
};

// Add a dish only after checking its current name, price and matching photograph.
// Keep its original source URL and verification date with the record.
export const categories: Category[] = [];
export const dishes: Dish[] = [];

export const menuUrl = 'https://yandex.com/maps/org/hmel_i_sol/72053749432/menu/';
