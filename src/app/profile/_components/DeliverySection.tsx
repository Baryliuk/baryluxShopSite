"use client";

import { useState, useEffect, useTransition } from "react";
import { updateDeliveryAddress } from "@/app/actions/user";

interface DeliveryDetails {
  city?: string;
  warehouse?: string;
  phone?: string;
}

export default function DeliverySection({ details }: { details?: DeliveryDetails | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    city: details?.city || "",
    warehouse: details?.warehouse || "",
    phone: details?.phone || "",
  });

  useEffect(() => {
    if (details) {
      setFormData({
        city: details.city || "",
        warehouse: details.warehouse || "",
        phone: details.phone || "",
      });
    }
  }, [details]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateDeliveryAddress(formData);

      if (result.success) {
        setIsEditing(false);
      } else {
        setErrorMessage(result.error || "Помилка при збереженні адреси");
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setFormData({
      city: details?.city || "",
      warehouse: details?.warehouse || "",
      phone: details?.phone || "",
    });
  };

  return (
    <section className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6 h-fit">
      <div className="flex items-center justify-between mb-4 border-b border-[#1C1E24] pb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Адреса доставки (Нова Пошта)
        </h2>
      </div>

      {errorMessage && (
        <p className="mb-4 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
          {errorMessage}
        </p>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="city-input" className="font-mono text-[10px] uppercase text-zinc-500">
              Місто
            </label>
            <input
              id="city-input"
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#1C1E24] bg-[#121318] p-3 text-xs text-white placeholder-zinc-600 focus:border-zinc-400 focus:outline-none transition"
              placeholder="м. Київ"
            />
          </div>

          <div>
            <label htmlFor="warehouse-input" className="font-mono text-[10px] uppercase text-zinc-500">
              Відділення / Поштомат
            </label>
            <input
              id="warehouse-input"
              type="text"
              required
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#1C1E24] bg-[#121318] p-3 text-xs text-white placeholder-zinc-600 focus:border-zinc-400 focus:outline-none transition"
              placeholder="Відділення №15 або Поштомат №8431"
            />
          </div>

          <div>
            <label htmlFor="phone-input" className="font-mono text-[10px] uppercase text-zinc-500">
              Номер телефону
            </label>
            <input
              id="phone-input"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#1C1E24] bg-[#121318] p-3 text-xs text-white placeholder-zinc-600 focus:border-zinc-400 focus:outline-none transition"
              placeholder="+380970000000"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200 disabled:opacity-50 active:scale-95"
            >
              {isPending ? "Збереження..." : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-[#1C1E24] bg-transparent px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
            >
              Скасувати
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="rounded-xl border border-[#1C1E24] bg-[#121318] p-4 space-y-3">
            <div>
              <p className="font-mono text-[10px] uppercase text-zinc-500">Місто</p>
              <p className="text-xs font-semibold text-zinc-200 mt-0.5">{formData.city || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-zinc-500">Відділення</p>
              <p className="text-xs font-semibold text-zinc-200 mt-0.5">{formData.warehouse || "—"}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-zinc-500">Телефон</p>
              <p className="text-xs font-semibold text-zinc-200 mt-0.5">{formData.phone || "—"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full rounded-xl border border-[#1C1E24] bg-zinc-900/50 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            {formData.city ? "Змінити реквізити" : "Додати адресу"}
          </button>
        </>
      )}
    </section>
  );
}