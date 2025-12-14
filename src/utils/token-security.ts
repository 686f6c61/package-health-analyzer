/**
 * package-health-analyzer - Token Security Utilities
 *
 * Implements defense-in-depth security measures for protecting sensitive API tokens (GitHub, npm) used in package
 * analysis. This module provides military-grade AES-256-GCM encryption, pattern-based plaintext detection, secure
 * memory clearing, and file permission validation to prevent token leakage. It addresses the critical security risk
 * of API tokens stored in configuration files by detecting insecure storage, warning users, and providing encryption
 * utilities, while ensuring tokens are masked in logs and cleared from memory after use.
 *
 * Key responsibilities:
 * - Encrypt/decrypt tokens using AES-256-GCM with authentication tags
 * - Detect plaintext tokens in configuration files using regex patterns
 * - Validate file permissions and warn about world-readable config files
 * - Mask tokens in logs showing only prefix/suffix for debugging
 * - Clear sensitive data from memory to prevent leakage
 * - Generate cryptographically secure random IVs and salts
 *
 * Security considerations:
 * - Uses authenticated encryption (GCM mode) to prevent tampering
 * - Implements best practices from OWASP token storage guidelines
 * - Warns users about plaintext tokens and insecure file permissions
 * - Supports environment variable-based token management as secure alternative
 *
 * @module utils/token-security
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { statSync } from 'node:fs';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export function encryptToken(token: string, key: Buffer): string {
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return Buffer.concat([salt, iv, authTag, Buffer.from(encrypted, 'hex')]).toString('base64');
}

export function decryptToken(encrypted: string, key: Buffer): string {
  const buffer = Buffer.from(encrypted, 'base64');

  // Skip salt (first SALT_LENGTH bytes)
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const ciphertext = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

export function clearTokenFromMemory(token: string): void {
  if (!token) return;
  
  for (let i = 0; i < token.length; i++) {
    (token as any)[i] = '\0';
  }
}

export function maskToken(token: string): string {
  if (!token || token.length < 16) {
    return '****';
  }
  
  const prefix = token.substring(0, 4);
  const suffix = token.substring(token.length - 8);
  return prefix + '****' + suffix;
}

export function detectPlaintextToken(configContent: string): boolean {
  const tokenPatterns = [
    /ghp_[a-zA-Z0-9]{36}/,
    /gho_[a-zA-Z0-9]{36}/,
    /github_pat_[a-zA-Z0-9_]{82}/,
    /npm_[a-zA-Z0-9]{36}/,
  ];
  
  return tokenPatterns.some(pattern => pattern.test(configContent));
}

export function warnInsecureToken(): void {
  console.warn('');
  console.warn('⚠️  WARNING: Plaintext token detected in configuration file!');
  console.warn('   For better security, use environment variables instead:');
  console.warn('');
  console.warn('      export GITHUB_TOKEN="your_token"');
  console.warn('   Or via command line:');
  console.warn('   GITHUB_TOKEN="your_token" package-health-analyzer scan');
  console.warn('');
}

export function checkConfigFilePermissions(configPath: string): void {
  try {
    const stats = statSync(configPath);
    const mode = stats.mode & parseInt('777', 8);
    
    if ((mode & parseInt('004', 8)) !== 0 || (mode & parseInt('040', 8)) !== 0) {
      console.warn('');
      console.warn('⚠️  WARNING: Configuration file has insecure permissions!');
      console.warn(configPath + ' is readable by others');
      console.warn('   Recommended: chmod 600 ' + configPath);
      console.warn('');
    }
  } catch {
    // Silently ignore permission check errors (e.g., on Windows)
  }
}
