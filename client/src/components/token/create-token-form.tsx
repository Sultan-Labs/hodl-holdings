import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Info } from "lucide-react";
import { useWallet } from "@/lib/wallet";

export function CreateTokenForm() {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
        toast({
            title: "Wallet Required",
            description: "Please connect wallet to create a token.",
            variant: "destructive"
        });
        return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Token Created!",
        description: "Your new asset has been deployed to the Sultan Chain.",
        className: "bg-primary text-black border-none"
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto" data-testid="card-token-factory-wrapper">
      <Card className="glass-card rounded-3xl" data-testid="card-token-factory">
        <CardHeader className="pb-2" data-testid="row-token-header">
          <CardTitle className="text-lg font-semibold text-white" data-testid="text-token-title">Token Factory</CardTitle>
          <div className="flex items-center gap-2 mt-1 text-xs text-white/55">
            <Info size={12} className="text-primary" />
            <span>Deploy a new standard asset on Sultan L1. Fee: 3 SLTN.</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4" data-testid="content-token-factory">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Token Name & Symbol Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-soft rounded-2xl p-4 space-y-2">
                <span className="text-xs text-white/55">Token Name</span>
                <Input 
                  id="name" 
                  placeholder="e.g. Galactic Credits" 
                  className="bg-transparent border-none text-lg font-semibold p-0 focus-visible:ring-0 shadow-none h-auto placeholder:text-white/25 text-white" 
                  required 
                />
              </div>
              <div className="glass-soft rounded-2xl p-4 space-y-2">
                <span className="text-xs text-white/55">Symbol</span>
                <Input 
                  id="symbol" 
                  placeholder="e.g. CRED" 
                  className="bg-transparent border-none text-lg font-semibold p-0 focus-visible:ring-0 shadow-none h-auto placeholder:text-white/25 text-white uppercase font-mono" 
                  required 
                />
              </div>
            </div>

            {/* Decimals & Supply Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-soft rounded-2xl p-4 space-y-2">
                <span className="text-xs text-white/55">Decimals</span>
                <Input 
                  id="decimals" 
                  type="number" 
                  defaultValue="18" 
                  className="bg-transparent border-none text-lg font-semibold p-0 focus-visible:ring-0 shadow-none h-auto text-white" 
                />
              </div>
              <div className="glass-soft rounded-2xl p-4 space-y-2">
                <span className="text-xs text-white/55">Initial Supply</span>
                <Input 
                  id="supply" 
                  type="number" 
                  placeholder="1000000" 
                  className="bg-transparent border-none text-lg font-semibold p-0 focus-visible:ring-0 shadow-none h-auto placeholder:text-white/25 text-white" 
                  required 
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="glass-soft rounded-2xl p-4 space-y-2">
              <span className="text-xs text-white/55">Token Logo</span>
              <div className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-white/40 hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer group">
                <Upload className="w-6 h-6 mb-2 group-hover:text-primary transition-colors" />
                <span className="text-[11px] font-medium">Click to upload logo (PNG/SVG)</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-[15px] font-semibold rounded-full bg-primary text-black shadow-[0_0_28px_rgba(85,255,172,0.26)] hover:shadow-[0_0_40px_rgba(85,255,172,0.38)] transition-all mt-4"
              disabled={loading}
              data-testid="button-token-submit"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? "Deploying Asset..." : "Create Token (3 SLTN)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
