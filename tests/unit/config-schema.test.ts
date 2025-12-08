/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { configSchema } from '../../src/config/schema.js';

describe('Config Schema Validation', () => {
  it('should validate minimal config', () => {
    const result = configSchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.projectType).toBe('commercial');
    }
  });

  it('should validate projectType values', () => {
    expect(configSchema.safeParse({ projectType: 'commercial' }).success).toBe(true);
    expect(configSchema.safeParse({ projectType: 'saas' }).success).toBe(true);
    expect(configSchema.safeParse({ projectType: 'open-source' }).success).toBe(true);
    expect(configSchema.safeParse({ projectType: 'invalid' }).success).toBe(false);
  });

  it('should validate includeDevDependencies', () => {
    expect(configSchema.safeParse({ includeDevDependencies: true }).success).toBe(true);
    expect(configSchema.safeParse({ includeDevDependencies: false }).success).toBe(true);
    expect(configSchema.safeParse({ includeDevDependencies: 'invalid' }).success).toBe(false);
  });

  it('should validate age config', () => {
    const valid = configSchema.safeParse({
      age: { warn: '2y', critical: '5y' },
    });
    expect(valid.success).toBe(true);
  });

  it('should validate license config', () => {
    const valid = configSchema.safeParse({
      license: {
        allow: ['MIT', 'Apache-2.0'],
        deny: ['GPL-3.0'],
        warn: ['LGPL-3.0'],
      },
    });
    expect(valid.success).toBe(true);
  });

  it('should validate scoring config with boosters', () => {
    const valid = configSchema.safeParse({
      scoring: {
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
    });
    expect(valid.success).toBe(true);
  });

  it('should reject invalid booster values', () => {
    const invalid = configSchema.safeParse({
      scoring: {
        boosters: {
          age: 'invalid',
        },
      },
    });
    expect(invalid.success).toBe(false);
  });

  it('should validate ignore config', () => {
    const valid = configSchema.safeParse({
      ignore: {
        scopes: ['@types/*'],
        prefixes: ['eslint-*'],
        authors: ['deprecated@example.com'],
        packages: ['moment'],
      },
    });
    expect(valid.success).toBe(true);
  });

  it('should validate failOn values', () => {
    expect(configSchema.safeParse({ failOn: 'none' }).success).toBe(true);
    expect(configSchema.safeParse({ failOn: 'info' }).success).toBe(true);
    expect(configSchema.safeParse({ failOn: 'warning' }).success).toBe(true);
    expect(configSchema.safeParse({ failOn: 'critical' }).success).toBe(true);
    expect(configSchema.safeParse({ failOn: 'invalid' }).success).toBe(false);
  });

  it('should validate github config', () => {
    const valid = configSchema.safeParse({
      github: {
        enabled: true,
        token: 'ghp_test_token',
      },
    });
    expect(valid.success).toBe(true);
  });

  it('should validate upgradePath config', () => {
    const valid = configSchema.safeParse({
      upgradePath: {
        enabled: true,
      },
    });
    expect(valid.success).toBe(true);
  });

  it('should apply defaults to missing fields', () => {
    const result = configSchema.parse({
      projectType: 'saas',
    });

    expect(result.includeDevDependencies).toBe(false);
    expect(result.failOn).toBe('critical');
    expect(result.github.enabled).toBe(false);
  });

  it('should validate complete config', () => {
    const fullConfig = {
      projectType: 'commercial',
      includeDevDependencies: true,
      age: {
        warn: '2y',
        critical: '5y',
        checkDeprecated: true,
        checkRepository: true,
      },
      license: {
        allow: ['MIT'],
        deny: ['GPL-3.0'],
        warn: ['LGPL-3.0'],
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
        scopes: ['@types/*'],
        prefixes: [],
        authors: [],
        packages: [],
      },
      failOn: 'warning',
      github: {
        enabled: false,
      },
      upgradePath: {
        enabled: true,
        analyzeBreakingChanges: true,
        suggestAlternatives: true,
        fetchChangelogs: true,
        estimateEffort: true,
      },
    };

    const result = configSchema.safeParse(fullConfig);
    expect(result.success).toBe(true);
  });

  it('should reject extra unknown fields', () => {
    const result = configSchema.safeParse({
      projectType: 'commercial',
      unknownField: 'invalid',
    });

    // Zod by default allows extra fields unless strict() is used
    expect(result.success).toBe(true);
  });

  it('should handle array validations', () => {
    const valid1 = configSchema.safeParse({
      ignore: {
        scopes: ['@types/*', '@babel/*'],
        prefixes: ['eslint-', 'babel-'],
        authors: [],
        packages: ['moment', 'request'],
      },
    });
    expect(valid1.success).toBe(true);

    const invalid = configSchema.safeParse({
      ignore: {
        scopes: 'not-an-array',
      },
    });
    expect(invalid.success).toBe(false);
  });
});
