"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { logout } from "@/app/actions/auth";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isPending, startTransition] = useTransition();
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const displayName = user.name || "Клієнт BARYLUX";
  const displayEmail = user.email || "";

  return (
    <section className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6 sm:p-8 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {user.image && !imageError ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-zinc-700">
              <Image
                src={user.image}
                alt={displayName}
                fill
                onError={() => setImageError(true)}
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 font-mono text-xl font-bold text-white">
              {displayName[0]?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                BARYLUX MEMBER
              </span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
              {displayName}
            </h1>
            <p className="text-xs text-zinc-500 font-mono">{displayEmail}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
        >
          {isPending && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />
          )}
          {isPending ? "Виходимо..." : "Вийти"}
        </button>
      </div>
    </section>
  );
}