export interface Category {
  id: string;
  name: string;
}

export function extractUniqueCategories(products: any[]): Category[] {
  if (!products || !Array.isArray(products)) return [];

  const categoryMap = new Map<string, string>();

  for (const product of products) {
    if (product.category_id && product.category_name) {
      // Використовуємо String(), щоб уникнути багів з number/string типами ID
      categoryMap.set(String(product.category_id), String(product.category_name).trim());
    }
  }

  // Перетворюємо Map у масив і сортуємо за алфавітом
  return Array.from(categoryMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'uk'));
}