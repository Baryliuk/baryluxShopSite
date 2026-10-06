import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-32 w-full rounded-2xl border border-[#262933] bg-[#12141C]" />

        {/* Content Skeleton */}
        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <div className="h-64 rounded-2xl border border-[#262933] bg-[#12141C]" />
          <div className="h-64 rounded-2xl border border-[#262933] bg-[#12141C]" />
        </div>
      </main>

      <Footer />
    </div>
  );
}