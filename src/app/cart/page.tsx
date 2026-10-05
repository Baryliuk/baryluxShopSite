import Header from '@/components/Header';
import Footer from '@/components/Footer';

const cartItems = [
    {
        id: 1,
        name: 'BARYLUX x HYPERX Hoodie',
        color: 'Чорний',
        size: 'M',
        quantity: 1,
        price: 2890,
        oldPrice: 3490,
        accent: 'from-orange-500 via-amber-400 to-yellow-200',
    },
    {
        id: 2,
        name: 'BARYLUX Street Runner',
        color: 'Сірий',
        size: '42',
        quantity: 1,
        price: 4290,
        oldPrice: 4990,
        accent: 'from-violet-500 via-fuchsia-400 to-pink-200',
    },
    {
        id: 3,
        name: 'BARYLUX Essentials Cap',
        color: 'Бежевий',
        size: 'One Size',
        quantity: 2,
        price: 990,
        oldPrice: 1290,
        accent: 'from-emerald-500 via-teal-400 to-cyan-200',
    },
];

const formatPrice = (value: number) =>
    new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(value);

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shipping = subtotal > 6000 ? 0 : 199;
const total = subtotal + shipping;

export default function CartPage() {
    return (
        <div className="relative flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
            <Header />
            <main className="flex min-h-[calc(100vh-69px)] w-full items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-orange-400">Кошик</p>
                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Ваші товари
                            </h1>
                        </div>
                        <button className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-orange-400/70 hover:text-white">
                            Продовжити покупки
                        </button>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
                        <section className="space-y-4">
                            {cartItems.map((item) => (
                                <article
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:border-orange-400/40 hover:bg-white/[0.04]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                                    <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                                        <div className={`relative h-32 w-full overflow-hidden rounded-[22px] bg-gradient-to-br ${item.accent} p-3 shadow-inner sm:w-36`}>
                                            <div className="absolute inset-y-5 left-5 w-8 rounded-full bg-black/30 blur-md" />
                                            <div className="absolute -bottom-3 left-1/2 h-20 w-24 -translate-x-1/2 rounded-[34%] bg-zinc-900/80 shadow-[0_12px_30px_rgba(0,0,0,0.45)]" />
                                            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-[18px] border border-white/20 bg-white/10 backdrop-blur-md" />
                                            <div className="absolute inset-x-4 bottom-3 h-3 rounded-full bg-black/30 blur-sm" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">{item.name}</h2>
                                                    <p className="mt-1 text-sm text-zinc-400">
                                                        Колір: {item.color} · Розмір: {item.size}
                                                    </p>
                                                </div>
                                                <button className="self-start text-sm font-medium text-red-300 transition hover:text-red-200">
                                                    Видалити
                                                </button>
                                            </div>

                                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1">
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-zinc-300 transition hover:bg-white/5 hover:text-white">
                                                        −
                                                    </button>
                                                    <span className="min-w-8 text-center text-sm font-semibold text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-zinc-300 transition hover:bg-white/5 hover:text-white">
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <div className="flex items-center gap-2 sm:justify-end">
                                                        <span className="text-lg font-black text-white">
                                                            {formatPrice(item.price * item.quantity)} грн
                                                        </span>
                                                        <span className="text-sm text-zinc-500 line-through">
                                                            {formatPrice(item.oldPrice * item.quantity)} грн
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-orange-300">
                                                        Економія {formatPrice(item.oldPrice * item.quantity - item.price * item.quantity)} грн
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>

                        <aside className="rounded-[28px] border border-orange-400/20 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-xl font-bold text-white">Підсумок</h3>
                                <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-2 py-1 text-xs font-medium uppercase tracking-[0.15em] text-orange-300">
                                    {cartItems.length} товарів
                                </span>
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-400">
                                    Промокод
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="BARYLUX10"
                                        className="w-full rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400/60 focus:outline-none"
                                    />
                                    <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400">
                                        OK
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3 text-sm text-zinc-300">
                                <div className="flex items-center justify-between">
                                    <span>Підсумок</span>
                                    <span>{formatPrice(subtotal)} грн</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Доставка</span>
                                    <span className={shipping === 0 ? 'text-emerald-300' : ''}>
                                        {shipping === 0 ? 'Безкоштовно' : `${formatPrice(shipping)} грн`}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                                    <span>Разом</span>
                                    <span>{formatPrice(total)} грн</span>
                                </div>
                            </div>

                            <button className="mt-6 w-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-5 py-3 text-base font-black text-black shadow-[0_20px_40px_rgba(251,146,60,0.4)] transition hover:brightness-110">
                                Оформити замовлення
                            </button>

                            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-200">
                                Безпечна оплата · Швидка доставка · 30 днів на повернення
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}