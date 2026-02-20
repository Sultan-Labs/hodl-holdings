import { useState, useEffect, useCallback } from 'react';
import * as sultanApi from './sultanApi';
import { getWalletLink } from '../api/walletLink';

// BroadcastChannel names matching the wallet PWA's WalletBroadcastService
const DAPP_CHANNEL = 'sultan-wallet-dapp';
const WALLET_CHANNEL = 'sultan-wallet-response';

/** Detect whether the Sultan Wallet PWA is open in the same browser via BroadcastChannel ping/pong. */
function detectPWAWallet(timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof BroadcastChannel === 'undefined') {
      resolve(false);
      return;
    }
    const tx = new BroadcastChannel(DAPP_CHANNEL);
    const rx = new BroadcastChannel(WALLET_CHANNEL);
    const timer = setTimeout(() => { cleanup(); resolve(false); }, timeoutMs);
    const cleanup = () => {
      clearTimeout(timer);
      tx.close();
      rx.close();
    };
    rx.onmessage = (e) => {
      if (e.data?.type === 'PONG') { cleanup(); resolve(true); }
    };
    tx.postMessage({ type: 'PING', id: crypto.randomUUID() });
  });
}

/** Send a typed request over BroadcastChannel and wait for the matching response. */
function broadcastRequest<T = unknown>(
  payload: Record<string, unknown>,
  timeoutMs = 120_000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = new BroadcastChannel(DAPP_CHANNEL);
    const rx = new BroadcastChannel(WALLET_CHANNEL);
    const id = crypto.randomUUID();
    const timer = setTimeout(() => { cleanup(); reject(new Error('Wallet did not respond in time')); }, timeoutMs);
    const cleanup = () => { clearTimeout(timer); tx.close(); rx.close(); };
    rx.onmessage = (e) => {
      if (e.data?.id !== id) return;
      cleanup();
      if (e.data.error) reject(new Error(e.data.error));
      else resolve(e.data as T);
    };
    tx.postMessage({ ...payload, id, origin: window.location.origin });
  });
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [isPWAAvailable, setIsPWAAvailable] = useState(false);
  const [walletLinkSession, setWalletLinkSession] = useState<{ deepLink: string, wlData: string } | null>(null);
  const [connectionMethod, setConnectionMethod] = useState<'extension' | 'broadcast' | 'walletlink' | null>(null);

  const initWallet = useCallback(async () => {
    const stored = localStorage.getItem('sultan_wallet');
    if (stored) {
      setAddress(stored);
      setIsConnected(true);
      try {
        const state = await sultanApi.getWalletState();
        if (state.connected && state.address === stored) {
          setBalance(state.balance);
        } else {
          setBalance('0');
        }
      } catch (err) {
        setBalance('0');
      }
    }
  }, []);

  useEffect(() => {
    const checkExtension = () => {
      setIsExtensionAvailable(sultanApi.isWalletInstalled());
    };

    checkExtension();
    const interval = setInterval(checkExtension, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    // Probe for PWA wallet via BroadcastChannel (non-blocking)
    detectPWAWallet().then(setIsPWAAvailable);

    initWallet();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [initWallet]);

  const connectExtension = async () => {
    if (sultanApi.isWalletInstalled()) {
      try {
        const walletState = await sultanApi.connectWallet();
        setAddress(walletState.address);
        setIsConnected(true);
        setBalance(walletState.balance);
        if (walletState.address) {
          localStorage.setItem('sultan_wallet', walletState.address);
        }
        return walletState.address || "";
      } catch (err) {
        console.error("Extension connection error:", err);
        return "";
      }
    }
    throw new Error("Extension not found");
  };

  /** Connect via BroadcastChannel (same-browser PWA wallet). */
  const connectBroadcast = async (): Promise<string> => {
    const resp = await broadcastRequest<{ type: string; address: string; publicKey: string }>({
      type: 'CONNECT',
    });
    if (!resp.address) throw new Error('No address received from PWA wallet');
    setAddress(resp.address);
    setIsConnected(true);
    setConnectionMethod('broadcast');
    localStorage.setItem('sultan_wallet', resp.address);
    localStorage.setItem('sultan_wallet_method', 'broadcast');
    // Fetch balance in background
    sultanApi.getWalletState()
      .then(state => setBalance(state.balance))
      .catch(() => setBalance('0'));
    return resp.address;
  };

  /**
   * Connect via PWA – first tries BroadcastChannel (instant, same-browser),
   * then falls back to WalletLink relay (QR code / deep link).
   */
  const connectPWA = async () => {
    // Try BroadcastChannel first (instant if wallet PWA is open)
    const pwaDetected = await detectPWAWallet(1200);
    if (pwaDetected) {
      return connectBroadcast();
    }

    // Fall back to WalletLink QR / deep link
    const walletLink = getWalletLink();
    const { deepLinkUrl } = await walletLink.generateSession();
    
    const url = new URL(deepLinkUrl);
    const wlData = url.searchParams.get('session') || '';
    
    setWalletLinkSession({ deepLink: deepLinkUrl, wlData });

    return new Promise<string>((resolve, reject) => {
      const unsub = walletLink.on((event) => {
        if (event.type === 'connected' && event.data) {
          const walletData = event.data as { address: string };
          setAddress(walletData.address);
          setIsConnected(true);
          setConnectionMethod('walletlink');
          
          sultanApi.getWalletState()
            .then(state => setBalance(state.balance))
            .catch(() => setBalance('0'));
          
          localStorage.setItem('sultan_wallet', walletData.address);
          localStorage.setItem('sultan_wallet_method', 'walletlink');
          setWalletLinkSession(null);
          unsub();
          resolve(walletData.address);
        } else if (event.type === 'error') {
          unsub();
          reject(event.data);
        }
      });
      
      walletLink.waitForConnection().catch((err) => {
        unsub();
        reject(err);
      });
    });
  };

  const connect = async (manualPrivKey?: string) => {
    try {
      if (manualPrivKey) {
        // Mock connection for manual private key
        const mockAddress = `sultan_mock_${Math.random().toString(16).slice(2, 10)}`;
        setAddress(mockAddress);
        setIsConnected(true);
        setBalance('1000.00');
        localStorage.setItem('sultan_wallet', mockAddress);
        return mockAddress;
      }
      // Try extension first
      if (sultanApi.isWalletInstalled()) {
        const addr = await connectExtension();
        setConnectionMethod('extension');
        localStorage.setItem('sultan_wallet_method', 'extension');
        return addr;
      }
      // No extension – try BroadcastChannel (same-browser PWA)
      const pwaDetected = await detectPWAWallet(1200);
      if (pwaDetected) {
        return await connectBroadcast();
      }
      // Fall through to extension attempt (will throw)
      return await connectExtension();
    } catch (err) {
      console.error("Connection failed", err);
      return "";
    }
  };

  const disconnect = () => {
    localStorage.removeItem('sultan_wallet');
    localStorage.removeItem('sultan_wallet_method');
    setAddress(null);
    setIsConnected(false);
    setBalance('0');
    setConnectionMethod(null);
    if (getWalletLink().isConnected()) {
      getWalletLink().disconnect();
    }
  };

  const sendTokens = async (to: string, amount: string) => {
    if (!isConnected) throw new Error("Wallet not connected");
    return { hash: '0x' + Math.random().toString(16).slice(2) };
  };

  return { 
    address, 
    balance, 
    isConnected, 
    isExtensionAvailable, 
    isPWAAvailable,
    connectionMethod,
    walletLinkSession,
    connect, 
    connectPWA,
    connectBroadcast,
    disconnect,
    sendTokens
  };
}
