/**
 * Sultan WalletLink Client for HODL Holdings
 * Connects to wallet.sltn.io via relay server
 */
const RELAY_URL = 'wss://sultan-walletlink-relay.fly.dev';
const WALLET_URL = 'https://wallet.sltn.io';

// Generate random bytes
function randomBytes(length: number) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}

// Base64 encode (URL-safe)
function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export class WalletLink {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private sessionKey: string;
  private listeners: { [key: string]: Function[] } = {};

  constructor() {
    this.sessionId = toBase64Url(randomBytes(16));
    this.sessionKey = toBase64Url(randomBytes(32));
  }

  async createSession() {
    const qrData = `${this.sessionId}:${this.sessionKey}`;
    const deepLink = `${WALLET_URL}/link?data=${qrData}`;

    this.ws = new WebSocket(`${RELAY_URL}/session/${this.sessionId}`);
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connect') {
          this.emit('connect', data.wallet);
        } else if (data.type === 'disconnect') {
          this.emit('disconnect');
        }
      } catch (e) {
        console.error('WalletLink message error:', e);
      }
    };

    return { qrData, deepLink };
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return this;
  }

  private emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(...args));
    }
  }

  disconnect() {
    if (this.ws) this.ws.close();
    this.emit('disconnect');
  }
}
