import { useState, useEffect, useCallback } from 'react';
import * as ed from '@noble/ed25519';
import * as sultanApi from './sultanApi';
import { getWalletLink } from './walletLink';

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [walletLinkSession, setWalletLinkSession] = useState<{ deepLink: string, wlData: string } | null>(null);

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
        console.error("Failed to fetch balance:", err);
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

    initWallet();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [initWallet]);

  const connectExtension = async () => {
    if (sultanApi.isWalletInstalled()) {
      const walletState = await sultanApi.connectWallet();
      setAddress(walletState.address);
      setIsConnected(true);
      setBalance(walletState.balance);
      if (walletState.address) {
        localStorage.setItem('sultan_wallet', walletState.address);
      }
      return walletState.address || "";
    }
    throw new Error("Extension not found");
  };

  const connectPWA = async () => {
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
          
          sultanApi.getWalletState()
            .then(state => setBalance(state.balance))
            .catch(() => setBalance('0'));
          
          localStorage.setItem('sultan_wallet', walletData.address);
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
        const privKey = new TextEncoder().encode(manualPrivKey.padEnd(32, '0').slice(0, 32));
        const pubKey = await ed.getPublicKeyAsync(privKey);
        const mockAddress = `sultan${toHex(pubKey).slice(0, 32)}`;
        setAddress(mockAddress);
        setIsConnected(true);
        setBalance('1000.00');
        localStorage.setItem('sultan_wallet', mockAddress);
        return mockAddress;
      }
      return await connectExtension();
    } catch (err) {
      console.error("Connection failed", err);
      throw err;
    }
  };

  const disconnect = () => {
    localStorage.removeItem('sultan_wallet');
    setAddress(null);
    setIsConnected(false);
    setBalance('0');
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
    walletLinkSession,
    connect, 
    connectPWA,
    disconnect,
    sendTokens
  };
}
