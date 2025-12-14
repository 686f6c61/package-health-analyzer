/**
 * package-health-analyzer - Project Type-Specific Default Configurations
 *
 * Provides tailored configuration presets optimized for different project types (commercial, SaaS, library, government, etc.),
 * each with appropriate license restrictions, scoring thresholds, and failure policies. This module recognizes that license
 * requirements vary dramatically based on use case: a commercial SaaS product needs strict AGPL/GPL exclusion, while an
 * open source personal project can be permissive. It eliminates complex manual configuration by providing expert-curated
 * presets that encode best practices and legal requirements for each project category.
 *
 * Key responsibilities:
 * - Provide 10 predefined project type configurations with specialized defaults
 * - Configure license deny/warn lists appropriate for each use case (commercial vs open-source)
 * - Set minimum score thresholds aligned with project risk tolerance (70 for libraries, 50 for startups)
 * - Define failure policies (none/warning/critical) based on project criticality
 * - Encode legal requirements (government projects deny GPL*, SaaS denies AGPL*)
 * - Balance strictness with practicality for different organizational contexts
 * - Support custom project types that inherit base configuration
 *
 * @module config/project-type-defaults
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { Config } from '../types/config.js';

export function getProjectTypeDefaults(projectType: string, baseConfig: Config): Partial<Config> {
  switch (projectType) {
    case 'commercial':
      return {
        license: {
          ...baseConfig.license,
          deny: ['GPL-*', 'AGPL-*', 'SSPL-*'],
          warn: ['LGPL-*', 'MPL-*', 'EPL-*'],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 60,
        },
        failOn: 'critical',
      };

    case 'saas':
      return {
        license: {
          ...baseConfig.license,
          deny: ['AGPL-*', 'SSPL-*'],
          warn: ['GPL-*', 'LGPL-*', 'MPL-*'],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 65,
        },
        failOn: 'warning',
      };

    case 'library':
      return {
        license: {
          ...baseConfig.license,
          deny: ['GPL-*', 'AGPL-*', 'LGPL-*'],
          warn: ['MPL-*', 'EPL-*'],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 70,
        },
        failOn: 'warning',
      };

    case 'startup':
      return {
        license: {
          ...baseConfig.license,
          deny: ['AGPL-*', 'SSPL-*'],
          warn: ['GPL-*', 'LGPL-*'],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 50,
        },
        failOn: 'critical',
      };

    case 'government':
      return {
        license: {
          ...baseConfig.license,
          deny: ['GPL-*', 'AGPL-*', 'SSPL-*'],
          warn: ['LGPL-*', 'MPL-*'],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 70,
        },
        failOn: 'warning',
      };

    case 'internal':
      return {
        license: {
          ...baseConfig.license,
          deny: [],
          warn: ['AGPL-*'],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 50,
        },
        failOn: 'critical',
      };

    case 'open-source':
    case 'personal':
    case 'educational':
      return {
        license: {
          ...baseConfig.license,
          deny: [],
          warn: [],
        },
        scoring: {
          ...baseConfig.scoring,
          minimumScore: 0,
        },
        failOn: 'none',
      };

    default:
      return {};
  }
}
