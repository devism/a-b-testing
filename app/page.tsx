import FeaturesSection from "@/components/FeaturesSection";
import HeroWrapper from "@/components/HeroWrapper";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-zinc-900 tracking-tight">flowmetric</span>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <Link
              href="/dashboard"
              className="rounded-full bg-zinc-900 text-white px-4 py-1.5 text-xs font-medium hover:bg-zinc-700 transition-colors"
            >
              View A/B Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* A/B tested hero — Client Component picks the variant */}
      <HeroWrapper />

      {/* Features — pure Server Component, zero JS to browser */}
      <FeaturesSection />

      {/* Footer CTA */}
      <section className="bg-indigo-600 py-20 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to know your numbers?</h2>
        <p className="text-indigo-200 mb-8">Join 2,400+ teams shipping with confidence.</p>
        <a
          href="#"
          className="inline-block rounded-full bg-white text-indigo-600 px-8 py-3.5 text-sm font-semibold hover:bg-indigo-50 transition-colors"
        >
          Start free — no credit card
        </a>
      </section>

      <footer className="bg-zinc-900 text-zinc-500 py-10 text-center text-xs">
        © {new Date().getFullYear()} Flowmetric, Inc. · Built with Next.js, PostHog, and Postgres
      </footer>
    </main>
  );
}
