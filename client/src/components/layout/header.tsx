import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { WalletConnectModal } from "@/components/WalletConnectModal";

export function Header() {
  const { address, isConnected, disconnect, isExtensionAvailable, connect } = useWallet();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleConnect = async () => {
    if (isExtensionAvailable) {
      try {
        await connect();
      } catch (err) {
        console.error("Extension connection failed:", err);
        setShowConnectModal(true);
      }
    } else {
      setShowConnectModal(true);
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
      <Button
        className="glass-soft rounded-full text-[#55FFAC] hover:border-[#55FFAC]/40 hover:bg-[#55FFAC]/5 transition-all px-5 h-10 border border-white/5 group"
        onClick={handleConnect}
        data-testid="button-wallet-connect"
      >
        <Wallet className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
        Connect Wallet
      </Button>

      <WalletConnectModal 
        open={showConnectModal} 
        onOpenChange={setShowConnectModal} 
      />
    </div>
  );
}
