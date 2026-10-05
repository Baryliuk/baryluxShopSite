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
    <section className="rounded-2xl border border-[#262933] bg-[#12141C] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {user.image && !imageError ? (
            <Image
              src={user.image}
              alt={displayName}
              width={64}
              height={64}
              onError={() => setImageError(true)}
              unoptimized
              className="rounded-full border-2 border-orange-500/80 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-xl font-bold text-orange-500">
              {displayName[0]?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">
              [ BARYLUX MEMBER ]
            </span>
            <h1 className="text-2xl font-bold text-white mt-0.5">{displayName}</h1>
            <p className="text-sm text-zinc-400">{displayEmail}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
          )}
          {isPending ? "Виходимо..." : "Вийти з акаунту"}
        </button>
      </div>
    </section>
  );
}