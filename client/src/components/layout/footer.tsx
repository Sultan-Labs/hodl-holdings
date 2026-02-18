import { Send, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Custom X Icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 pb-20 px-6" data-testid="footer-main">
      <div className="max-w-6xl mx-auto">
        {/* Roadmap */}
        <section className="text-center relative py-24 px-6 glass-card rounded-[48px] overflow-hidden group border-white/5" data-testid="section-roadmap-footer">
          <div
            className="absolute -inset-24 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(1000px 600px at 0% 0%, rgba(85,255,172,0.12), transparent 70%), radial-gradient(1000px 600px at 100% 100%, rgba(0,214,255,0.08), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center rounded-full glass-soft px-5 py-2 mb-8 border-white/10" data-testid="pill-roadmap">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]" data-testid="text-roadmap-kicker">Future Vision</span>
            </div>
            <h2 className="text-[32px] md:text-[56px] font-semibold text-white leading-[1.02] tracking-tight" data-testid="text-roadmap-title">
              Our path to <span className="text-gradient-primary">DeFi dominance</span>
            </h2>
            <p className="mt-6 text-white/50 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed" data-testid="text-roadmap-subtitle">
              A high-velocity roadmap engineered to scale from a native launch to a complete institutional financial suite within 12 months.
            </p>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative" data-testid="grid-roadmap-footer">
              
              {[{
                num: "01",
                phase: "Expansion",
                title: "Phase 1: Q1 2026",
                desc: "Strategic launch of the Native DEX and Token Factory to establish initial liquidity and ecosystem utility.",
                id: "1",
                accent: "rgba(85,255,172,0.15)"
              }, {
                num: "02",
                phase: "Ecosystem",
                title: "Phase 2: Q4 2026",
                desc: "Integration of the HODL Shop and a comprehensive suite of primary DeFi products within a unified interface.",
                id: "2",
                accent: "rgba(0,214,255,0.15)"
              }, {
                num: "03",
                phase: "Institutional",
                title: "Phase 3: Q1 2027",
                desc: "Full-scale expansion into institutional-grade insurance, flash loans, synthetics, and portfolio management.",
                id: "3",
                accent: "rgba(85,255,172,0.15)"
              }].map((p, idx) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-soft rounded-[32px] p-10 text-left relative overflow-hidden group/card border-white/5 hover:border-white/20 transition-all duration-500" 
                  style={{
                    boxShadow: "0 0 40px -20px rgba(44,140,255,0.3)",
                  }}
                  data-testid={`card-roadmap-${p.id}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                  <div
                    className="absolute -inset-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
                    aria-hidden="true"
                    style={{ background: `radial-gradient(400px at 50% 50%, ${p.accent}, transparent 80%)` }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="text-[hsl(var(--ring))] text-sm font-bold tracking-widest uppercase" data-testid={`text-roadmap-num-${p.id}`}>{p.num}</div>
                      <div className="h-px w-8 bg-[hsl(var(--ring))]/30" />
                      <div className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase">{p.phase}</div>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4 leading-tight" data-testid={`text-roadmap-phase-${p.id}`}>{p.title}</h3>
                    <p className="text-white/40 leading-relaxed font-light text-[15px]" data-testid={`text-roadmap-desc-${p.id}`}>{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Connect */}
        <div className="mt-16" data-testid="box-footer-glass">
          <div className="glass-card rounded-[48px] px-8 md:px-16 py-24 md:py-28 relative overflow-hidden group border-white/5" data-testid="section-community-footer">
            <div
              className="absolute -inset-24 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none"
              aria-hidden="true"
              style={{
                background: "radial-gradient(1000px at 50% 50%, rgba(0,214,255,0.2), transparent 70%)"
              }}
            />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center rounded-full glass-soft px-5 py-2 mb-8 border-white/10" data-testid="pill-community">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]" data-testid="text-community-kicker">Global Network</span>
              </div>
              <h2 className="text-[34px] md:text-[64px] font-semibold text-white tracking-tight leading-[1.05] max-w-4xl" data-testid="text-community-title">
                The future is built <span className="text-gradient-primary">together</span>
              </h2>
              <p className="mt-8 text-white/40 text-lg md:text-xl leading-relaxed max-w-2xl font-light" data-testid="text-community-desc">
                Join a decentralized community of developers, investors, and visionaries shaping the next era of financial sovereignty.
              </p>
              
              <div className="mt-20 w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" data-testid="grid-social-links">
                  {[{
                    label: "Telegram",
                    icon: Send,
                    id: "telegram",
                    href: "https://t.me/Hodl_Holdings"
                  }, {
                    label: "X",
                    icon: XIcon,
                    id: "x",
                    href: "https://x.com/hodlholdingsDFi"
                  }, {
                    label: "Discord",
                    icon: MessageSquare,
                    id: "discord",
                    href: "https://discord.com/invite/mbd9CpPx3R"
                  }].map((s) => {
                    const Icon = s.icon as any;
                    return (
                      <a
                        key={s.id}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-soft scan-hover group rounded-[32px] p-10 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2 border-white/5 hover:border-[hsl(var(--ring))]/30"
                        data-testid={`link-social-${s.id}`}
                      >
                        <div className="h-20 w-20 rounded-[28px] bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[hsl(var(--ring))]/40 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,214,255,0.15)]" aria-hidden="true">
                          <Icon className="w-8 h-8 text-[hsl(var(--ring))]" />
                        </div>
                        <div className="text-white font-semibold text-2xl" data-testid={`text-social-${s.id}`}>{s.label}</div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
            <div className="text-white/20 text-[13px] tracking-wide font-medium" data-testid="text-footer-copyright">
              © {new Date().getFullYear()} Hodl Holdings. All rights reserved.
            </div>
            <div className="flex items-center gap-8">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
