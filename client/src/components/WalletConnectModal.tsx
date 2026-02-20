import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Check, Wallet, Loader2, X, Radio } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useWallet } from "@/lib/wallet";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ConnectionStatus = 'idle' | 'generating' | 'waiting' | 'broadcast-waiting' | 'connected' | 'error';

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connect, connectPWA, connectBroadcast, isExtensionAvailable, isPWAAvailable, walletLinkSession, isConnected } = useWallet();
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleExtensionConnect = async () => {
    setStatus('generating');
    try {
      await connect();
      onOpenChange(false);
    } catch (err) {
      console.error("Extension connection failed:", err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  /** Direct BroadcastChannel connect (same-browser PWA). */
  const handleBroadcastConnect = async () => {
    setStatus('broadcast-waiting');
    try {
      await connectBroadcast();
      onOpenChange(false);
    } catch (err) {
      console.error("BroadcastChannel connection failed:", err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const handlePWAConnect = async () => {
    setStatus('generating');
    try {
      // Pre-open wallet tab during user gesture to avoid popup blockers.
      // It will be redirected to the deep-link URL once the session is ready.
      const walletTab = window.open('about:blank', '_blank');
      setStatus('waiting');
      await connectPWA(walletTab);
    } catch (err) {
      console.error("PWA connection failed:", err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setError(null);
    }
  }, [open]);

  // Close modal when connected
  useEffect(() => {
    if (open && isConnected && (status === 'waiting' || status === 'broadcast-waiting')) {
      onOpenChange(false);
    }
  }, [isConnected, open, status, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {status === 'error' ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-red-400 text-center text-sm">{error || 'Connection failed'}</p>
                <Button
                  onClick={() => setStatus('idle')}
                  className="w-full bg-[#55FFAC] hover:bg-[#44e69b] text-black font-bold h-12 rounded-xl"
                >
                  Try Again
                </Button>
              </div>
            ) : !walletLinkSession ? (
              <>
                <Button
                  onClick={handleExtensionConnect}
                  disabled={!isExtensionAvailable || status === 'generating'}
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
                  {status === 'generating' && <Loader2 className="w-4 h-4 animate-spin text-white/20" />}
                </Button>

                {/* Same-browser PWA via BroadcastChannel — shown when wallet PWA is detected */}
                <Button
                  onClick={handleBroadcastConnect}
                  disabled={!isPWAAvailable || status === 'broadcast-waiting'}
                  className={`w-full justify-between h-16 rounded-2xl px-6 transition-all border ${
                    isPWAAvailable
                      ? "glass-soft border-[#55FFAC]/20 hover:border-[#55FFAC]/40 hover:bg-white/5 text-white"
                      : "bg-white/5 border-transparent text-white/20 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isPWAAvailable ? "bg-[#55FFAC]/10 text-[#55FFAC]" : "bg-white/5 text-white/10"}`}>
                      <Radio className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">Same Browser (PWA)</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-40">
                        {isPWAAvailable ? 'Wallet detected — instant' : 'Open wallet.sltn.io first'}
                      </div>
                    </div>
                  </div>
                  {!isPWAAvailable && (
                    <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40">Not Found</div>
                  )}
                  {status === 'broadcast-waiting' && <Loader2 className="w-4 h-4 animate-spin text-[#55FFAC]/60" />}
                </Button>

                <Button
                  onClick={handlePWAConnect}
                  disabled={status === 'generating'}
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
                </Button>
              </>
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
  );
}
