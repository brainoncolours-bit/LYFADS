import Link from "next/link";
import { ArrowRight, Sparkles, Camera, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    title: "Share your vision",
    text: "Tell us about your project, your brand identity, and the story you want to bring to life.",
  },
  {
    title: "We shape the concept",
    text: "Our production crew builds a clear creative strategy, visual direction, and shooting schedule.",
  },
  {
    title: "Deliver with impact",
    text: "From high-end filming to final master grading, we deliver polished visual content that captivates.",
  },
];

const highlights = [
  "Cinematic production visuals",
  "Premium brand presentation",
  "Fast and secure delivery flow",
  "A polished, high-end experience",
];

export default function GetYoursPage() {
  return (
    <div className="bg-[#f5f5f3] text-neutral-900 min-h-screen selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-20">
        <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="rounded-[32px] border border-neutral-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-6 sm:p-10 lg:p-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-red-600">
                  <Sparkles size={12} />
                  Client Portal
                </div>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black uppercase italic tracking-[-0.06em] leading-none text-neutral-950">
                  Own the <span className="text-red-600">next</span> frame.
                </h1>

                <p className="mt-5 max-w-xl text-base sm:text-lg text-neutral-600 leading-relaxed">
                  A premium, seamless way to review your cinematic assets. We bring together high-end production,
                  creative vision, and professional grading to deliver stunning visual galleries.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-red-600"
                  >
                    Book a production
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/works"
                    className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-neutral-900 transition hover:border-neutral-900"
                  >
                    Explore portfolio
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-neutral-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[380px] lg:min-h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.4),_transparent_70%)] animate-pulse" />
                
                <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="absolute -inset-2 rounded-full bg-red-600/30 blur-md animate-ping" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500 bg-red-600/20 text-red-400 shadow-2xl backdrop-blur-md">
                      <Camera size={36} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/20 border border-red-500/40 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-red-400 mb-3">
                    <Flame size={12} />
                    Ready to view
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white leading-tight">
                    Your Photos Are Ready
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-xs">
                    Your cinematic session has been processed by our production team. Tap below to jump straight into your private gallery.
                  </p>

                  <div className="mt-8 w-full">
                    <a
                      href="https://fxsinan355.wfolio.pro/disk/2026-09-01-iq-onam-20226-hphk7j"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-3 w-full rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] hover:from-red-500 hover:to-red-400 active:scale-95"
                    >
                      <span>Click to view your photos</span>
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-red-600">How it works</p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black uppercase italic tracking-[-0.04em] text-neutral-950">
              Simple, premium, and clear.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                  0{index + 1}
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-neutral-950">
                  {step.title}
                </h3>
                <p className="mt-4 text-neutral-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
          <div className="rounded-[30px] bg-neutral-950 p-8 sm:p-12 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-red-400">Ready to move</p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase italic tracking-[-0.04em]">
              Bring your next creative vision to life.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-red-500"
              >
                Start your project
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/40"
              >
                View services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}