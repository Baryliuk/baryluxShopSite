interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  amount: string;
  items?: OrderItem[];
}

interface OrderHistoryProps {
  orders?: Order[];
}

export default function OrderHistory({ orders = [] }: OrderHistoryProps) {
  return (
    <section className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6">
      <div className="flex items-center justify-between mb-4 border-b border-[#1C1E24] pb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Історія замовлень ({orders.length})
        </h2>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-[#1C1E24] bg-[#121318] p-4 transition hover:border-zinc-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/50 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">#{order.id}</span>
                    <span className="text-[11px] font-mono text-zinc-500">{order.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-white">{order.amount}</span>
                </div>
              </div>

              {/* Рендер списку товарів у замовленні */}
              {order.items && order.items.length > 0 && (
                <div className="mt-3 pt-1 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-zinc-400">
                      <span>
                        {item.name} {item.size && `(${item.size})`} × {item.quantity}
                      </span>
                      <span className="font-mono">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#1C1E24] py-12 px-4 text-center">
          <p className="font-mono text-xs uppercase text-zinc-500">Замовлень поки немає</p>
          <p className="mt-1 text-xs text-zinc-600">Ваші майбутні покупки будуть відображатися тут</p>
        </div>
      )}
    </section>
  );
}