import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Check, Smartphone, Loader2 } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

export function Header() {
  const { address, isConnected, connect, connectPWA, disconnect, isExtensionAvailable, walletLinkSession } = useWallet();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handlePWAConnect = async () => {
    setIsConnecting(true);
    try {
      await connectPWA();
    } catch (err) {
      console.error("PWA connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2" data-testid="wallet-connected">
        <div className="glass-soft flex items-center gap-2 rounded-full pl-4 pr-2 py-1.5 border border-white/5">
          <div className="h-2 w-2 rounded-full bg-[#55FFAC] animate-pulse" />
          <span className="text-xs font-mono text-white/80" data-testid="text-wallet-address">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-red-500/20 hover:text-red-300 transition-colors text-white/70"
            onClick={disconnect}
            data-testid="button-wallet-disconnect"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" data-testid="wallet-disconnected">
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogTrigger asChild>
          <Button
            className="glass-soft rounded-full text-[#55FFAC] hover:border-[#55FFAC]/40 hover:bg-[#55FFAC]/5 transition-all px-5 h-10 border border-white/5 group"
            data-testid="button-wallet-connect"
          >
            <Wallet className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-white/10 bg-[#050505]/95 backdrop-blur-2xl rounded-[32px] sm:max-w-[420px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            <DialogHeader className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-[#55FFAC]/10 flex items-center justify-center mb-2 border border-[#55FFAC]/20">
                <Wallet className="h-6 w-6 text-[#55FFAC]" />
              </div>
              <DialogTitle className="text-2xl font-semibold text-white tracking-tight">Connect Wallet</DialogTitle>
              <DialogDescription className="text-white/40 font-light leading-relaxed">
                Choose your preferred method to connect your wallet.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-4">
              {/* Extension Option */}
              <Button
                onClick={() => connect()}
                disabled={!isExtensionAvailable || isConnecting}
                className={`w-full justify-between h-16 rounded-2xl px-6 transition-all border ${
                  isExtensionAvailable 
                    ? "glass-soft border-white/5 hover:border-[#55FFAC]/40 hover:bg-white/5 text-white" 
                    : "bg-white/5 border-transparent text-white/20 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isExtensionAvailable ? "bg-[#55FFAC]/10 text-[#55FFAC]" : "bg-white/5 text-white/10"}`}>
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">Browser Extension (Chrome)</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-40">Desktop Recommended</div>
                  </div>
                </div>
                {!isExtensionAvailable && (
                  <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40">Not Found</div>
                )}
              </Button>

              {/* WalletLink / QR Option */}
              {!walletLinkSession ? (
                <Button
                  onClick={handlePWAConnect}
                  disabled={isConnecting}
                  className="w-full justify-between h-16 rounded-2xl px-6 transition-all border glass-soft border-white/5 hover:border-[#55FFAC]/40 hover:bg-white/5 text-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-[#55FFAC]/10 text-[#55FFAC] flex items-center justify-center">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">Web Wallet</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-40">Scan QR Code</div>
                    </div>
                  </div>
                  {isConnecting && <Loader2 className="w-4 h-4 animate-spin text-white/20" />}
                </Button>
              ) : (
                <div className="p-6 glass-soft border-white/10 rounded-2xl flex flex-col items-center text-center">
                  <div className="bg-white p-3 rounded-xl mb-4">
                    <QRCodeSVG value={walletLinkSession.wlData} size={180} />
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Scan with Sultan Wallet</div>
                  <div className="text-xs text-white/40 mb-6">Establishing secure connection...</div>
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button
                      asChild
                      className="bg-[#55FFAC] hover:bg-[#44e69b] text-black font-bold h-11 rounded-xl"
                    >
                      <a href={walletLinkSession.deepLink} target="_blank" rel="noopener noreferrer">
                        Open Wallet
                      </a>
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(walletLinkSession.wlData);
                      }}
                      variant="outline"
                      className="glass-soft border-white/10 text-white h-11 rounded-xl hover:bg-white/5"
                    >
                      Copy Code
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
