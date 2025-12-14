import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  encryptToken,
  decryptToken,
  clearTokenFromMemory,
  maskToken,
  detectPlaintextToken,
  warnInsecureToken,
  checkConfigFilePermissions,
} from '../../src/utils/token-security.js';
import { statSync } from 'node:fs';

vi.mock('node:fs', () => ({
  statSync: vi.fn(),
}));

describe('Token Security', () => {
  describe('encryptToken and decryptToken', () => {
    it('should encrypt and decrypt a token correctly', () => {
      const token = 'ghp_test1234567890abcdefghijklmnopqrstuvwxyz';
      const key = Buffer.alloc(32, 'a');

      const encrypted = encryptToken(token, key);
      expect(encrypted).not.toBe(token);
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = decryptToken(encrypted, key);
      expect(decrypted).toBe(token);
    });

    it('should produce different ciphertext for same token (random IV)', () => {
      const token = 'ghp_test1234567890';
      const key = Buffer.alloc(32, 'a');

      const encrypted1 = encryptToken(token, key);
      const encrypted2 = encryptToken(token, key);

      expect(encrypted1).not.toBe(encrypted2);

      const decrypted1 = decryptToken(encrypted1, key);
      const decrypted2 = decryptToken(encrypted2, key);

      expect(decrypted1).toBe(token);
      expect(decrypted2).toBe(token);
    });

    it('should fail to decrypt with wrong key', () => {
      const token = 'ghp_test1234567890';
      const key1 = Buffer.alloc(32, 'a');
      const key2 = Buffer.alloc(32, 'b');

      const encrypted = encryptToken(token, key1);

      expect(() => decryptToken(encrypted, key2)).toThrow();
    });

    it('should fail to decrypt corrupted data', () => {
      const key = Buffer.alloc(32, 'a');
      const corruptedData = 'invalidbase64data!!!';

      expect(() => decryptToken(corruptedData, key)).toThrow();
    });

    it('should handle empty token', () => {
      const token = '';
      const key = Buffer.alloc(32, 'a');

      const encrypted = encryptToken(token, key);
      const decrypted = decryptToken(encrypted, key);

      expect(decrypted).toBe('');
    });

    it('should handle long tokens', () => {
      const token = 'a'.repeat(1000);
      const key = Buffer.alloc(32, 'a');

      const encrypted = encryptToken(token, key);
      const decrypted = decryptToken(encrypted, key);

      expect(decrypted).toBe(token);
    });
  });

  describe('clearTokenFromMemory', () => {
    it('should not crash with null token', () => {
      expect(() => clearTokenFromMemory(null as any)).not.toThrow();
    });

    it('should not crash with undefined token', () => {
      expect(() => clearTokenFromMemory(undefined as any)).not.toThrow();
    });

    it('should not crash with empty token', () => {
      expect(() => clearTokenFromMemory('')).not.toThrow();
    });
  });

  describe('maskToken', () => {
    it('should mask GitHub personal access token', () => {
      const token = 'ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD';
      const masked = maskToken(token);

      expect(masked).toBe('ghp_****wxyzABCD');
      expect(masked).toContain('****');
      expect(masked.length).toBeLessThan(token.length);
    });

    it('should mask short tokens', () => {
      const token = 'short';
      const masked = maskToken(token);

      expect(masked).toBe('****');
    });

    it('should handle empty token', () => {
      const masked = maskToken('');
      expect(masked).toBe('****');
    });

    it('should preserve prefix and suffix', () => {
      const token = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz';
      const masked = maskToken(token);

      expect(masked.startsWith('ghp_')).toBe(true);
      expect(masked.endsWith(token.slice(-8))).toBe(true);
    });

    it('should mask npm tokens', () => {
      const token = 'npm_1234567890abcdefghijklmnopqrstuvwxyz';
      const masked = maskToken(token);

      expect(masked).toContain('****');
      expect(masked.length).toBeLessThan(token.length);
    });
  });

  describe('detectPlaintextToken', () => {
    it('should detect GitHub personal access token (ghp_)', () => {
      const config = '{"token": "ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD"}';
      expect(detectPlaintextToken(config)).toBe(true);
    });

    it('should detect GitHub OAuth token (gho_)', () => {
      const config = '{"token": "gho_1234567890abcdefghijklmnopqrstuvwxyz"}';
      expect(detectPlaintextToken(config)).toBe(true);
    });

    it('should detect GitHub fine-grained token (github_pat_)', () => {
      const config = '{"token": "github_pat_' + 'a'.repeat(82) + '"}';
      expect(detectPlaintextToken(config)).toBe(true);
    });

    it('should detect npm token', () => {
      const config = '{"token": "npm_1234567890abcdefghijklmnopqrstuvwxyz"}';
      expect(detectPlaintextToken(config)).toBe(true);
    });

    it('should not detect non-token strings', () => {
      const config = '{"token": "not-a-real-token"}';
      expect(detectPlaintextToken(config)).toBe(false);
    });

    it('should not detect masked tokens', () => {
      const config = '{"token": "ghp_****...***1ylM"}';
      expect(detectPlaintextToken(config)).toBe(false);
    });

    it('should handle empty config', () => {
      expect(detectPlaintextToken('')).toBe(false);
    });

    it('should detect multiple tokens', () => {
      const config = 'ghp_' + 'a'.repeat(36) + ' and npm_' + 'b'.repeat(36);
      expect(detectPlaintextToken(config)).toBe(true);
    });
  });

  describe('warnInsecureToken', () => {
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should output warning message', () => {
      warnInsecureToken();

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls.some((call: any) =>
        call[0]?.includes('WARNING')
      )).toBe(true);
    });

    it('should mention environment variables', () => {
      warnInsecureToken();

      const allCalls = consoleWarnSpy.mock.calls.flat().join(' ');
      expect(allCalls).toContain('GITHUB_TOKEN');
    });

    it('should provide command line example', () => {
      warnInsecureToken();

      const allCalls = consoleWarnSpy.mock.calls.flat().join(' ');
      expect(allCalls).toContain('package-health-analyzer');
    });
  });

  describe('checkConfigFilePermissions', () => {
    let consoleWarnSpy: any;
    const mockStatSync = statSync as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.clearAllMocks();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should warn on world-readable file (mode 644)', () => {
      mockStatSync.mockReturnValue({
        mode: parseInt('100644', 8),
      } as any);

      checkConfigFilePermissions('/test/config.json');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls.some((call: any) =>
        call[0]?.includes('WARNING')
      )).toBe(true);
    });

    it('should warn on group-readable file (mode 640)', () => {
      mockStatSync.mockReturnValue({
        mode: parseInt('100640', 8),
      } as any);

      checkConfigFilePermissions('/test/config.json');

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should not warn on secure file (mode 600)', () => {
      mockStatSync.mockReturnValue({
        mode: parseInt('100600', 8),
      } as any);

      checkConfigFilePermissions('/test/config.json');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not warn on stricter permissions (mode 400)', () => {
      mockStatSync.mockReturnValue({
        mode: parseInt('100400', 8),
      } as any);

      checkConfigFilePermissions('/test/config.json');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should recommend chmod 600', () => {
      mockStatSync.mockReturnValue({
        mode: parseInt('100644', 8),
      } as any);

      checkConfigFilePermissions('/test/config.json');

      const allCalls = consoleWarnSpy.mock.calls.flat().join(' ');
      expect(allCalls).toContain('chmod 600');
    });

    it('should handle stat errors gracefully', () => {
      mockStatSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => checkConfigFilePermissions('/test/config.json')).not.toThrow();
    });
  });
});
