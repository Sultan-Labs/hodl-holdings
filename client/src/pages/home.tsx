import { Button } from "@/components/ui/button";
import heroWings from "@/assets/hero-wings.png";
import { ArrowRight, Sprout, ArrowRightLeft, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/footer";

const QUICK_VALUE = [
  {
    icon: Sparkles,
    title: "Launch tokens",
    desc: "Create & deploy your own tokens",
    href: "/tokens",
    testId: "value-deploy",
  },
  {
    icon: ArrowRightLeft,
    title: "Trade instantly",
    desc: "Fast swaps with clean UX",
    href: "/dex",
    testId: "value-trade",
  },
  {
    icon: Sprout,
    title: "Earn automatically",
    desc: "Stake and compound rewards",
    href: "/pools",
    testId: "value-earn",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-deep-cyber">
      <section className="relative overflow-hidden pt-6 md:pt-10" data-testid="section-hero">
        <div className="absolute inset-0" aria-hidden="true">
          {/* Background Wings - Desktop and Mobile responsive */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Left Wing - Anchor for both desktop and mobile */}
            <div
              className="absolute inset-y-0 left-0 w-full"
              style={{
                backgroundImage: `url(${heroWings})`,
                backgroundSize: "contain",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
                opacity: 0.08,
                filter: "blur(1px)",
                transform: "translateX(var(--wing-left-offset)) translateZ(0)",
              }}
            />
            {/* Right Wing - Mirror on right side (Desktop only) */}
            <div
              className="absolute inset-y-0 right-0 w-full hidden md:block"
              style={{
                backgroundImage: `url(${heroWings})`,
                backgroundSize: "contain",
                backgroundPosition: "right center",
                backgroundRepeat: "no-repeat",
                opacity: 0.08,
                filter: "blur(1px)",
                transform: "scaleX(-1) translateX(var(--wing-right-offset)) translateZ(0)",
              }}
            />
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --wing-left-offset: -10%;
              --wing-right-offset: 10%;
            }
            @media (min-width: 768px) {
              :root {
                --wing-left-offset: -25%;
                --wing-right-offset: 65%;
              }
            }
          `}} />

          <div
            className="absolute -inset-24"
            style={{
              background:
                "radial-gradient(1200px at 50% 50%, rgba(44,140,255,0.08), transparent 70%)",
              opacity: 0.9,
            }}
          />

          <div className="absolute inset-0 opacity-[0.08] grid-lines" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>

        <div className="relative px-6 md:px-12 pt-8 md:pt-12 pb-14 md:pb-18">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-[40px] sm:text-7xl md:text-8xl font-semibold text-white leading-[1.1] tracking-tight px-4"
              data-testid="text-hero-title"
            >
              Unlock the <span className="text-gradient-primary">Power of DeFi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
              className="mt-8 text-[15px] md:text-[21px] text-white/80 leading-relaxed font-light max-w-[44rem] mx-auto tracking-normal"
              data-testid="text-hero-subtitle"
            >
              <span className="text-white">HODL Holdings</span> offers a <span className="text-white">dynamic suite of decentralized finance tools</span> on <span className="text-white">SULTAN</span> designed to <span className="text-white">maximize yield</span> for <span className="text-white">individuals</span>, <span className="text-white">businesses</span>, and <span className="text-white">DAOs</span> on their <span className="text-white">crypto-asset investments</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
              className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12"
              data-testid="grid-hero-value"
            >
              {QUICK_VALUE.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href}>
                    <div
                      className="group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                      data-testid={`card-${item.testId}`}
                    >
                      <div className="h-16 w-16 rounded-[24px] glass-soft flex items-center justify-center mb-6 border border-white/5 group-hover:border-[hsl(var(--ring))]/30 transition-all duration-500">
                        <Icon className="h-7 w-7 text-[hsl(var(--ring))]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold text-xl mb-2" data-testid={`text-${item.testId}-title`}>
                          {item.title}
                        </div>
                        <div className="text-[15px] text-white/30 group-hover:text-white/50 transition-colors font-light" data-testid={`text-${item.testId}-desc`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 mt-24" data-testid="section-home-highlights">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 glass-card rounded-[48px] p-12 md:p-20 relative overflow-hidden group border-white/5" data-testid="panel-home-feature">
              <div
                className="absolute -inset-24 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(1000px 600px at 50% 50%, rgba(85,255,172,0.12), transparent 70%), radial-gradient(1000px 600px at 50% 50%, rgba(44,140,255,0.08), transparent 70%)",
                }}
              />
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center rounded-full glass-soft px-5 py-2 mb-8 border-white/10" data-testid="pill-platform">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]">Ecosystem Overview</span>
                </div>
                <h2 className="text-[32px] md:text-[56px] font-semibold text-white leading-[1.02] tracking-tight" data-testid="text-home-feature-title">
                  A comprehensive <span className="text-gradient-primary">DeFi ecosystem</span>
                </h2>
                <p className="mt-8 text-white/40 text-[15px] md:text-[21px] font-light leading-relaxed max-w-2xl mx-auto" data-testid="text-home-feature-desc">
                  Explore a comprehensive ecosystem of unified financial services designed to maximize your potential with automatic rewards and professional tools.
                </p>
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto" data-testid="group-home-feature-pillars">
                  {[
                    {
                      title: "Unified services",
                      desc: "Unified ecosystem with a singular, intuitive user experience for all financial operations.",
                      id: "unified",
                      icon: ShieldCheck,
                      accent: "rgba(85,255,172,0.15)"
                    },
                    {
                      title: "Automatic rewards",
                      desc: "Generate continuous passive yield through automated participation in the SULTAN network.",
                      id: "rewards",
                      icon: Sprout,
                      accent: "rgba(0,214,255,0.15)"
                    },
                    {
                      title: "AI optimization",
                      desc: "Advanced yield routing and risk management powered by proprietary AI modeling (coming soon).",
                      id: "ai",
                      icon: Sparkles,
                      accent: "rgba(85,255,172,0.15)"
                    },
                  ].map((p, idx) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="glass-soft rounded-[32px] p-10 text-left relative overflow-hidden group/pillar border-white/5 hover:border-white/20 transition-all duration-500"
                        style={{
                          boxShadow: "0 0 40px -20px rgba(85,255,172,0.3)",
                        }}
                        data-testid={`card-platform-${p.id}`}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.8 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.1 * idx }}
                          className="absolute inset-0 bg-gradient-to-br from-[#55FFAC]/10 via-transparent to-[#2C8CFF]/5 pointer-events-none"
                        />
                        <div
                          className="absolute -inset-10 opacity-0 group-hover/pillar:opacity-100 transition-opacity duration-700"
                          aria-hidden="true"
                          style={{ background: `radial-gradient(400px at 50% 50%, ${p.accent}, transparent 80%)` }}
                        />
                        <div className="relative z-10">
                          <div className="h-16 w-16 rounded-[24px] bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover/pillar:border-[hsl(var(--ring))]/40 transition-all duration-500">
                            <Icon className="h-7 w-7 text-[hsl(var(--ring))]" />
                          </div>
                          <div className="text-white font-semibold text-2xl mb-4 leading-tight" data-testid={`text-platform-title-${p.id}`}>
                            {p.title}
                          </div>
                          <div className="text-white/40 leading-relaxed font-light text-[15px]" data-testid={`text-platform-desc-${p.id}`}>
                            {p.desc}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" aria-hidden="true" />
      <Footer />
    </div>
  );
}
