/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import prompts from 'prompts';
import chalk from 'chalk';

export interface InitAnswers {
  mode: 'default' | 'guided';
  projectType?: 'commercial' | 'saas' | 'open-source';
  includeDevDependencies?: boolean;
  ageWarn?: string;
  ageCritical?: string;
  licenseDeny?: string[];
  licenseWarn?: string[];
  minimumScore?: number;
  failOn?: 'none' | 'info' | 'warning' | 'critical';
  output?: 'cli' | 'json' | 'csv' | 'txt' | 'md';
  enableSecurity?: boolean;
  ignoreScopesChoice?: string;
  ignoreScopes?: string[];
  ignorePrefixesChoice?: string;
  ignorePrefixes?: string[];
}

/**
 * Pregunta inicial: modo de configuración
 */
export async function askInitMode(): Promise<'default' | 'guided'> {
  const response = await prompts({
    type: 'select',
    name: 'mode',
    message: '¿Cómo quieres configurar package-health-analyzer?',
    choices: [
      {
        title: chalk.cyan('Valores por defecto'),
        value: 'default',
        description: 'Configuración rápida con valores recomendados',
      },
      {
        title: chalk.yellow('Configuración guiada'),
        value: 'guided',
        description: 'Personaliza la configuración paso a paso',
      },
    ],
    initial: 0,
  });

  if (!response.mode) {
    throw new Error('Configuración cancelada por el usuario');
  }

  return response.mode;
}

/**
 * Preguntas del modo guiado
 */
