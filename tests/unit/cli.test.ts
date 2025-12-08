/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { program } from '../../src/cli.js';
import { loadConfig } from '../../src/config/loader.js';
import { scanDependencies } from '../../src/commands/scan.js';
import { checkPackage } from '../../src/commands/check.js';
import { initConfig } from '../../src/commands/init.js';

// Mock all dependencies
vi.mock('../../src/config/loader.js', () => ({
  loadConfig: vi.fn(),
}));

vi.mock('../../src/commands/scan.js', () => ({
  scanDependencies: vi.fn(),
}));

vi.mock('../../src/commands/check.js', () => ({
  checkPackage: vi.fn(),
  formatCheckOutput: vi.fn(),
}));

vi.mock('../../src/commands/init.js', () => ({
  initConfig: vi.fn(),
}));

vi.mock('../../src/reporters/cli.js', () => ({
  formatCliOutput: vi.fn().mockReturnValue('CLI output'),
}));

vi.mock('../../src/reporters/csv.js', () => ({
  formatCsvOutput: vi.fn().mockReturnValue('CSV output'),
}));

describe('CLI', () => {
  const originalExit = process.exit;
  const originalLog = console.log;
  const originalError = console.error;

  let exitCode: number | undefined;
  let consoleOutput: string[] = [];
  let consoleErrors: string[] = [];

  beforeEach(() => {
    exitCode = undefined;
    consoleOutput = [];
    consoleErrors = [];

    // Mock process.exit - don't throw, just capture the exit code
    process.exit = vi.fn((code?: number) => {
      exitCode = code;
      // Return undefined instead of throwing to prevent catch blocks from triggering
      return undefined as never;
    }) as never;

    // Mock console
    console.log = vi.fn((...args) => {
      consoleOutput.push(args.join(' '));
    });
    console.error = vi.fn((...args) => {
      consoleErrors.push(args.join(' '));
    });

    vi.clearAllMocks();

    // Default mock config
    vi.mocked(loadConfig).mockResolvedValue({
      projectType: 'commercial',
      includeDevDependencies: false,
      age: {
        warn: '2y',
        critical: '5y',
        checkDeprecated: true,
        checkRepository: true,
      },
      license: {
        allow: [],
        deny: [],
        warn: [],
        warnOnUnknown: true,
        checkPatentClauses: true,
      },
      scoring: {
        enabled: true,
        minimumScore: 60,
        boosters: {
          age: 1.5,
          deprecation: 4.0,
          license: 3.0,
          vulnerability: 2.0,
          popularity: 1.0,
          repository: 2.0,
          updateFrequency: 1.5,
        },
      },
      ignore: {
        scopes: [],
        prefixes: [],
        authors: [],
        packages: [],
      },
      failOn: 'critical',
      github: {
        enabled: false,
      },
      upgradePath: {
        enabled: false,
        analyzeBreakingChanges: false,
        suggestAlternatives: false,
        fetchChangelogs: false,
        estimateEffort: false,
      },
      output: 'cli',
    });
  });

  afterEach(() => {
    process.exit = originalExit;
    console.log = originalLog;
    console.error = originalError;
  });

  describe('scan command', () => {
    it('should run scan with default options', async () => {
      const mockResult = {
        summary: {
          total: 10,
          passed: 8,
          warnings: 1,
          critical: 1,
        },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);

      await program.parseAsync(['node', 'cli', 'scan']);

      expect(scanDependencies).toHaveBeenCalled();
      expect(exitCode).toBe(0);
    });

    it('should handle --include-dev flag', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--include-dev']);


      expect(loadConfig).toHaveBeenCalled();
      expect(scanDependencies).toHaveBeenCalled();
    });

    it('should handle --project-type option', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--project-type', 'saas']);


      expect(scanDependencies).toHaveBeenCalled();
    });

    it('should handle --json flag', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--json']);


      expect(consoleOutput.some(out => out.includes('"summary"'))).toBe(true);
      expect(exitCode).toBe(0);
    });

    it('should handle --csv flag', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--csv']);


      expect(consoleOutput).toContain('CSV output');
      expect(exitCode).toBe(0);
    });

    it('should handle --fail-on option', async () => {
      const mockResult = {
        summary: { total: 10, passed: 8, warnings: 2, critical: 0 },
        packages: [],
        exitCode: 1,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--fail-on', 'warning']);


      expect(exitCode).toBe(1);
    });

    it('should handle --age-warn and --age-critical options', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync([
          'node',
          'cli',
          'scan',
          '--age-warn',
          '1y',
          '--age-critical',
          '3y',
        ]);


      expect(scanDependencies).toHaveBeenCalled();
    });

    it('should handle --config option', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--config', '/path/to/config.json']);


      expect(loadConfig).toHaveBeenCalledWith(undefined, '/path/to/config.json');
    });

    it('should handle --ignore-scope option', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync([
          'node',
          'cli',
          'scan',
          '--ignore-scope',
          '@types/*',
          '@babel/*',
        ]);


      expect(scanDependencies).toHaveBeenCalled();
    });

    it('should handle --ignore-prefix option', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--ignore-prefix', 'eslint-', 'babel-']);


      expect(scanDependencies).toHaveBeenCalled();
    });

    it('should handle --ignore option', async () => {
      const mockResult = {
        summary: { total: 10, passed: 10, warnings: 0, critical: 0 },
        packages: [],
        exitCode: 0,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan', '--ignore', 'moment', 'request']);


      expect(scanDependencies).toHaveBeenCalled();
    });

    it('should handle scan errors', async () => {
      vi.mocked(scanDependencies).mockRejectedValue(new Error('Scan failed'));


        await program.parseAsync(['node', 'cli', 'scan']);


      expect(consoleErrors.some(err => err.includes('Scan failed'))).toBe(true);
      expect(exitCode).toBe(3);
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(scanDependencies).mockRejectedValue('String error');


        await program.parseAsync(['node', 'cli', 'scan']);


      expect(consoleErrors.some(err => err.includes('String error'))).toBe(true);
      expect(exitCode).toBe(3);
    });

    it('should exit with critical code when critical issues found', async () => {
      const mockResult = {
        summary: { total: 10, passed: 5, warnings: 2, critical: 3 },
        packages: [],
        exitCode: 2,
      };

      vi.mocked(scanDependencies).mockResolvedValue(mockResult);


        await program.parseAsync(['node', 'cli', 'scan']);


      expect(exitCode).toBe(2);
    });
  });

  describe('check command', () => {
    it('should check a specific package', async () => {
      const mockAnalysis = {
        package: 'test-pkg',
        version: '1.0.0',
        overallSeverity: 'ok' as const,
        age: {
          package: 'test-pkg',
          version: '1.0.0',
          ageDays: 30,
          ageHuman: '1 month',
          lastPublish: new Date().toISOString(),
          deprecated: false,
          severity: 'ok' as const,
          hasRepository: true,
        },
        license: {
          package: 'test-pkg',
          version: '1.0.0',
          license: 'MIT',
          spdxId: 'MIT',
          category: 'commercial-friendly' as const,
          blueOakRating: 'gold' as const,
          commercialUse: true,
          isDualLicense: false,
          hasPatentClause: false,
          severity: 'ok' as const,
        },
        score: {
          overall: 95,
          rating: 'excellent' as const,
          dimensions: {
            age: 1,
            deprecation: 1,
            license: 1,
            vulnerability: 1,
            popularity: 0.9,
            repository: 0.9,
            updateFrequency: 0.9,
          },
        },
      };

      vi.mocked(checkPackage).mockResolvedValue(mockAnalysis);


        await program.parseAsync(['node', 'cli', 'check', 'test-pkg']);


      expect(checkPackage).toHaveBeenCalledWith('test-pkg', expect.any(Object));
      expect(exitCode).toBe(0);
    });

    it('should handle --json flag in check command', async () => {
      const mockAnalysis = {
        package: 'test-pkg',
        version: '1.0.0',
        overallSeverity: 'ok' as const,
        age: {
          package: 'test-pkg',
          version: '1.0.0',
          ageDays: 30,
          ageHuman: '1 month',
          lastPublish: new Date().toISOString(),
          deprecated: false,
          severity: 'ok' as const,
          hasRepository: true,
        },
        license: {
          package: 'test-pkg',
          version: '1.0.0',
          license: 'MIT',
          spdxId: 'MIT',
          category: 'commercial-friendly' as const,
          blueOakRating: 'gold' as const,
          commercialUse: true,
          isDualLicense: false,
          hasPatentClause: false,
          severity: 'ok' as const,
        },
        score: {
          overall: 95,
          rating: 'excellent' as const,
          dimensions: {
            age: 1,
            deprecation: 1,
            license: 1,
            vulnerability: 1,
            popularity: 0.9,
            repository: 0.9,
            updateFrequency: 0.9,
          },
        },
      };

      vi.mocked(checkPackage).mockResolvedValue(mockAnalysis);


        await program.parseAsync(['node', 'cli', 'check', 'test-pkg', '--json']);


      expect(consoleOutput.some(out => out.includes('"package"'))).toBe(true);
      expect(exitCode).toBe(0);
    });

    it('should handle --project-type in check command', async () => {
      const mockAnalysis = {
        package: 'test-pkg',
        version: '1.0.0',
        overallSeverity: 'ok' as const,
        age: {
          package: 'test-pkg',
          version: '1.0.0',
          ageDays: 30,
          ageHuman: '1 month',
          lastPublish: new Date().toISOString(),
          deprecated: false,
          severity: 'ok' as const,
          hasRepository: true,
        },
        license: {
          package: 'test-pkg',
          version: '1.0.0',
          license: 'MIT',
          spdxId: 'MIT',
          category: 'commercial-friendly' as const,
          blueOakRating: 'gold' as const,
          commercialUse: true,
          isDualLicense: false,
          hasPatentClause: false,
          severity: 'ok' as const,
        },
        score: {
          overall: 95,
          rating: 'excellent' as const,
          dimensions: {
            age: 1,
            deprecation: 1,
            license: 1,
            vulnerability: 1,
            popularity: 0.9,
            repository: 0.9,
            updateFrequency: 0.9,
          },
        },
      };

      vi.mocked(checkPackage).mockResolvedValue(mockAnalysis);


        await program.parseAsync([
          'node',
          'cli',
          'check',
          'test-pkg',
          '--project-type',
          'open-source',
        ]);


      expect(checkPackage).toHaveBeenCalled();
    });

    it('should exit with code 2 on critical severity', async () => {
      const mockAnalysis = {
        package: 'bad-pkg',
        version: '1.0.0',
        overallSeverity: 'critical' as const,
        age: {
          package: 'bad-pkg',
          version: '1.0.0',
          ageDays: 2000,
          ageHuman: '5 years',
          lastPublish: new Date(Date.now() - 2000 * 24 * 60 * 60 * 1000).toISOString(),
          deprecated: true,
          severity: 'critical' as const,
          hasRepository: false,
        },
        license: {
          package: 'bad-pkg',
          version: '1.0.0',
          license: 'GPL-3.0',
          spdxId: 'GPL-3.0',
          category: 'commercial-incompatible' as const,
          blueOakRating: 'bronze' as const,
          commercialUse: false,
          isDualLicense: false,
          hasPatentClause: false,
          severity: 'critical' as const,
        },
        score: {
          overall: 20,
          rating: 'poor' as const,
          dimensions: {
            age: 0,
            deprecation: 0,
            license: 0,
            vulnerability: 0,
            popularity: 0,
            repository: 0,
            updateFrequency: 0,
          },
        },
      };

      vi.mocked(checkPackage).mockResolvedValue(mockAnalysis);


        await program.parseAsync(['node', 'cli', 'check', 'bad-pkg']);


      expect(exitCode).toBe(2);
    });

    it('should handle check command errors', async () => {
      vi.mocked(checkPackage).mockRejectedValue(new Error('Package not found'));


        await program.parseAsync(['node', 'cli', 'check', 'nonexistent-pkg']);


      expect(consoleErrors.some(err => err.includes('Package not found'))).toBe(true);
      expect(exitCode).toBe(3);
    });

    it('should handle --config in check command', async () => {
      const mockAnalysis = {
        package: 'test-pkg',
        version: '1.0.0',
        overallSeverity: 'ok' as const,
        age: {
          package: 'test-pkg',
          version: '1.0.0',
          ageDays: 30,
          ageHuman: '1 month',
          lastPublish: new Date().toISOString(),
          deprecated: false,
          severity: 'ok' as const,
          hasRepository: true,
        },
        license: {
          package: 'test-pkg',
          version: '1.0.0',
          license: 'MIT',
          spdxId: 'MIT',
          category: 'commercial-friendly' as const,
          blueOakRating: 'gold' as const,
          commercialUse: true,
          isDualLicense: false,
          hasPatentClause: false,
          severity: 'ok' as const,
        },
        score: {
          overall: 95,
          rating: 'excellent' as const,
          dimensions: {
            age: 1,
            deprecation: 1,
            license: 1,
            vulnerability: 1,
            popularity: 0.9,
            repository: 0.9,
            updateFrequency: 0.9,
          },
        },
      };

      vi.mocked(checkPackage).mockResolvedValue(mockAnalysis);


        await program.parseAsync([
          'node',
          'cli',
          'check',
          'test-pkg',
          '--config',
          '/path/to/config.json',
        ]);


      expect(loadConfig).toHaveBeenCalledWith(undefined, '/path/to/config.json');
    });
  });

  describe('init command', () => {
    it('should initialize config file', async () => {
      vi.mocked(initConfig).mockResolvedValue(undefined);


        await program.parseAsync(['node', 'cli', 'init']);


      expect(initConfig).toHaveBeenCalled();
    });

    it('should handle init errors', async () => {
      vi.mocked(initConfig).mockRejectedValue(new Error('Permission denied'));


        await program.parseAsync(['node', 'cli', 'init']);


      expect(consoleErrors.some(err => err.includes('Permission denied'))).toBe(true);
      expect(exitCode).toBe(3);
    });

    it('should handle non-Error init failures', async () => {
      vi.mocked(initConfig).mockRejectedValue('Init failed');


        await program.parseAsync(['node', 'cli', 'init']);


      expect(consoleErrors.some(err => err.includes('Init failed'))).toBe(true);
      expect(exitCode).toBe(3);
    });
  });

  describe('program metadata', () => {
    it('should have correct name', () => {
      expect(program.name()).toBe('package-health-analyzer');
    });

    it('should have version', () => {
      expect(program.version()).toBeDefined();
    });

    it('should have description', () => {
      expect(program.description()).toContain('dependency health analyzer');
    });
  });
});
