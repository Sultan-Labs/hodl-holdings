import { motion } from "framer-motion";
import { ArrowRight, Waves } from "lucide-react";

export default function PoolsPage() {
  return (
    <div className="space-y-12" data-testid="page-pools">
      <section className="text-center relative py-24 px-6 glass-card rounded-[48px] overflow-hidden group border-white/5" data-testid="panel-pools-hero">
        <div
          className="absolute -inset-24 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1000px 600px at 0% 0%, rgba(85,255,172,0.12), transparent 70%), radial-gradient(1000px 600px at 100% 100%, rgba(0,214,255,0.08), transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center rounded-full glass-soft px-5 py-2 mb-8 border-white/10 gap-3" 
            data-testid="pill-pools"
          >
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]">Liquidity Engine</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--ring))] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">Coming Soon</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[32px] md:text-[56px] font-semibold text-white leading-[1.02] tracking-tight" 
            data-testid="text-pools-title"
          >
            Earn automatically. <span className="bg-gradient-to-r from-[#55FFAC] to-[#2C8CFF] bg-clip-text text-transparent">Compounding yield</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 text-white/50 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed" 
            data-testid="text-pools-subtitle"
          >
            We're building a high-performance liquidity engine for steady compounding. Earn rewards automatically with the Hodl Holdings unified interface.
          </motion.p>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="grid-pools-status">
            {[{
              title: "Steady Yield",
              desc: "Optimized for consistent returns across market cycles.",
              icon: Waves,
              id: "yield",
              accent: "rgba(85,255,172,0.15)"
            }, {
              title: "Auto-Compound",
              desc: "Harvest and reinvest automatically to maximize growth.",
              icon: ArrowRight,
              id: "compound",
              accent: "rgba(0,214,255,0.15)"
            }, {
              title: "Secure Vaults",
              desc: "Institutional-grade security for your digital assets.",
              icon: Waves,
              id: "security",
              accent: "rgba(85,255,172,0.15)"
            }].map((p, idx) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                className="glass-soft scan-hover rounded-[32px] p-10 text-left relative overflow-hidden group/card border-white/5 hover:border-white/20 transition-all duration-500" 
                data-testid={`card-pool-feature-${p.id}`}
              >
                <div
                  className="absolute -inset-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
                  aria-hidden="true"
                  style={{ background: `radial-gradient(400px at 50% 50%, ${p.accent}, transparent 80%)` }}
                />
                <div className="relative z-10">
                   <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover/card:border-[hsl(var(--ring))]/40 transition-all">
                    <p.icon className="h-6 w-6 text-[hsl(var(--ring))]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 leading-tight">{p.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light text-[15px]">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
