/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { Config } from '../../types/config.js';
import type { InitAnswers } from './prompts.js';
import { defaultConfig } from '../../config/defaults.js';

/**
 * Construye el objeto de configuración a partir de las respuestas
 */
export function buildConfigFromAnswers(answers: InitAnswers): Config {
  const config: Config = { ...defaultConfig };

  // Project type
  if (answers.projectType) {
    config.projectType = answers.projectType;
  }

  // Dev dependencies
  if (answers.includeDevDependencies !== undefined) {
    config.includeDevDependencies = answers.includeDevDependencies;
  }

  // Age thresholds
  if (answers.ageWarn) {
    config.age.warn = answers.ageWarn;
  }
  if (answers.ageCritical) {
    config.age.critical = answers.ageCritical;
  }

  // Licenses deny
  if (answers.licenseDeny) {
    const denyList = answers.licenseDeny.filter(
      (v) => v !== 'none' && v !== 'custom'
    );
    if (denyList.length > 0) {
      config.license.deny = denyList;
    }
  }

  // Licenses warn
  if (answers.licenseWarn) {
    const warnList = answers.licenseWarn.filter(
      (v) => v !== 'none' && v !== 'custom'
    );
    if (warnList.length > 0) {
      config.license.warn = warnList;
    }
  }

  // Scoring
  if (answers.minimumScore !== undefined && answers.minimumScore >= 0) {
    config.scoring.minimumScore = answers.minimumScore;
  }

  // Fail on
  if (answers.failOn) {
    config.failOn = answers.failOn;
  }

  // Output format
  if (answers.output) {
    config.output = answers.output;
  }

  // Security/GitHub integration
  if (answers.enableSecurity !== undefined) {
    config.github.enabled = answers.enableSecurity;
  }

  // Ignore scopes
  if (answers.ignoreScopesChoice && answers.ignoreScopesChoice !== 'none') {
    if (answers.ignoreScopesChoice === 'custom' && answers.ignoreScopes) {
      config.ignore.scopes = answers.ignoreScopes;
    } else {
      config.ignore.scopes = [answers.ignoreScopesChoice];
    }
  }

  // Ignore prefixes
  if (
    answers.ignorePrefixesChoice &&
    answers.ignorePrefixesChoice !== 'none'
  ) {
    if (
      answers.ignorePrefixesChoice === 'custom' &&
      answers.ignorePrefixes
    ) {
      config.ignore.prefixes = answers.ignorePrefixes;
    } else {
      config.ignore.prefixes = [answers.ignorePrefixesChoice];
    }
  }

  return config;
}

/**
 * Formatea el config para escritura (incluye schema URL)
 */
export function formatConfigForFile(config: Config): object {
  return {
    $schema: 'https://package-health-analyzer.dev/schema.json',
    projectType: config.projectType,
    age: config.age,
    license: {
      allow: config.license.allow,
      deny: config.license.deny,
      warn: config.license.warn,
      warnOnUnknown: config.license.warnOnUnknown,
      checkPatentClauses: config.license.checkPatentClauses,
    },
    scoring: {
      enabled: config.scoring.enabled,
      minimumScore: config.scoring.minimumScore,
      boosters: config.scoring.boosters,
    },
    ignore: {
      scopes: config.ignore.scopes,
      prefixes: config.ignore.prefixes,
      authors: config.ignore.authors,
      packages: config.ignore.packages,
    },
    includeDevDependencies: config.includeDevDependencies,
    failOn: config.failOn,
    output: config.output,
    cache: config.cache,
    github: config.github,
    monitor: config.monitor,
    upgradePath: config.upgradePath,
  };
}
