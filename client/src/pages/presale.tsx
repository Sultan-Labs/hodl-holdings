import { motion } from "framer-motion";

export default function PresalePage() {
  return (
    <div className="space-y-8" data-testid="page-presale">
      <div className="relative overflow-hidden glass-card rounded-[48px] px-6 md:px-10 py-14 md:py-16 border border-white/5" data-testid="panel-presale-hero">
        <div
          className="absolute -inset-24 opacity-20"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1000px 600px at 0% 0%, rgba(85,255,172,0.12), transparent 70%), radial-gradient(1000px 600px at 100% 100%, rgba(0,214,255,0.10), transparent 70%)",
          }}
        />

        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 border-white/10"
            data-testid="pill-presale"
          >
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]" data-testid="text-presale-pill">
              Presale
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="mt-8 text-[34px] sm:text-5xl md:text-6xl font-semibold text-white leading-[1.04] tracking-tight"
            data-testid="text-presale-title"
          >
            Early access, built with clarity.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="mt-6 text-[15px] md:text-[18px] text-white/60 leading-relaxed font-light max-w-[48rem] mx-auto"
            data-testid="text-presale-subtitle"
          >
            This presale view is being built next — the layout and visual system are now aligned with the Hodl Holdings homepage.
          </motion.p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8" data-testid="panel-presale-coming-soon">
        <div className="text-white font-semibold" data-testid="text-presale-coming-title">Coming next</div>
        <div className="mt-2 text-white/60" data-testid="text-presale-coming-desc">
          Allocation cards, tiering, countdown, and purchase flow — all using the unified glass system.
        </div>
      </div>
    </div>
  );
}
