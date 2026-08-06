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
    const token = process.env.MY_DROP_TOKEN;
    const url = `https://backend.mydrop.com.ua/vendor/api/export/products/prom/yml?public_api_key=${token}&price_field=drop_price&increase_price_type=absolute&increase_price_value=299&param_name=Размер&stock_sync=true`;

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error('API err');
    const xmlData = await response.text();

    // 1. Налаштовуємо парсер. attributeNamePrefix: "" прибирає дебільні "@_" з id та group_id
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const result = parser.parse(xmlData);

    const rawOffers = result.yml_catalog.shop.offers.offer;
    const rawCategories = result.yml_catalog.shop.categories.category;

    if (!Array.isArray(rawOffers)) return [];
    const categoriesArray = Array.isArray(rawCategories) ? rawCategories : [rawCategories];

    // 2. СТВОРЮЄМО СЛОВНИК КАТЕГОРІЙ (Простий об'єкт для швидкого пошуку)
    const catLookup: Record<string, { name: string; parentId?: string }> = {};
    categoriesArray.forEach((cat: any) => {
        catLookup[String(cat.id)] = {
            name: cat['#text'] || 'Без назви',
            parentId: cat.parentId ? String(cat.parentId) : undefined
        };
    });

    // 3. ГРУПУЄМО ТОВАРИ ЗА group_id (Щоб схрестити розміри в одну картку)
    const grouped = Object.groupBy(rawOffers, (offer: any) => {
        return offer.group_id || offer.id;
    });

    // 4. ТРАНСФОРМУЄМО ДАНІ ДЛЯ ФРОНТЕНДУ
    return Object.values(grouped).map((offersForGroup: any) => {
        const baseOffer = offersForGroup[0];

        // Безпечно витягуємо фото (перевірка: рядок це чи масив)
        const picData = baseOffer.picture;
        const mainImage = Array.isArray(picData) ? picData[0] : picData || '';

        // ЗНАХОДИМО ЛАНЦЮЖОК КАТЕГОРІЙ ЧЕРЕЗ ЦИКЛ WHILE
        const leafId = String(baseOffer.categoryId || '');
        const categoryIds: string[] = [];
        let currentId: string | undefined = leafId;
        let categoryName = 'Без категорії';

        while (currentId && catLookup[currentId]) {
            categoryIds.unshift(currentId); // Додаємо ID в початок масиву
            if (currentId === leafId) {
                categoryName = catLookup[currentId].name; // Назва самої нижньої категорії
            }
            currentId = catLookup[currentId].parentId; // Піднімаємося до батька
        }

        function extractSize(param: any): string {
            if (!param) return 'Універсальний';

            // 1. Якщо прилетів масив параметрів (Розмір + Колір тощо)
            if (Array.isArray(param)) {
                const sizeParam = param.find((p: any) => p.name === 'Размер');
                return sizeParam ? (sizeParam['#text'] || 'Універсальний') : 'Універсальний';
            }

            // 2. Якщо прилетів один об'єкт
            if (typeof param === 'object') {
                return param['#text'] || 'Універсальний';
            }

            // 3. Якщо прилетів звичайний рядок
            return String(param);
        }

        return {
            group_id: String(baseOffer.group_id || baseOffer.id),
            category_id: leafId,
            category_name: categoryName,
            category_ids: categoryIds,
            name: baseOffer.name,
            price: Number(baseOffer.price),
            image: mainImage,
            // Очищаємо варіанти від сміття. Залишаємо ТІЛЬКИ те, що треба для кнопок розмірів
            variants: offersForGroup.map((o: any) => ({
                id: String(o.id),
                size: extractSize(o.param),
                stock: o.available === 'true' || o.available === true
            }))
        };
    });
}
export async function getProductById(groupId: string) {
    const products = await fetchingProducts();
    if (!products) return null;

    return products.find((p) => String(p.group_id) === String(groupId)) || null;
}