/**
 * Sultan WalletLink - dApp Client
 * 
 * Enables HODL Holdings to connect to Sultan Wallet PWA (wallet.sltn.io)
 * via QR code or deep link when Chrome extension is not available.
 * 
 * Flow:
 * 1. dApp creates session with generateSession()
 * 2. User clicks "Open Wallet" → redirects to wallet.sltn.io/connect?session=...
 * 3. Wallet connects via WebSocket relay
 * 4. dApp receives wallet address
 * 5. dApp can request signatures via signMessage()
 */

// Relay server URL
const RELAY_URL = 'wss://sultan-walletlink-relay.fly.dev';
const WALLET_URL = 'https://wallet.sltn.io';

// Session storage key
const SESSION_KEY = 'sultan_walletlink_dapp_session';

// Message types
enum MessageType {
  SESSION_INIT = 'session_init',
  SESSION_ACK = 'session_ack',
  SESSION_END = 'session_end',
  HEARTBEAT = 'heartbeat',
  CONNECT_REQUEST = 'connect_request',
  CONNECT_RESPONSE = 'connect_response',
  SIGN_MESSAGE_REQUEST = 'sign_message_request',
  SIGN_MESSAGE_RESPONSE = 'sign_message_response',
  ERROR = 'error',
}

interface Session {
  sessionId: string;
  sessionKey: Uint8Array;
  encryptionKey: CryptoKey | null;
  isConnected: boolean;
  walletAddress: string | null;
  walletPublicKey: string | null;
  createdAt: number;
}

interface RelayMessage {
  type: MessageType;
  sessionId: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

type WalletLinkEventType = 'connected' | 'disconnected' | 'error' | 'response';
type WalletLinkEventHandler = (event: { type: WalletLinkEventType; data?: unknown }) => void;

// Singleton instance
let instance: WalletLinkClient | null = null;

/**
 * WalletLink Client for dApps
 */
class WalletLinkClient {
  private ws: WebSocket | null = null;
  private session: Session | null = null;
  private eventHandlers: Set<WalletLinkEventHandler> = new Set();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private pendingRequests: Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }> = new Map();
  private connectionPromise: Promise<string> | null = null;
  private connectionResolve: ((address: string) => void) | null = null;
  private connectionReject: ((error: Error) => void) | null = null;

  /**
   * Generate a new session and return the wallet deep link URL
   */
  async generateSession(): Promise<{ deepLinkUrl: string; sessionId: string }> {
    // Generate random session ID and key
    const sessionId = this.generateRandomId();
    const sessionKey = crypto.getRandomValues(new Uint8Array(32));

    this.session = {
      sessionId,
      sessionKey,
      encryptionKey: null,
      isConnected: false,
      walletAddress: null,
      walletPublicKey: null,
      createdAt: Date.now(),
    };

    // Derive encryption key
    this.session.encryptionKey = await this.deriveKey(sessionKey);

    // Connect to relay
    await this.connect();

    // Generate deep link URL
    const keyBase64 = this.arrayToBase64(sessionKey);
    const sessionData = `sultan://wl?s=${sessionId}&k=${encodeURIComponent(keyBase64)}&b=${encodeURIComponent(RELAY_URL)}&n=${encodeURIComponent('HODL Holdings')}&o=${encodeURIComponent(window.location.origin)}`;
    const deepLinkUrl = `${WALLET_URL}/connect?session=${encodeURIComponent(sessionData)}`;

    // Save session
    this.saveSession();

    return { deepLinkUrl, sessionId };
  }

  /**
   * Wait for wallet to connect
   */
  waitForConnection(timeoutMs = 120000): Promise<string> {
    if (this.session?.isConnected && this.session.walletAddress) {
      return Promise.resolve(this.session.walletAddress);
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.connectionResolve = resolve;
      this.connectionReject = reject;

      // Set timeout
      setTimeout(() => {
        if (!this.session?.isConnected) {
          reject(new Error('Connection timeout'));
          this.connectionPromise = null;
        }
      }, timeoutMs);
    });

