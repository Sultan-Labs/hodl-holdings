import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Header } from "@/components/layout/header";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tokens", label: "Token Factory" },
  { href: "/swap", label: "Trade" },
  { href: "/pools", label: "Earn" },
  { href: "/shop", label: "Shop" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1" data-testid="nav-primary">
      {navItems.map((item) => {
        const active = location === item.href;
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <span
              className={cn(
                "px-4 py-2 rounded-none text-[13px] font-medium transition-colors border border-transparent cursor-pointer",
                active
                  ? "text-white"
                  : "text-white/70 hover:text-white",
              )}
              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className={cn("relative px-2 py-1", active && "after:absolute after:left-2 after:right-2 after:-bottom-2 after:h-px after:bg-[hsl(var(--ring))] after:shadow-[0_0_12px_rgba(44,140,255,0.22)]")}>{item.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-background/40 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-5 md:px-6 h-[76px] flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-logo-home">
          <img src={logo} alt="Hodl Holdings" className="h-16 w-auto" data-testid="img-logo" />
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1">
          <div
            className="glass-soft rounded-full px-2 py-1.5"
            data-testid="pill-nav"
          >
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Header />
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white" data-testid="button-open-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0a0b] border-white/10">
                <div className="pt-8 space-y-8">
                  <NavLinks />
                  <div className="border-t border-white/10 pt-6">
                    <Header />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
