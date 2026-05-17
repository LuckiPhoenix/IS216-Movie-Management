export type FoodCategory = "All Items" | "Combos" | "Couple Sets" | "Popcorn" | "Drinks" | "Candy";

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image_url: string;
  is_popular?: boolean;
}