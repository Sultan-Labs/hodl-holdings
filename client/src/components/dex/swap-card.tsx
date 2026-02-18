import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, Settings, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/lib/wallet";

const TOKENS = [
  { symbol: "SLTN", name: "Sultan", balance: "1000.00" },
  { symbol: "USDH", name: "Sultan USD", balance: "500.00" },
  { symbol: "GLD", name: "Digital Gold", balance: "10.50" },
  { symbol: "TECH", name: "Tech Index", balance: "0.00" },
];

export function SwapCard() {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fromToken, setFromToken] = useState("SLTN");
  const [toToken, setToToken] = useState("USDH");
  const [amount, setAmount] = useState("");

  const handleSwap = () => {
    if (!isConnected) {
        toast({
            title: "Wallet not connected",
            description: "Please connect your wallet to swap tokens.",
            variant: "destructive"
        });
        return;
    }

    setLoading(true);
    // Mock API Call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Swap Executed",
        description: `Swapped ${amount} ${fromToken} for ${toToken}`,
        className: "bg-green-900 border-green-800 text-white"
      });
      setAmount("");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto" data-testid="card-swap-wrapper">
      <Card className="glass-card rounded-3xl" data-testid="card-swap">
        <CardHeader className="flex flex-row items-center justify-between pb-2" data-testid="row-swap-header">
          <CardTitle className="text-lg font-semibold text-white" data-testid="text-swap-title">Swap</CardTitle>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white" data-testid="button-swap-settings">
            <Settings className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="content-swap">
          
          {/* From Input */}
          <div className="glass-soft rounded-2xl p-4 space-y-2" data-testid="panel-swap-from">
            <div className="flex justify-between text-xs text-white/55" data-testid="row-swap-from-meta">
              <span data-testid="text-swap-from-label">From</span>
              <span data-testid="text-swap-from-balance">Balance: {TOKENS.find(t => t.symbol === fromToken)?.balance}</span>
            </div>
            <div className="flex gap-2" data-testid="row-swap-from-input">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-none text-2xl font-semibold p-0 focus-visible:ring-0 shadow-none h-auto placeholder:text-white/25 text-white"
                data-testid="input-swap-amount"
              />
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="glass-soft w-[118px] rounded-full font-semibold text-white" data-testid="select-from-token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.map(t => (
                    <SelectItem key={t.symbol} value={t.symbol}>{t.symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-3 relative z-10">
            <Button
              size="icon"
              className="glass-soft rounded-full text-primary hover:bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.55)] h-9 w-9"
              onClick={() => {
                const temp = fromToken;
                setFromToken(toToken);
                setToToken(temp);
              }}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Input */}
          <div className="glass-soft rounded-2xl p-4 space-y-2" data-testid="panel-swap-to">
            <div className="flex justify-between text-xs text-white/55" data-testid="row-swap-to-meta">
              <span data-testid="text-swap-to-label">To (Estimate)</span>
              <span data-testid="text-swap-to-balance">Balance: {TOKENS.find(t => t.symbol === toToken)?.balance}</span>
            </div>
            <div className="flex gap-2" data-testid="row-swap-to-input">
              <Input
                type="number"
                placeholder="0.0"
                readOnly
                value={amount ? (parseFloat(amount) * 1.5).toFixed(2) : ""}
                className="bg-transparent border-none text-2xl font-semibold p-0 focus-visible:ring-0 shadow-none h-auto text-primary placeholder:text-white/25"
                data-testid="input-swap-estimate"
              />
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="glass-soft w-[118px] rounded-full font-semibold text-white" data-testid="select-to-token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                   {TOKENS.map(t => (
                    <SelectItem key={t.symbol} value={t.symbol}>{t.symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-2 pt-2" data-testid="panel-swap-info">
            <div className="flex justify-between text-sm" data-testid="row-swap-rate">
              <span className="text-white/55" data-testid="text-swap-rate-label">Rate</span>
              <span className="font-mono text-xs text-white/80" data-testid="text-swap-rate-value">1 {fromToken} ≈ 1.5 {toToken}</span>
            </div>
            <div className="flex justify-between text-sm" data-testid="row-swap-fee">
              <span className="text-white/55" data-testid="text-swap-fee-label">Network Fee</span>
              <span className="font-mono text-xs text-primary" data-testid="text-swap-fee-value">0.00 SLTN (Free)</span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-[15px] font-semibold rounded-full bg-primary text-black shadow-[0_0_28px_rgba(85,255,172,0.26)] hover:shadow-[0_0_40px_rgba(85,255,172,0.38)] transition-shadow"
            onClick={handleSwap}
            disabled={loading}
            data-testid="button-swap-submit"
          >
            {loading ? <RefreshCcw className="animate-spin mr-2" /> : null}
            {loading ? "Swapping..." : "Swap Tokens"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
