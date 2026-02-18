/**
 * Sultan L1 API Client + Wallet Integration
 * Add this file to your project and import the functions you need
 */
const RPC_URL = 'https://rpc.sltn.io';

// ============================================================================
// Wallet Integration (Sultan Wallet Extension)
// ============================================================================

export function isWalletInstalled() {
  return typeof window !== 'undefined' && typeof window.sultan !== 'undefined';
}

/**
 * Connect to Sultan Wallet
 * @returns {Promise<any>} The connected wallet response
 */
export async function connectWallet() {
  if (!isWalletInstalled()) {
    throw new Error('Sultan Wallet extension not found. Please install it.');
  }

  try {
    return await window.sultan.connect();
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
}

/**
 * Get current wallet address if connected
 * @returns {Promise<string|null>}
 */
export async function getConnectedAddress() {
  if (!isWalletInstalled()) return null;
  try {
    const response = await window.sultan.getAddress();
    return response.address;
  } catch {
    return null;
  }
}

// ============================================================================
// Blockchain Queries (Read Actions)
// ============================================================================

/**
 * Get SULTAN balance for an address
 * @param {string} address 
 * @returns {Promise<string>}
 */
export async function getBalance(address: string) {
  try {
    const response = await fetch(`${RPC_URL}/v1/account/${address}/balance`);
    const data = await response.json();
    return data.balance || '0';
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    return '0';
  }
}

/**
 * Get available tokens
 * @returns {Promise<any[]>}
 */
export async function getTokens() {
  try {
    const response = await fetch(`${RPC_URL}/v1/tokens`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tokens:', error);
    return [];
  }
}

/**
 * Get liquidity pools
 * @returns {Promise<any[]>}
 */
export async function getPools() {
  try {
    const response = await fetch(`${RPC_URL}/v1/pools`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch pools:', error);
    return [];
  }
}

// ============================================================================
// Wallet Actions (Write Actions)
// ============================================================================

/**
 * Execute a swap
 * @param {object} params 
 */
export async function executeSwap(params: { pairId: string, tokenIn: string, amountIn: string, minAmountOut: string }) {
  if (!isWalletInstalled()) throw new Error('Wallet not found');

  try {
    const tx = {
      type: 'swap',
      ...params
    };

    return await window.sultan.signAndSend(tx);
  } catch (error) {
    console.error('Swap failed:', error);
    throw error;
  }
}

/**
 * Create a new token
 * @param {object} params 
 */
export async function createToken(params: { name: string, symbol: string, supply: string }) {
  if (!isWalletInstalled()) throw new Error('Wallet not found');

  try {
    const tx = {
      type: 'create_token',
      ...params
    };

    return await window.sultan.signAndSend(tx);
  } catch (error) {
    console.error('Token creation failed:', error);
    throw error;
  }
}
