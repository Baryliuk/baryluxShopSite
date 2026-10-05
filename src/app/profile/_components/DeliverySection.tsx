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
        setErrorMessage(result.error || "Щось пішло не так при збереженні адреси");
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
    <section className="rounded-2xl border border-[#262933] bg-[#12141C] p-6 h-fit">
      <h2 className="text-lg font-bold text-white mb-4">Доставка (Нова Пошта)</h2>

      {errorMessage && (
        <p className="mb-4 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
          {errorMessage}
        </p>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="city-input" className="text-xs text-zinc-400">Місто</label>
            <input
              id="city-input"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#262933] bg-white/5 p-2.5 text-sm text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="м. Київ"
            />
          </div>

          <div>
            <label htmlFor="warehouse-input" className="text-xs text-zinc-400">Відділення</label>
            <input
              id="warehouse-input"
              type="text"
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#262933] bg-white/5 p-2.5 text-sm text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="Відділення №15"
            />
          </div>

          <div>
            <label htmlFor="phone-input" className="text-xs text-zinc-400">Телефон</label>
            <input
              id="phone-input"
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#262933] bg-white/5 p-2.5 text-sm text-white focus:border-orange-500/50 focus:outline-none"
              placeholder="+380..."
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-orange-500 py-2 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50"
            >
              {isPending ? "Збереження..." : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-[#262933] bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:text-white transition"
            >
              Скасувати
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Місто</p>
              <p className="text-sm font-medium text-zinc-200">{formData.city || "Не вказано"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Відділення</p>
              <p className="text-sm font-medium text-zinc-200">{formData.warehouse || "Не вказано"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Телефон</p>
              <p className="text-sm font-medium text-zinc-200">{formData.phone || "Не вказано"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full rounded-xl border border-[#262933] bg-white/5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-orange-500/40 hover:text-white"
          >
            {formData.city ? "Редагувати дані" : "Додати адресу"}
          </button>
        </>
      )}
    </section>
  );
}