export async function askGuidedQuestions(): Promise<InitAnswers> {
  const questions: prompts.PromptObject[] = [
    {
      type: 'select',
      name: 'projectType',
      message: '¿Qué tipo de proyecto es?',
      choices: [
        {
          title: 'Commercial - Proyecto propietario/cerrado',
          value: 'commercial',
        },
        { title: 'SaaS - Software as a Service', value: 'saas' },
        { title: 'Open Source - Código abierto', value: 'open-source' },
        { title: 'Personal - Proyectos personales/hobby', value: 'personal' },
        { title: 'Internal - Herramientas internas de empresa', value: 'internal' },
        { title: 'Library - Biblioteca/paquete npm', value: 'library' },
        { title: 'Startup - Proyecto startup en crecimiento', value: 'startup' },
        { title: 'Government - Sector público/gubernamental', value: 'government' },
        { title: 'Educational - Proyectos educativos/académicos', value: 'educational' },
        { title: 'Custom - Configuración personalizada', value: 'custom' },
      ],
      initial: 0,
    },
    {
      type: 'confirm',
      name: 'includeDevDependencies',
      message: '¿Incluir devDependencies en el análisis?',
      initial: false,
    },
    {
      type: 'select',
      name: 'ageWarn',
      message: 'Umbral de edad para WARNING:',
      choices: [
        { title: '1 año', value: '1y' },
        { title: '2 años (recomendado)', value: '2y' },
        { title: '3 años', value: '3y' },
        { title: 'Custom', value: 'custom' },
      ],
      initial: 1,
    },
    {
      type: (prev) => (prev === 'custom' ? 'text' : null),
      name: 'ageWarn',
      message: 'Especifica el umbral (ej: 18m, 2y, 500d):',
      validate: (value) =>
        /^\d+[ymd]$/.test(value) ||
        'Formato inválido. Usa: Número + y/m/d (ej: 2y, 18m)',
    },
    {
      type: 'select',
      name: 'ageCritical',
      message: 'Umbral de edad para CRITICAL:',
      choices: [
        { title: '3 años', value: '3y' },
        { title: '5 años (recomendado)', value: '5y' },
        { title: '7 años', value: '7y' },
        { title: 'Custom', value: 'custom' },
      ],
      initial: 1,
    },
    {
      type: (prev) => (prev === 'custom' ? 'text' : null),
      name: 'ageCritical',
      message: 'Especifica el umbral (ej: 3y, 60m):',
      validate: (value) =>
        /^\d+[ymd]$/.test(value) || 'Formato inválido. Usa: Número + y/m/d',
    },
    {
      type: 'multiselect',
      name: 'licenseDeny',
      message: 'Licencias DENEGADAS (marcar con espacio):',
      choices: [
        {
          title: 'GPL-* (copyleft fuerte)',
          value: 'GPL-*',
          selected: false,
        },
        {
          title: 'AGPL-* (network copyleft)',
          value: 'AGPL-*',
          selected: false,
        },
        {
          title: 'SSPL-* (Server Side PL)',
          value: 'SSPL-*',
          selected: false,
        },
        { title: 'Ninguna', value: 'none' },
      ],
      instructions: chalk.dim('Espacio para seleccionar, Enter para continuar'),
      min: 0,
    },
    {
      type: 'multiselect',
      name: 'licenseWarn',
      message: 'Licencias con WARNING (marcar con espacio):',
      choices: [
        { title: 'LGPL-* (weak copyleft)', value: 'LGPL-*', selected: true },
        { title: 'MPL-2.0 (Mozilla)', value: 'MPL-2.0', selected: true },
        { title: 'EPL-* (Eclipse)', value: 'EPL-*', selected: true },
        { title: 'Ninguna', value: 'none' },
      ],
      instructions: chalk.dim('Espacio para seleccionar, Enter para continuar'),
      min: 0,
    },
    {
      type: 'select',
      name: 'minimumScore',
      message: 'Score mínimo de salud (0-100):',
      choices: [
        { title: '0 - Sin mínimo (recomendado)', value: 0 },
        { title: '50 - Bajo', value: 50 },
        { title: '60 - Medio', value: 60 },
        { title: '70 - Alto', value: 70 },
        { title: 'Custom', value: -1 },
      ],
      initial: 0,
    },
    {
      type: (prev) => (prev === -1 ? 'number' : null),
      name: 'minimumScore',
      message: 'Especifica el score mínimo (0-100):',
      min: 0,
      max: 100,
      validate: (value) =>
        (value >= 0 && value <= 100) || 'Debe estar entre 0 y 100',
    },
    {
      type: 'select',
      name: 'failOn',
      message: 'Nivel de severidad para fallar (exit code != 0):',
      choices: [
        { title: 'none - Nunca fallar', value: 'none' },
        { title: 'info - En cualquier issue', value: 'info' },
        { title: 'warning - En warnings y critical', value: 'warning' },
        { title: 'critical - Solo en critical (recomendado)', value: 'critical' },
      ],
      initial: 3,
    },
    {
      type: 'select',
      name: 'output',
      message: 'Formato de salida por defecto:',
      choices: [
        {
          title: 'cli - Tabla en terminal (recomendado)',
          value: 'cli',
        },
        { title: 'json - JSON estructurado', value: 'json' },
        { title: 'csv - Valores separados por comas', value: 'csv' },
        { title: 'txt - Texto plano legible', value: 'txt' },
        { title: 'md - Markdown con tablas', value: 'md' },
      ],
      initial: 0,
    },
    {
      type: 'confirm',
      name: 'enableSecurity',
      message: '¿Habilitar análisis de seguridad avanzado?',
      initial: false,
    },
    {
      type: 'select',
      name: 'ignoreScopesChoice',
      message: 'Ignorar packages por scope:',
      choices: [
        { title: '@types/* - Tipos de TypeScript', value: '@types/*' },
        { title: '@babel/* - Herramientas Babel', value: '@babel/*' },
        { title: 'Custom - Especificar manualmente', value: 'custom' },
        { title: 'Ninguno', value: 'none' },
      ],
      initial: 3,
    },
    {
      type: (prev) => (prev === 'custom' ? 'list' : null),
      name: 'ignoreScopes',
      message: 'Scopes a ignorar (separados por coma):',
      separator: ',',
    },
    {
      type: 'select',
      name: 'ignorePrefixesChoice',
      message: 'Ignorar packages por prefijo:',
      choices: [
        { title: 'eslint-* - Plugins ESLint', value: 'eslint-*' },
        { title: 'webpack-* - Plugins Webpack', value: 'webpack-*' },
        { title: 'Custom - Especificar manualmente', value: 'custom' },
        { title: 'Ninguno', value: 'none' },
      ],
      initial: 3,
    },
    {
      type: (prev) => (prev === 'custom' ? 'list' : null),
      name: 'ignorePrefixes',
      message: 'Prefijos a ignorar (separados por coma):',
      separator: ',',
    },
  ];

  const answers = await prompts(questions, {
    onCancel: () => {
      throw new Error('Configuración cancelada por el usuario');
    },
  });

  return answers as InitAnswers;
}
