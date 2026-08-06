// src/utils/sizes.ts

const ALLOWED_LETTER_SIZES = new Set([
  'XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'XXL', 'XXXL'
]);

// Регулярка для числових розмірів (наприклад: 28, 30, 42, 42-43, 43.5)
const NUMERIC_SIZE_REGEX = /^\d{2,3}(\s*[-/]\s*\d{2,3})?$/;

export function extractUniqueSizes(products: any[]): string[] {
  if (!products || !Array.isArray(products)) return [];

  const validSizes = new Set<string>();

  for (const product of products) {
    if (!product.variants || !Array.isArray(product.variants)) continue;

    for (const variant of product.variants) {
      if (!variant.stock) continue;

      let rawSize = String(variant.size ?? '').trim().toUpperCase();

      // 1. Відрізаємо примітки в дужках: "2XL (ПО ФАКТУ L)" -> "2XL"
      if (rawSize.includes('(')) {
        rawSize = rawSize.split('(')[0].trim();
      }

      // 2. СУВОРИЙ ФІЛЬТР: пропускаємо лише стандартні літери або цифрові розміри
      const isLetterSize = ALLOWED_LETTER_SIZES.has(rawSize);
      const isNumericSize = NUMERIC_SIZE_REGEX.test(rawSize);

      if (isLetterSize || isNumericSize) {
        validSizes.add(rawSize);
      }
    }
  }

  // Сортування: Спочатку буквені, потім цифрові
  return Array.from(validSizes).sort((a, b) => {
    const isANum = !isNaN(Number(a));
    const isBNum = !isNaN(Number(b));

    if (isANum && isBNum) return Number(a) - Number(b);
    return a.localeCompare(b);
  });
}