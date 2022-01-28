import { Buffer } from 'buffer/';

/**
 * Lattice wallets 
 * 
 * - External: Smart card
 * - Internal: On device
 */
export interface Wallet {
  /** 32 byte id */
  uid: Buffer;
  /** 20 char (max) string */
  name: Buffer; // 
  /** 4 byte flag */
  capabilities: number;
  /** External or internal wallet */
  external: boolean;
}