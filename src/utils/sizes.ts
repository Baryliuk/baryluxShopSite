// src/utils/sizes.ts

export interface Variant {
  id: string;
  size: string | number;
  stock: boolean;
}

export interface Product {
  variants?: Variant[];
}

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export function extractUniqueSizes(products: Product[]): string[] {
  if (!products || !Array.isArray(products)) return [];

  const sizesSet = new Set<string>();

  for (const product of products) {
    if (!product.variants || !Array.isArray(product.variants)) continue;

    for (const variant of product.variants) {
      // 1. Перевіряємо наявність
      if (!variant.stock) continue;

      // 2. Безпечно зводимо size до рядка (захист від trim is not a function)
      const normalizedSize = String(variant.size ?? '').trim().toUpperCase();

      if (normalizedSize) {
        sizesSet.add(normalizedSize);
      }
    }
  }

  // 3. Сортуємо за еталонною сіткою стрітвіру
  return Array.from(sizesSet).sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a);
    const indexB = SIZE_ORDER.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}