import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout/layout";
import DexPage from "@/pages/dex";
import TokensPage from "@/pages/tokens";
import PoolsPage from "@/pages/pools";
import HomePage from "@/pages/home";
import ShopPage from "@/pages/shop";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-3" data-testid="page-placeholder">
      <h1 className="text-3xl font-display font-bold text-white" data-testid="text-page-title">{title}</h1>
      <p className="text-white/60" data-testid="text-page-subtitle">This section is coming next in the prototype.</p>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/swap" component={DexPage} />
        <Route path="/tokens" component={TokensPage} />
        <Route path="/pools" component={PoolsPage} />
        <Route path="/shop" component={ShopPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
