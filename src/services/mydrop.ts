import "server-only";
import { XMLParser } from "fast-xml-parser";
import { cache } from "react";

export interface GroupedProduct {
  group_id: string;
  category_id: string;
  category_name: string;
  category_ids: string[];
  name: string;
  price: number;
  image: string;
  variants: Array<{
    id: string;
    size: string;
    stock: boolean;
  }>;
}

interface CategoryItem {
  name: string;
  parentId?: string;
}

// Нормалізація назви категорії (прибирає різницю в регістрі та зайві пробіли)
export function normalizeCategoryName(name: string): string {
  if (!name) return "Без категорії";
  const trimmed = name.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function extractSize(param: unknown): string {
  if (!param) return "Універсальний";

  if (Array.isArray(param)) {
    const sizeParam = param.find((p: any) => p?.name === "Размер");
    return sizeParam ? sizeParam["#text"] || "Універсальний" : "Універсальний";
  }

  if (typeof param === "object" && param !== null) {
    return (param as any)["#text"] || "Універсальний";
  }

  return String(param);
}

export const fetchingProducts = cache(async (): Promise<GroupedProduct[]> => {
  try {
    const token = process.env.MY_DROP_TOKEN;

    if (!token) {
      console.warn("MY_DROP_TOKEN не знайдено у змінних оточення.");
      return [];
    }

    const url = `https://backend.mydrop.com.ua/dropshipper/api/export/products?hash=${token}`;

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      console.error(`MyDrop API error: Status ${response.status}`);
      return [];
    }

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });
    const result = parser.parse(xmlData);

    const rawOffers = result?.yml_catalog?.shop?.offers?.offer;
    const rawCategories = result?.yml_catalog?.shop?.categories?.category;

    if (!rawOffers) return [];

    const offersArray = Array.isArray(rawOffers) ? rawOffers : [rawOffers];
    const categoriesArray = Array.isArray(rawCategories)
      ? rawCategories
      : rawCategories
      ? [rawCategories]
      : [];

    const catLookup: Record<string, CategoryItem> = {};
    for (const cat of categoriesArray) {
      if (cat?.id) {
        catLookup[String(cat.id)] = {
          name: cat["#text"] || "Без назви",
          parentId: cat.parentId ? String(cat.parentId) : undefined,
        };
      }
    }

    const grouped = offersArray.reduce<Record<string, any[]>>((acc, offer) => {
      const key = String(offer?.group_id || offer?.id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(offer);
      return acc;
    }, {});

    return Object.values(grouped).map((offersForGroup) => {
      const baseOffer = offersForGroup[0];
      const picData = baseOffer?.picture;
      const mainImage = Array.isArray(picData) ? picData[0] : picData || "";

      const leafId = String(baseOffer?.categoryId || "");
      const categoryIds: string[] = [];
      let currentId: string | undefined = leafId;
      let categoryName = "Без категорії";

      while (currentId) {
        const currentCategoryItem: CategoryItem | undefined = catLookup[currentId];
        if (!currentCategoryItem) break;

        categoryIds.unshift(currentId);
        if (currentId === leafId) {
          categoryName = currentCategoryItem.name;
        }
        currentId = currentCategoryItem.parentId;
      }

      return {
        group_id: String(baseOffer?.group_id || baseOffer?.id),
        category_id: leafId,
        category_name: normalizeCategoryName(categoryName), // Нормалізуємо одразу на виході
        category_ids: categoryIds,
        name: String(baseOffer?.name || "Без назви").trim(),
        price: Number(baseOffer?.price) || 0,
        image: mainImage,
        variants: offersForGroup.map((o) => ({
          id: String(o?.id),
          size: extractSize(o?.param),
          stock: o?.available === "true" || o?.available === true,
        })),
      };
    });
  } catch (error) {
    console.error("Помилка під час фетчингу товарів з MyDrop:", error);
    return [];
  }
});

export async function getProductById(
  groupId: string
): Promise<GroupedProduct | null> {
  const products = await fetchingProducts();
  if (!products.length) return null;

  return products.find((p) => p.group_id === String(groupId)) || null;
}