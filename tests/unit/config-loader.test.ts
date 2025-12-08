/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadConfig } from '../../src/config/loader.js';
import { cosmiconfig } from 'cosmiconfig';

vi.mock('cosmiconfig', () => ({
  cosmiconfig: vi.fn(),
}));

describe('Config Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default config when no config file found', async () => {
    const mockExplorer = {
      search: vi.fn().mockResolvedValue(null),
      load: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    const config = await loadConfig();

    expect(config).toBeDefined();
    expect(config.projectType).toBe('commercial');
    expect(config.includeDevDependencies).toBe(false);
  });

  it('should load and merge config from file', async () => {
    const mockConfig = {
      projectType: 'open-source',
      includeDevDependencies: true,
    };
    const mockExplorer = {
      search: vi.fn().mockResolvedValue({ config: mockConfig }),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    const config = await loadConfig();

    expect(config.projectType).toBe('open-source');
    expect(config.includeDevDependencies).toBe(true);
  });

  it('should load config from specific path', async () => {
    const mockConfig = {
      projectType: 'saas',
    };
    const mockExplorer = {
      search: vi.fn(),
      load: vi.fn().mockResolvedValue({ config: mockConfig }),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    const config = await loadConfig(undefined, '/path/to/config.json');

    expect(config.projectType).toBe('saas');
    expect(mockExplorer.load).toHaveBeenCalledWith('/path/to/config.json');
  });

  it('should merge partial config with defaults', async () => {
    const mockConfig = {
      age: { warn: '1y' },
    };
    const mockExplorer = {
      search: vi.fn().mockResolvedValue({ config: mockConfig }),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    const config = await loadConfig();

    expect(config.age.warn).toBe('1y');
    expect(config.age.critical).toBe('5y'); // default
    expect(config.projectType).toBe('commercial'); // default
  });

  it('should handle empty config file', async () => {
    const mockExplorer = {
      search: vi.fn().mockResolvedValue({ config: {} }),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    const config = await loadConfig();

    expect(config.projectType).toBe('commercial');
  });

  it('should handle config with all options', async () => {
    const fullConfig = {
      projectType: 'saas',
      includeDevDependencies: true,
      age: { warn: '1y', critical: '3y' },
      license: { allowCommercialWarning: true, allowUnknown: false },
      scoring: {
        boosters: {
          age: 2.0,
          deprecation: 5.0,
          license: 4.0,
          vulnerability: 3.0,
          popularity: 1.5,
          repository: 2.5,
          updateFrequency: 2.0,
        },
      },
      ignore: {
        scopes: ['@types/*'],
        prefixes: ['eslint-*'],
        authors: [],
        packages: ['moment'],
      },
      failOn: 'warning',
      github: { enabled: true, token: 'test-token' },
      upgradePath: { enabled: true },
    };
    const mockExplorer = {
      search: vi.fn().mockResolvedValue({ config: fullConfig }),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    const config = await loadConfig();

    expect(config.projectType).toBe('saas');
    expect(config.age.warn).toBe('1y');
    expect(config.scoring.boosters.age).toBe(2.0);
    expect(config.ignore.packages).toContain('moment');
  });

  it('should search from specific directory', async () => {
    const mockExplorer = {
      search: vi.fn().mockResolvedValue(null),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    await loadConfig('/custom/path');

    expect(mockExplorer.search).toHaveBeenCalledWith('/custom/path');
  });

  it('should handle errors during config loading', async () => {
    const mockExplorer = {
      search: vi.fn().mockRejectedValue(new Error('Config file is invalid')),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    await expect(loadConfig()).rejects.toThrow('Failed to load configuration: Config file is invalid');
  });

  it('should handle non-Error exceptions', async () => {
    const mockExplorer = {
      search: vi.fn().mockRejectedValue('string error'),
      load: vi.fn(),
    };
    vi.mocked(cosmiconfig).mockReturnValue(mockExplorer as any);

    await expect(loadConfig()).rejects.toThrow('string error');
  });
});
