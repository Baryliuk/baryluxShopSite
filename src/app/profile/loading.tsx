import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 animate-pulse">
        {/* ProfileHeader Skeleton */}
        <div className="h-32 w-full rounded-2xl border border-[#1C1E24] bg-[#0E0E11]" />

        {/* Content Skeleton */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div className="h-80 rounded-2xl border border-[#1C1E24] bg-[#0E0E11]" />
          <div className="h-80 rounded-2xl border border-[#1C1E24] bg-[#0E0E11]" />
        </div>
      </main>

      <Footer />
    </div>
  );
}