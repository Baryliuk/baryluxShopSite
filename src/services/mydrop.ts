import 'server-only';
import { XMLParser } from 'fast-xml-parser';

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

export async function fetchingProducts(): Promise<GroupedProduct[]> {
    try {
        const token = process.env.MY_DROP_TOKEN;
        
        if (!token) {
            console.warn("MY_DROP_TOKEN не знайдено у змінних оточення.");
            return [];
        }

        const url = `https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=${token}&price_field=drop_price&increase_price_type=absolute&increase_price_value=299&param_name=Размер&stock_sync=true&only_available=true`;
        
        const response = await fetch(url, { next: { revalidate: 300 } });
        
        if (!response.ok) {
            console.error(`MyDrop API error: Status ${response.status}`);
            return [];
        }

        const xmlData = await response.text();

        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const result = parser.parse(xmlData);

        // БЕЗПЕЧНЕ ЗЧИТУВАННЯ (запобігає Cannot read properties of undefined)
        const rawOffers = result?.yml_catalog?.shop?.offers?.offer;
        const rawCategories = result?.yml_catalog?.shop?.categories?.category;

        if (!rawOffers) return [];

        const offersArray = Array.isArray(rawOffers) ? rawOffers : [rawOffers];
        const categoriesArray = Array.isArray(rawCategories) ? rawCategories : rawCategories ? [rawCategories] : [];

        // 2. СЛОВНИК КАТЕГОРІЙ
        const catLookup: Record<string, { name: string; parentId?: string }> = {};
        categoriesArray.forEach((cat: any) => {
            if (cat && cat.id) {
                catLookup[String(cat.id)] = {
                    name: cat['#text'] || 'Без назви',
                    parentId: cat.parentId ? String(cat.parentId) : undefined
                };
            }
        });

        // 3. ГРУПУВАННЯ ТОВАРІВ
        const grouped = Object.groupBy(offersArray, (offer: any) => {
            return offer?.group_id || offer?.id;
        });

        if (!grouped) return [];

        // 4. ТРАНСФОРМАЦІЯ ДАНИХ
        return Object.values(grouped).filter(Boolean).map((offersForGroup: any) => {
            const baseOffer = offersForGroup[0];

            const picData = baseOffer?.picture;
            const mainImage = Array.isArray(picData) ? picData[0] : picData || '';

            const leafId = String(baseOffer?.categoryId || '');
            const categoryIds: string[] = [];
            let currentId: string | undefined = leafId;
            let categoryName = 'Без категорії';

            while (currentId && catLookup[currentId]) {
                categoryIds.unshift(currentId);
                if (currentId === leafId) {
                    categoryName = catLookup[currentId].name;
                }
                currentId = catLookup[currentId].parentId;
            }

            function extractSize(param: any): string {
                if (!param) return 'Універсальний';

                if (Array.isArray(param)) {
                    const sizeParam = param.find((p: any) => p?.name === 'Размер');
                    return sizeParam ? (sizeParam['#text'] || 'Універсальний') : 'Універсальний';
                }

                if (typeof param === 'object') {
                    return param['#text'] || 'Універсальний';
                }

                return String(param);
            }

            return {
                group_id: String(baseOffer?.group_id || baseOffer?.id),
                category_id: leafId,
                category_name: categoryName,
                category_ids: categoryIds,
                name: baseOffer?.name || 'Без назви',
                price: Number(baseOffer?.price) || 0,
                image: mainImage,
                variants: offersForGroup.map((o: any) => ({
                    id: String(o?.id),
                    size: extractSize(o?.param),
                    stock: o?.available === 'true' || o?.available === true
                }))
            };
        });

    } catch (error) {
        console.error("Помилка під час фетчингу товарів з MyDrop:", error);
        return []; // Гарантує, що сторінка скомпілюється навіть при збої API
    }
}

export async function getProductById(groupId: string) {
    const products = await fetchingProducts();
    if (!products || products.length === 0) return null;

    return products.find((p) => String(p.group_id) === String(groupId)) || null;
}