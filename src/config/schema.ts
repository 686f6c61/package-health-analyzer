/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { z } from 'zod';

const ageConfigSchema = z.object({
  warn: z.string().default('2y'),
  critical: z.string().default('5y'),
  checkDeprecated: z.boolean().default(true),
  checkRepository: z.boolean().default(true),
});

const licenseConfigSchema = z.object({
  allow: z.array(z.string()).default([
    'MIT',
    'ISC',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'Apache-2.0',
    'Unlicense',
    'CC0-1.0',
    '0BSD',
    'Zlib',
    'BSL-1.0',
  ]),
  deny: z.array(z.string()).default([]),
  warn: z.array(z.string()).default([
    'LGPL-2.1',
    'LGPL-3.0',
    'MPL-2.0',
    'EPL-1.0',
    'EPL-2.0',
  ]),
  warnOnUnknown: z.boolean().default(true),
  checkPatentClauses: z.boolean().default(true),
});

const scoringConfigSchema = z.object({
  enabled: z.boolean().default(true),
  minimumScore: z.number().min(0).max(100).default(0),
  boosters: z
    .object({
      age: z.number().default(1.5),
      deprecation: z.number().default(4.0),
      license: z.number().default(3.0),
      vulnerability: z.number().default(2.0),
      popularity: z.number().default(1.0),
      repository: z.number().default(2.0),
      updateFrequency: z.number().default(1.5),
    })
    .default({}),
});

const ignoreConfigSchema = z.object({
  scopes: z.array(z.string()).default([]),
  prefixes: z.array(z.string()).default([]),
  authors: z.array(z.string()).default([]),
  packages: z.array(z.string()).default([]),
  reasons: z.record(z.string()).optional(),
});

const cacheConfigSchema = z.object({
  enabled: z.boolean().default(true),
  ttl: z.number().default(3600),
});

const githubConfigSchema = z.object({
  enabled: z.boolean().default(false),
  token: z.string().optional(),
});

const notificationConfigSchema = z.object({
  slack: z
    .object({
      webhook: z.string(),
    })
    .optional(),
  email: z
    .object({
      smtp: z.string(),
      to: z.string(),
    })
    .optional(),
});

const monitorConfigSchema = z.object({
  enabled: z.boolean().default(false),
  notifications: notificationConfigSchema.optional(),
});

const upgradePathConfigSchema = z.object({
  enabled: z.boolean().default(true),
  analyzeBreakingChanges: z.boolean().default(true),
  suggestAlternatives: z.boolean().default(true),
  fetchChangelogs: z.boolean().default(false),
  estimateEffort: z.boolean().default(true),
});

export const configSchema = z.object({
  projectType: z
    .enum([
      'commercial',
      'saas',
      'open-source',
      'personal',
      'internal',
      'library',
      'startup',
      'government',
      'educational',
      'custom',
    ])
    .default('commercial'),
  age: ageConfigSchema.default({}),
  license: licenseConfigSchema.default({}),
  scoring: scoringConfigSchema.default({}),
  ignore: ignoreConfigSchema.default({}),
  includeDevDependencies: z.boolean().default(false),
  failOn: z.enum(['none', 'info', 'warning', 'critical']).default('critical'),
  output: z.enum(['cli', 'json', 'csv', 'txt', 'md']).default('cli'),
  cache: cacheConfigSchema.default({}),
  github: githubConfigSchema.default({}),
  monitor: monitorConfigSchema.default({}),
  upgradePath: upgradePathConfigSchema.default({}),
});

export type ConfigSchema = z.infer<typeof configSchema>;
