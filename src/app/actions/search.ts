"use server";

import { fetchingProducts } from "@/services/mydrop";

export interface SearchSuggestion {
  group_id: string;
  name: string;
  price: number;
  image: string;
}

export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const trimmedQuery = query.trim().toLowerCase();
  
  if (!trimmedQuery || trimmedQuery.length < 2) {
    return [];
  }

  const allProducts = await fetchingProducts();

  const matches = allProducts.filter((product) =>
    product.name.toLowerCase().includes(trimmedQuery)
  );

  // Повертаємо максимум 5 перших збігів для висувного списку
  return matches.slice(0, 5).map((p) => ({
    group_id: p.group_id,
    name: p.name,
    price: p.price,
    image: p.image,
  }));
}