    return this.connectionPromise;
  }

  /**
   * Request message signature from wallet
   */
  async signMessage(message: string): Promise<{ signature: string; publicKey: string }> {
    if (!this.session?.isConnected) {
      throw new Error('Wallet not connected');
    }

    const requestId = this.generateRandomId();
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { 
        resolve: (data) => resolve(data as { signature: string; publicKey: string }), 
        reject 
      });

      this.sendMessage({
        type: MessageType.SIGN_MESSAGE_REQUEST,
        sessionId: this.session!.sessionId,
        payload: {
          requestId,
          message,
          origin: window.location.origin,
        },
        timestamp: Date.now(),
      }).catch(reject);

      // Timeout after 2 minutes
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Signing request timeout'));
        }
      }, 120000);
    });
  }

  /**
   * Get current wallet address
   */
  getAddress(): string | null {
    return this.session?.walletAddress ?? null;
  }

  /**
   * Get current wallet public key
   */
  getPublicKey(): string | null {
    return this.session?.walletPublicKey ?? null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.session?.isConnected ?? false;
  }

  /**
   * Disconnect from wallet
   */
  async disconnect(): Promise<void> {
    if (this.ws && this.session) {
      try {
        await this.sendMessage({
          type: MessageType.SESSION_END,
          sessionId: this.session.sessionId,
          payload: {},
          timestamp: Date.now(),
        });
      } catch {
        // Ignore errors during disconnect
      }
    }

    this.cleanup();
    this.clearSession();
    this.emit({ type: 'disconnected' });
  }

  /**
   * Add event handler
   */
  on(handler: WalletLinkEventHandler): void {
    this.eventHandlers.add(handler);
  }

  /**
   * Remove event handler
   */
  off(handler: WalletLinkEventHandler): void {
    this.eventHandlers.delete(handler);
  }

  /**
   * Try to restore existing session
   */
  async restoreSession(): Promise<boolean> {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (!saved) return false;

      const data = JSON.parse(saved);
      if (!data.sessionId || !data.sessionKey) return false;

      // Check if session is expired (10 minute timeout)
      if (Date.now() - data.createdAt > 10 * 60 * 1000) {
        this.clearSession();
        return false;
      }

      const sessionKey = this.base64ToArray(data.sessionKey);
      this.session = {
        sessionId: data.sessionId,
        sessionKey,
        encryptionKey: await this.deriveKey(sessionKey),
        isConnected: data.isConnected ?? false,
        walletAddress: data.walletAddress,
        walletPublicKey: data.walletPublicKey,
        createdAt: data.createdAt,
      };

      if (this.session.isConnected && this.session.walletAddress) {
        return true;
      }

      // Try to reconnect
      await this.connect();
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private async connect(): Promise<void> {
    if (!this.session) {
      throw new Error('No session configured');
    }

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(RELAY_URL);

      this.ws.onopen = async () => {
        console.log('[WalletLink] Connected to relay');
        await this.sendInitSession();
        this.startHeartbeat();
        resolve();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data).catch(console.error);
      };

      this.ws.onerror = (error) => {
        console.error('[WalletLink] WebSocket error:', error);
        reject(new Error('WebSocket connection failed'));
      };

      this.ws.onclose = () => {
        console.log('[WalletLink] WebSocket closed');
        this.cleanup();
      };
    });
  }

  private async sendInitSession(): Promise<void> {
    if (!this.session) return;

    await this.sendMessage({
      type: MessageType.SESSION_INIT,
      sessionId: this.session.sessionId,
      payload: { 
        role: 'dapp',
        dappName: 'HODL Holdings',
        origin: window.location.origin,
      },
      timestamp: Date.now(),
    });
  }

  private async handleMessage(data: string): Promise<void> {
    try {
      const decrypted = await this.decrypt(data);
      const message: RelayMessage = JSON.parse(decrypted);

      switch (message.type) {
        case MessageType.SESSION_ACK:
          console.log('[WalletLink] Session acknowledged');
          break;

        case MessageType.CONNECT_RESPONSE:
          this.handleConnectResponse(message.payload);
          break;

        case MessageType.SIGN_MESSAGE_RESPONSE:
          this.handleSignResponse(message.payload);
          break;

        case MessageType.SESSION_END:
          this.disconnect();
          break;

        case MessageType.ERROR:
          console.error('[WalletLink] Error:', message.payload);
          this.emit({ type: 'error', data: message.payload });
          break;
      }
    } catch (error) {
      // Message might not be encrypted (e.g., plain ACK from relay)
      try {
        const message = JSON.parse(data);
        if (message.type === 'session_ack' || message.type === 'ack') {
          console.log('[WalletLink] Session acknowledged (plain)');
        }
      } catch {
        console.error('[WalletLink] Failed to handle message:', error);
      }
    }
  }

  private handleConnectResponse(payload: Record<string, unknown>): void {
    if (payload.approved && payload.address) {
      this.session!.isConnected = true;
      this.session!.walletAddress = payload.address as string;
      this.session!.walletPublicKey = (payload.publicKey as string) || null;
      this.saveSession();

      this.emit({ type: 'connected', data: { address: payload.address } });

      if (this.connectionResolve) {
        this.connectionResolve(payload.address as string);
        this.connectionPromise = null;
        this.connectionResolve = null;
        this.connectionReject = null;
      }
    } else {
      const error = new Error((payload.error as string) || 'Connection rejected');
      this.emit({ type: 'error', data: error });

      if (this.connectionReject) {
        this.connectionReject(error);
        this.connectionPromise = null;
        this.connectionResolve = null;
        this.connectionReject = null;
      }
    }
  }

  private handleSignResponse(payload: Record<string, unknown>): void {
    const requestId = payload.requestId as string;
    const pending = this.pendingRequests.get(requestId);
    
    if (!pending) return;
    this.pendingRequests.delete(requestId);

    if (payload.approved && payload.signature) {
      pending.resolve({
        signature: payload.signature as string,
        publicKey: payload.publicKey as string,
      });
    } else {
      pending.reject(new Error((payload.error as string) || 'Signing rejected'));
    }
  }

  private async sendMessage(message: RelayMessage): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to relay');
    }

    const encrypted = await this.encrypt(JSON.stringify(message));
    this.ws.send(encrypted);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      if (this.ws?.readyState === WebSocket.OPEN && this.session) {
        try {
          await this.sendMessage({
            type: MessageType.HEARTBEAT,
            sessionId: this.session.sessionId,
            payload: {},
            timestamp: Date.now(),
          });
        } catch {
          // Ignore heartbeat errors
        }
      }
    }, 30000);
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private saveSession(): void {
    if (!this.session) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        sessionId: this.session.sessionId,
        sessionKey: this.arrayToBase64(this.session.sessionKey),
        isConnected: this.session.isConnected,
        walletAddress: this.session.walletAddress,
        walletPublicKey: this.session.walletPublicKey,
        createdAt: this.session.createdAt,
      }));
    } catch {
      // Ignore storage errors
    }
  }

  private clearSession(): void {
    this.session = null;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore errors
    }
  }

  private emit(event: { type: WalletLinkEventType; data?: unknown }): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('[WalletLink] Event handler error:', error);
      }
    });
  }

  // ============================================================================
  // Crypto Helpers
  // ============================================================================

  private async deriveKey(sessionKey: Uint8Array): Promise<CryptoKey> {
    // Create a copy to ensure we have a proper ArrayBuffer
    const keyBuffer = new Uint8Array(sessionKey).buffer as ArrayBuffer;
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      'HKDF',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new TextEncoder().encode('sultan-walletlink'),
        info: new TextEncoder().encode('walletlink-v1'),
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.session?.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(data);
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      this.session.encryptionKey,
      plaintext
    );

    const combined = new Uint8Array(12 + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), 12);

    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(data: string): Promise<string> {
    if (!this.session?.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const combined = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      this.session.encryptionKey,
      ciphertext
    );

    return new TextDecoder().decode(plaintext);
  }

  private generateRandomId(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private arrayToBase64(arr: Uint8Array): string {
    return btoa(String.fromCharCode(...arr));
  }

  private base64ToArray(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }
}

