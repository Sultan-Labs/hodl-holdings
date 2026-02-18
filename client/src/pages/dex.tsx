import { motion, AnimatePresence } from "framer-motion";
import { SwapCard } from "@/components/dex/swap-card";
import { useState } from "react";
import { Maximize2, X } from "lucide-react";

export default function DexPage() {
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null);

  const widgets = [
    {
      id: "terminal",
      title: "Trading Terminal",
      src: "https://x.sltn.io",
      allow: "clipboard-read; clipboard-write; usb; gpg; camera; microphone; payment;"
    },
    {
      id: "dexscreener",
      title: "DexScreener",
      src: "https://dexscreener.com/?embed=1&theme=dark",
      allow: undefined
    },
    {
      id: "telegram",
      title: "Alpha Community",
      content: (
        <div className="flex flex-col items-center justify-center p-6 text-center h-full">
          <div className="w-16 h-16 rounded-full bg-[#24A1DE]/10 flex items-center justify-center mb-6 mx-auto border border-[#24A1DE]/20 group-hover:border-[#24A1DE]/50 transition-all duration-500">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#24A1DE]" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.77 4.84-1.78.11 0 .35.03.5.16.13.1.17.24.18.34.02.06.02.21.01.28z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Alpha Community</h3>
          <p className="text-white/40 text-sm mb-8 max-w-[160px] mx-auto leading-relaxed">Join the institutional HODL signal group for real-time alpha.</p>
          <a 
            href="https://t.me/replit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center glass-soft rounded-full px-8 py-3 text-sm font-bold text-white border border-white/10 hover:bg-[#24A1DE]/10 hover:border-[#24A1DE]/40 transition-all duration-300 w-full"
          >
            Open Telegram
          </a>
        </div>
      )
    }
  ];

  const activeWidget = (widgets as any[]).find(w => w.id === fullscreenWidget);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-deep-cyber pt-10 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 border-white/10 mb-8"
          >
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]">
              Trading Terminal
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
            Effortless <span className="bg-gradient-to-r from-[#55FFAC] to-[#2C8CFF] bg-clip-text text-transparent">Exchanges</span>
          </h1>
          <p className="text-white/40 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Trade any token in seconds with our optimized high-speed routing and intuitive interface.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Main Swap Card */}
          <div className="lg:col-span-4">
            <SwapCard />
          </div>

          {/* External Widgets */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-px flex-1 bg-white/5" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">Market Intelligence</h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {widgets.map((widget, idx) => (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                  className="glass-card rounded-[32px] overflow-hidden border border-white/5 relative aspect-square w-full shadow-2xl shadow-black/50 group"
                  data-testid={`widget-${widget.id}`}
                >
                  <button 
                    onClick={() => setFullscreenWidget(widget.id)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                    title="Fullscreen"
                  >
                    <Maximize2 size={14} />
                  </button>
                  {"src" in widget ? (
                    <iframe
                      src={widget.src}
                      className="w-full h-full border-none"
                      title={widget.title}
                      allow={(widget as any).allow}
                    />
                  ) : (
                    (widget as any).content
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fullscreenWidget && activeWidget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-4 md:p-10 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{activeWidget.title}</h2>
              <button 
                onClick={() => setFullscreenWidget(null)}
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 rounded-[48px] overflow-hidden border border-white/10 bg-black shadow-2xl shadow-blue-500/10"
            >
              {"src" in activeWidget ? (
                <iframe
                  src={activeWidget.src}
                  className="w-full h-full border-none"
                  title={activeWidget.title}
                  allow={(activeWidget as any).allow}
                />
              ) : (
                <div className="bg-deep-cyber h-full">
                  {activeWidget.content}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
