/**
 * Sultan DeFi Hub - API Client
 * Connects to Sultan L1 Native DEX and Token Factory
 */

// Configuration - can be overridden via environment
export const config = {
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://rpc.sltn.io',
  API_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// ============================================================================
// Error Handling
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// Types
// ============================================================================

export interface Token {
  denom: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  logo?: string;
  description?: string;
}

export interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  lpToken: string;
  totalLpSupply: string;
  feeRate: number; // basis points (30 = 0.3%)
  volume24h?: string;
  tvl?: string;
}

export interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  fee: string;
  route: string[];
  minOutput: string; // with slippage
}

export interface Position {
  poolId: string;
  lpTokens: string;
  share: number; // percentage
  token0Amount: string;
  token1Amount: string;
  token0: Token;
  token1: Token;
}

export interface LaunchpadProject {
  id: string;
  token: Token;
  creator: string;
  status: 'created' | 'presale' | 'launched' | 'completed';
  createdAt: number;
  // Future smart contract fields (Coming Soon)
  presalePrice?: string;
  presaleStart?: number;
  presaleEnd?: number;
  hardCap?: string;
  softCap?: string;
  raised?: string;
  vestingSchedule?: VestingSchedule;
}

export interface VestingSchedule {
  cliff: number; // seconds
  duration: number; // seconds
  initialUnlock: number; // percentage
}

// ============================================================================
// Feature Flags - These unlock when smart contracts are ready
// ============================================================================

export const FEATURES = {
  SWAP: true,
  LIQUIDITY: true,
  CREATE_TOKEN: true,
  // Coming with smart contracts
  PRESALE: false,
  VESTING: false,
  WHITELIST: false,
  FAIR_LAUNCH: false,
  STAKING_POOLS: false,
};

