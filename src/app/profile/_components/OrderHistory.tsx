interface Order {
  id: string;
  item: string;
  status: string;
  date: string;
  amount: string;
}

interface OrderHistoryProps {
  orders?: Order[];
}

export default function OrderHistory({ orders = [] }: OrderHistoryProps) {
  return (
    <section className="rounded-2xl border border-[#262933] bg-[#12141C] p-6">
      <h2 className="text-lg font-bold text-white mb-4">Історія замовлень</h2>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-orange-500/30"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-500">{order.id}</span>
                  <span className="text-xs text-zinc-500">• {order.date}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-200">{order.item}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
                  {order.status}
                </span>
                <span className="text-sm font-bold text-white">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-sm text-zinc-500">У вас поки немає активних замовлень.</p>
        </div>
      )}
    </section>
  );
}