// ============================================================================
// Exported Functions
// ============================================================================

/**
 * Get the WalletLink client singleton
 */
export function getWalletLink(): WalletLinkClient {
  if (!instance) {
    instance = new WalletLinkClient();
  }
  return instance;
}

/**
 * Create a new WalletLink session and get the deep link URL
 */
export async function createWalletLinkSession(): Promise<{ deepLinkUrl: string; sessionId: string }> {
  return getWalletLink().generateSession();
}

/**
 * Wait for wallet to connect
 */
export async function waitForWalletConnection(timeoutMs?: number): Promise<string> {
  return getWalletLink().waitForConnection(timeoutMs);
}

/**
 * Sign a message via WalletLink
 */
export async function signMessageViaWalletLink(message: string): Promise<{ signature: string; publicKey: string }> {
  return getWalletLink().signMessage(message);
}

/**
 * Get wallet address via WalletLink
 */
export function getWalletLinkAddress(): string | null {
  return getWalletLink().getAddress();
}

/**
 * Get wallet public key via WalletLink
 */
export function getWalletLinkPublicKey(): string | null {
  return getWalletLink().getPublicKey();
}

/**
 * Check if WalletLink is connected
 */
export function isWalletLinkConnected(): boolean {
  return getWalletLink().isConnected();
}

/**
 * Disconnect WalletLink
 */
export async function disconnectWalletLink(): Promise<void> {
  return getWalletLink().disconnect();
}

/**
 * Try to restore existing WalletLink session
 */
export async function restoreWalletLinkSession(): Promise<boolean> {
  return getWalletLink().restoreSession();
}

/**
 * Add event listener
 */
export function onWalletLinkEvent(handler: WalletLinkEventHandler): () => void {
  const client = getWalletLink();
  client.on(handler);
  return () => client.off(handler);
}