// ============================================================================
// API Helpers
// ============================================================================

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  retries = config.MAX_RETRIES
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.API_TIMEOUT);

  try {
    const response = await fetch(`${config.RPC_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new ApiError(
        `API error: ${response.status}`,
        response.status,
        errorBody
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    // Retry on network errors
    if (retries > 0 && error instanceof Error && error.name !== 'AbortError') {
      await new Promise((r) => setTimeout(r, config.RETRY_DELAY));
      return fetchApi<T>(endpoint, options, retries - 1);
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      undefined,
      'NETWORK_ERROR'
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================================
// Token Factory API
// ============================================================================

// Demo tokens for development/testing
const DEMO_TOKENS: Token[] = [
  { denom: 'usltn', name: 'Sultan', symbol: 'SLTN', decimals: 9, totalSupply: '500000000000000000', description: 'Native token of Sultan L1' },
  { denom: 'uusdc', name: 'USD Coin', symbol: 'USDC', decimals: 6, totalSupply: '1000000000000000' },
  { denom: 'uweth', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, totalSupply: '100000000000000000000000' },
  { denom: 'uwbtc', name: 'Wrapped Bitcoin', symbol: 'WBTC', decimals: 8, totalSupply: '2100000000000000' },
];

export async function getTokens(): Promise<Token[]> {
  try {
    const result = await fetchApi<{ success: boolean; tokens: Token[] }>('/tokens/list');
    return result.tokens || DEMO_TOKENS;
  } catch {
    // Return demo tokens for development
    return DEMO_TOKENS;
  }
}

export async function getToken(denom: string): Promise<Token | null> {
  try {
    const result = await fetchApi<{ success: boolean; metadata: Token }>(`/tokens/${denom}/metadata`);
    return result.metadata || null;
  } catch {
    return null;
  }
}

export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  creator: string;
  logo?: string;
  description?: string;
}

export async function createToken(
  params: CreateTokenParams, 
  signature: string,
  pubkey: string
): Promise<{ denom: string; success: boolean }> {
  return fetchApi('/tokens/create', {
    method: 'POST',
    body: JSON.stringify({
      creator: params.creator,
      name: params.name,
      symbol: params.symbol,
      decimals: params.decimals,
      initial_supply: params.totalSupply,
      max_supply: params.totalSupply,
      logo_url: params.logo,
      description: params.description,
      signature,
      pubkey,
    }),
  });
}

// ============================================================================
// DEX API - Swap
// ============================================================================

export async function getPools(): Promise<Pool[]> {
  try {
    const result = await fetchApi<{ success: boolean; pools: Pool[] }>('/dex/pools');
    return result.pools || [];
  } catch {
    return [];
  }
}

export interface CreatePairParams {
  creator: string;
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
}

export async function createPair(
  params: CreatePairParams,
  signature: string,
  pubkey: string
): Promise<{ success: boolean; pair_id: string }> {
  return fetchApi('/dex/create_pair', {
    method: 'POST',
    body: JSON.stringify({
      creator: params.creator,
      token_a: params.tokenA,
      token_b: params.tokenB,
      amount_a: params.amountA,
      amount_b: params.amountB,
      signature,
      pubkey,
    }),
  });
}

export async function getPool(poolId: string): Promise<Pool | null> {
  try {
    const result = await fetchApi<{ success: boolean; pool: Pool }>(`/dex/pool/${poolId}`);
    return result.pool || null;
  } catch {
    return null;
  }
}

export async function getSwapQuote(
  pairId: string,
  inputDenom: string,
  inputAmount: string,
  slippage: number = 0.5
): Promise<SwapQuote> {
  // Get price info from the pair
  const priceResult = await fetchApi<{
    success: boolean;
    price: number;
    token_a: string;
    token_b: string;
  }>(`/dex/price/${pairId}`);

  // Calculate output based on AMM formula (simplified estimate)
  const inputNum = Number(inputAmount);
  const outputAmount = inputNum * (priceResult.price || 1);
  const fee = inputNum * 0.003; // 0.3% fee
  const minOutput = Math.floor(outputAmount * (1 - slippage / 100));

  return {
    inputAmount,
    outputAmount: outputAmount.toString(),
    priceImpact: 0.1, // Estimate, actual calculated by AMM
    fee: fee.toString(),
    route: [inputDenom, priceResult.token_b || inputDenom],
    minOutput: minOutput.toString(),
  };
}

export interface SwapParams {
  user: string;
  inputDenom: string;
  outputDenom: string;
  inputAmount: string;
  minOutput: string;
}

export async function executeSwap(
  params: SwapParams & { pairId: string }, 
  signature: string,
  pubkey: string
): Promise<{ success: boolean; amount_out: string }> {
  return fetchApi('/dex/swap', {
    method: 'POST',
    body: JSON.stringify({
      from_address: params.user,
      pair_id: params.pairId,
      token_in: params.inputDenom,
      amount_in: params.inputAmount,
      min_amount_out: params.minOutput,
      signature,
      pubkey,
    }),
  });
}

// ============================================================================
// DEX API - Liquidity
// ============================================================================

export async function getUserPositions(address: string): Promise<Position[]> {
  try {
    const result = await fetchApi<{ positions: Position[] }>(`/dex/positions/${address}`);
    return result.positions || [];
  } catch {
    return [];
  }
}

export interface AddLiquidityParams {
  user: string;
  token0: string;
  token1: string;
  amount0: string;
  amount1: string;
  slippage: number;
}

export async function addLiquidity(
  params: AddLiquidityParams & { pairId: string }, 
  signature: string,
  pubkey: string
): Promise<{ success: boolean; lp_tokens: string }> {
  return fetchApi('/dex/add_liquidity', {
    method: 'POST',
    body: JSON.stringify({
      provider: params.user,
      pair_id: params.pairId,
      amount_a: params.amount0,
      amount_b: params.amount1,
      min_lp_tokens: 0,
      signature,
      pubkey,
    }),
  });
}

export interface RemoveLiquidityParams {
  user: string;
  poolId: string;
  lpTokens: string;
  minAmount0: string;
  minAmount1: string;
}

export async function removeLiquidity(
  params: RemoveLiquidityParams, 
  signature: string,
  pubkey: string
): Promise<{ success: boolean; amount_a: string; amount_b: string }> {
  return fetchApi('/dex/remove_liquidity', {
    method: 'POST',
    body: JSON.stringify({
      provider: params.user,
      pair_id: params.poolId,
      liquidity: params.lpTokens,
      min_amount_a: params.minAmount0,
      min_amount_b: params.minAmount1,
      signature,
      pubkey,
    }),
  });
}

// ============================================================================
// Launchpad API (Token Factory + Future Smart Contracts)
// ============================================================================

export async function getLaunchpadProjects(): Promise<LaunchpadProject[]> {
  try {
    const result = await fetchApi<{ projects: LaunchpadProject[] }>('/launchpad/projects');
    return result.projects || [];
  } catch {
    return [];
  }
}

export async function getLaunchpadProject(id: string): Promise<LaunchpadProject | null> {
  try {
    return await fetchApi<LaunchpadProject>(`/launchpad/projects/${id}`);
  } catch {
    return null;
  }
}

// ============================================================================
// Sultan Wallet Integration
// ============================================================================

// Type definitions for window.sultan API
declare global {
  interface Window {
    sultan?: SultanWallet;
  }
}

export interface SultanWallet {
  connect(): Promise<{ address: string; publicKey: string }>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getAddress(): Promise<string | null>;
  getPublicKey(): Promise<string | null>;
  getBalance(): Promise<{ available: string; staked: string; rewards: string }>;
  signMessage(message: string | Uint8Array): Promise<{ signature: string; publicKey: string }>;
  signTransaction(tx: object, broadcast?: boolean): Promise<{ signature: string; publicKey: string; txHash?: string }>;
  sendTransaction(tx: object): Promise<{ txHash: string }>;
  getNetwork(): Promise<{ chainId: string; name: string; rpcUrl: string }>;
  addToken(token: { denom: string; symbol: string; name: string; decimals: number; logoUrl?: string }): Promise<void>;
  on(event: 'connect' | 'disconnect' | 'accountChange' | 'networkChange', handler: (data: unknown) => void): void;
  off(event: string, handler?: (data: unknown) => void): void;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  publicKey: string | null;
  balance: string;
}

/**
 * Check if Sultan Wallet extension is installed
 */
export function isWalletInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.sultan !== 'undefined';
}

/**
 * Wait for wallet to be ready (installed and initialized)
 */
export function waitForWallet(timeout = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isWalletInstalled()) {
      resolve(true);
      return;
    }

    const handler = () => {
      window.removeEventListener('sultan#initialized', handler);
      resolve(true);
    };

    window.addEventListener('sultan#initialized', handler);
    
    // Timeout fallback
    setTimeout(() => {
      window.removeEventListener('sultan#initialized', handler);
      resolve(isWalletInstalled());
    }, timeout);
  });
}

/**
 * Connect to Sultan Wallet - opens popup for user approval
 */
export async function connectWallet(): Promise<WalletState> {
  if (!isWalletInstalled()) {
    throw new ApiError('Sultan Wallet not installed. Please install from Chrome Web Store.', undefined, 'WALLET_NOT_INSTALLED');
  }

  try {
    const { address, publicKey } = await window.sultan!.connect();
    const balanceResult = await window.sultan!.getBalance();
    
    return {
      connected: true,
      address,
      publicKey,
      balance: balanceResult.available,
    };
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'User rejected wallet connection',
      undefined,
      'WALLET_CONNECTION_REJECTED'
    );
  }
}

/**
 * Disconnect from wallet
 */
export async function disconnectWallet(): Promise<void> {
  if (window.sultan) {
    await window.sultan.disconnect();
  }
}

/**
 * Get current wallet state
 */
export async function getWalletState(): Promise<WalletState> {
  if (!isWalletInstalled() || !window.sultan!.isConnected()) {
    return { connected: false, address: null, publicKey: null, balance: '0' };
  }

  const [address, publicKey, balance] = await Promise.all([
    window.sultan!.getAddress(),
    window.sultan!.getPublicKey(),
    window.sultan!.getBalance(),
  ]);

  return {
    connected: true,
    address,
    publicKey,
    balance: balance.available,
  };
}

/**
 * Sign a message with the wallet - returns signature and pubkey for API calls
 */
export async function signWithWallet(message: string): Promise<{ signature: string; pubkey: string }> {
  if (!isWalletInstalled() || !window.sultan!.isConnected()) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  try {
    const { signature, publicKey } = await window.sultan!.signMessage(message);
    return { signature, pubkey: publicKey };
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'User rejected signature request',
      undefined,
      'SIGNATURE_REJECTED'
    );
  }
}

/**
 * Sign and broadcast a transaction through the wallet
 */
export async function sendWalletTransaction(tx: object): Promise<{ txHash: string }> {
  if (!isWalletInstalled() || !window.sultan!.isConnected()) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  return window.sultan!.sendTransaction(tx);
}

/**
 * Subscribe to wallet events
 */
export function onWalletEvent(
  event: 'connect' | 'disconnect' | 'accountChange' | 'networkChange',
  handler: (data: unknown) => void
): () => void {
  if (!window.sultan) return () => {};
  
  window.sultan.on(event, handler);
  return () => window.sultan?.off(event, handler);
}

// ============================================================================
// Signed Transaction Helpers
// ============================================================================

/**
 * Create a token with wallet signing
 */
export async function createTokenSigned(params: Omit<CreateTokenParams, 'creator'>): Promise<{ denom: string; success: boolean }> {
  const wallet = await getWalletState();
  if (!wallet.connected || !wallet.address) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  // Create message to sign (deterministic JSON)
  const message = JSON.stringify({
    type: 'create_token',
    name: params.name,
    symbol: params.symbol,
    decimals: params.decimals,
    total_supply: params.totalSupply,
  });

  const { signature, pubkey } = await signWithWallet(message);
  
  return createToken({ ...params, creator: wallet.address }, signature, pubkey);
}

/**
 * Execute swap with wallet signing
 */
export async function executeSwapSigned(params: Omit<SwapParams, 'user'> & { pairId: string }): Promise<{ success: boolean; amount_out: string }> {
  const wallet = await getWalletState();
  if (!wallet.connected || !wallet.address) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  const message = JSON.stringify({
    type: 'swap',
    pair_id: params.pairId,
    token_in: params.inputDenom,
    amount_in: params.inputAmount,
  });

  const { signature, pubkey } = await signWithWallet(message);
  
  return executeSwap({ ...params, user: wallet.address }, signature, pubkey);
}

/**
 * Add liquidity with wallet signing
 */
export async function addLiquiditySigned(params: Omit<AddLiquidityParams, 'user'> & { pairId: string }): Promise<{ success: boolean; lp_tokens: string }> {
  const wallet = await getWalletState();
  if (!wallet.connected || !wallet.address) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  const message = JSON.stringify({
    type: 'add_liquidity',
    pair_id: params.pairId,
    amount_a: params.amount0,
    amount_b: params.amount1,
  });

  const { signature, pubkey } = await signWithWallet(message);
  
  return addLiquidity({ ...params, user: wallet.address }, signature, pubkey);
}

/**
 * Remove liquidity with wallet signing
 */
export async function removeLiquiditySigned(params: Omit<RemoveLiquidityParams, 'user'>): Promise<{ success: boolean; amount_a: string; amount_b: string }> {
  const wallet = await getWalletState();
  if (!wallet.connected || !wallet.address) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  const message = JSON.stringify({
    type: 'remove_liquidity',
    pair_id: params.poolId,
    lp_amount: params.lpTokens,
  });

  const { signature, pubkey } = await signWithWallet(message);
  
  return removeLiquidity({ ...params, user: wallet.address }, signature, pubkey);
}

/**
 * Create DEX pair with wallet signing
 */
export async function createPairSigned(params: Omit<CreatePairParams, 'creator'>): Promise<{ success: boolean; pair_id: string }> {
  const wallet = await getWalletState();
  if (!wallet.connected || !wallet.address) {
    throw new ApiError('Wallet not connected', undefined, 'WALLET_NOT_CONNECTED');
  }

  const message = JSON.stringify({
    type: 'create_pair',
    token_a: params.tokenA,
    token_b: params.tokenB,
    amount_a: params.amountA,
    amount_b: params.amountB,
  });

  const { signature, pubkey } = await signWithWallet(message);
  
  return createPair({ ...params, creator: wallet.address }, signature, pubkey);
}

// ============================================================================
// Utility Functions
// ============================================================================

export function formatAmount(amount: string, decimals: number = 9): string {
  const value = Number(amount) / Math.pow(10, decimals);
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toFixed(value < 1 ? 6 : 2);
}

export function parseAmount(amount: string, decimals: number = 9): string {
  const value = parseFloat(amount);
  if (isNaN(value)) return '0';
  return Math.floor(value * Math.pow(10, decimals)).toString();
}
