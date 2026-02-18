import { Link, useLocation } from "wouter";
import { 
  ArrowLeftRight, 
  Coins, 
  LayoutDashboard, 
  Menu, 
  X, 
  ShieldCheck, 
  Vote, 
  Landmark, 
  Wallet,
  Globe,
  Umbrella
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import generatedLogo from "@assets/generated_images/hodil_holdings_logo_emerald_and_silver.png";

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Globe },
    { href: "/swap", label: "Trade Crypto", icon: ArrowLeftRight },
    { href: "/pools", label: "Staking Pools", icon: Coins },
    { href: "/governance", label: "veHODL Governance", icon: Vote },
    { href: "/lending", label: "Cross-Chain Lending", icon: Landmark },
    { href: "/rwa", label: "RWA Tokenization", icon: LayoutDashboard },
    { href: "/insurance", label: "Insurance Protocol", icon: Umbrella },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-[#0a0a0b]/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 px-2">
            <img 
              src={generatedLogo} 
              alt="Hodil Logo" 
              className="w-8 h-8 object-contain" 
            />
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-tight">Hodil Holdings</h1>
            </div>
          </div>

          <div className="mb-6">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20">
              Join Presale
            </Button>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-white/5 text-cyan-400" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-white")} />
                    <span className="font-medium text-sm">{link.label}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_var(--color-primary)]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
             <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">veHODL Active</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[70%]" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Next Reward: 14h 20m</p>
             </div>
             
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-xs text-gray-400">Solana Mainnet</span>
                </div>
                <span className="text-xs text-cyan-400 font-mono">TPS: 65k+</span>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
