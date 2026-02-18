/**
 * WalletConnectModal - Connect via WalletLink when Chrome extension not available
 * 
 * Shows a QR code and "Open Wallet" button for connecting via wallet.sltn.io
 */

import { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import {
  createWalletLinkSession,
  waitForWalletConnection,
  onWalletLinkEvent,
  getWalletLink,
} from '../api/walletLink';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (address: string, publicKey: string | null) => void;
}

type ConnectionStatus = 'idle' | 'generating' | 'waiting' | 'connected' | 'error';

export default function WalletConnectModal({ isOpen, onClose, onConnected }: WalletConnectModalProps) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrSvg, setQrSvg] = useState<string | null>(null);

  // Generate session when modal opens
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setDeepLinkUrl(null);
      setError(null);
      setQrSvg(null);
      return;
    }

    let cancelled = false;

    const setup = async () => {
      setStatus('generating');
      setError(null);

      try {
        const { deepLinkUrl } = await createWalletLinkSession();
        if (cancelled) return;

        setDeepLinkUrl(deepLinkUrl);
        setQrSvg(generateQrSvg(deepLinkUrl));
        setStatus('waiting');

        // Wait for connection
        const address = await waitForWalletConnection();
        if (cancelled) return;

        setStatus('connected');
        const publicKey = getWalletLink().getPublicKey();
        
        // Notify parent and close
        setTimeout(() => {
          onConnected(address, publicKey);
          onClose();
        }, 500);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Connection failed');
        setStatus('error');
      }
    };

    setup();

    // Subscribe to events
    const unsub = onWalletLinkEvent((event) => {
      if (event.type === 'connected' && !cancelled) {
        setStatus('connected');
      } else if (event.type === 'error' && !cancelled) {
        setError(event.data instanceof Error ? event.data.message : String(event.data));
        setStatus('error');
      }
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [isOpen, onClose, onConnected]);

  // Handle "Open Wallet" button click
  const handleOpenWallet = useCallback(() => {
    if (deepLinkUrl) {
      window.open(deepLinkUrl, '_blank');
    }
  }, [deepLinkUrl]);

  // Retry connection
  const handleRetry = useCallback(async () => {
    setStatus('generating');
    setError(null);

    try {
      const { deepLinkUrl } = await createWalletLinkSession();
      setDeepLinkUrl(deepLinkUrl);
      setQrSvg(generateQrSvg(deepLinkUrl));
      setStatus('waiting');

      const address = await waitForWalletConnection();
      setStatus('connected');
      const publicKey = getWalletLink().getPublicKey();
      
      setTimeout(() => {
        onConnected(address, publicKey);
        onClose();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setStatus('error');
    }
  }, [onClose, onConnected]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Wallet" maxWidth="sm">
      <div className="flex flex-col items-center gap-6">
        {/* Status-based content */}
        {status === 'generating' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-8 h-8 border-2 border-sultan-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-white/70">Generating secure connection...</p>
          </div>
        )}

        {status === 'waiting' && (
          <>
            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl">
              {qrSvg ? (
                <div 
                  className="w-48 h-48"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="w-48 h-48 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white/50">Loading QR...</span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">
                Scan with Sultan Wallet app or
              </p>
              <button
                onClick={handleOpenWallet}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                <span>🔗</span>
                Open Wallet
              </button>
            </div>

            {/* Waiting indicator */}
            <div className="flex items-center gap-2 text-sm text-white/50">
              <div className="w-2 h-2 bg-sultan-gold rounded-full animate-pulse" />
              Waiting for connection...
            </div>
          </>
        )}

        {status === 'connected' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-white font-medium">Connected!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">✕</span>
            </div>
            <p className="text-red-400 text-center">{error || 'Connection failed'}</p>
            <button
              onClick={handleRetry}
              className="btn-gold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-xs text-white/40 mt-4">
          <p>Don&apos;t have Sultan Wallet?</p>
          <a 
            href="https://wallet.sltn.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sultan-gold hover:underline"
          >
            Get it at wallet.sltn.io
          </a>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Generate a simple QR code SVG
 * Uses a basic implementation - for production, consider using a proper QR library
 */
function generateQrSvg(data: string): string {
  // For now, show a placeholder with the link
  // In production, use a QR code library like qrcode or qr.js
  
  // Simple QR-like visual placeholder
  const size = 192;
  const cellSize = 8;
  const cells = Math.floor(size / cellSize);
  
  // Generate a pseudo-random pattern based on the data hash
  const hash = simpleHash(data);
  const bits: boolean[][] = [];
  
  for (let y = 0; y < cells; y++) {
    bits[y] = [];
    for (let x = 0; x < cells; x++) {
      // QR codes have specific patterns - this is a simplified version
      // Position patterns (corners)
      if (isPositionPattern(x, y, cells)) {
        bits[y][x] = true;
      } else if (x < 7 && y < 7) {
        bits[y][x] = isInnerPositionPattern(x, y);
      } else if (x >= cells - 7 && y < 7) {
        bits[y][x] = isInnerPositionPattern(cells - 1 - x, y);
      } else if (x < 7 && y >= cells - 7) {
        bits[y][x] = isInnerPositionPattern(x, cells - 1 - y);
      } else {
        // Data area - use hash
        const idx = (y * cells + x) % 32;
        bits[y][x] = ((hash >> idx) & 1) === 1 || ((hash >> ((idx + 16) % 32)) & 1) === 1;
      }
    }
  }

  // Generate SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;
  
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (bits[y][x]) {
        svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

function isPositionPattern(x: number, y: number, cells: number): boolean {
  // Top-left corner
  if (x < 7 && y < 7) return true;
  // Top-right corner
  if (x >= cells - 7 && y < 7) return true;
  // Bottom-left corner  
  if (x < 7 && y >= cells - 7) return true;
  return false;
}

function isInnerPositionPattern(x: number, y: number): boolean {
  // Outer border
  if (x === 0 || x === 6 || y === 0 || y === 6) return true;
  // Inner square
  if (x >= 2 && x <= 4 && y >= 2 && y <= 4) return true;
  return false;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
