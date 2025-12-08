/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { writeFile, realpath, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import chalk from 'chalk';
import { defaultConfig } from '../config/defaults.js';
import { configSchema } from '../config/schema.js';
import { askInitMode, askGuidedQuestions } from './init/prompts.js';
import {
  buildConfigFromAnswers,
  formatConfigForFile,
} from './init/builder.js';

/**
 * Validate that a path is within allowed directory (prevent path traversal)
 */
async function validatePathSafety(
  targetPath: string,
  baseDir: string
): Promise<void> {
  try {
    // For file creation, check the directory
    const targetDir = dirname(targetPath);
    const realTarget = await realpath(targetDir).catch(() => targetDir);
    const realBase = await realpath(baseDir).catch(() => baseDir);

    const normalizedTarget = resolve(realTarget);
    const normalizedBase = resolve(realBase);

    if (!normalizedTarget.startsWith(normalizedBase)) {
      throw new Error(
        'Path traversal detected: target path is outside allowed directory'
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Path traversal')) {
      throw error;
    }
    // Fallback validation
    const normalized = resolve(targetPath);
    if (
      normalized.includes('..') ||
      !normalized.startsWith(resolve(baseDir))
    ) {
      throw new Error('Invalid path: contains path traversal sequences');
    }
  }
}

/**
 * Verifica si ya existe un archivo de configuración
 */
async function checkConfigExists(configPath: string): Promise<boolean> {
  try {
    await access(configPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pregunta al usuario si quiere sobrescribir configuración existente
 */
async function confirmOverwrite(): Promise<boolean> {
  const prompts = (await import('prompts')).default;
  const response = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: chalk.yellow(
      'Ya existe un archivo de configuración. ¿Sobrescribir?'
    ),
    initial: false,
  });
  return response.overwrite || false;
}

/**
 * Imprime los siguientes pasos y referencias a documentación
 */
function printNextSteps(configPath: string): void {
  console.log(chalk.green.bold('\n✓ Configuración creada exitosamente!\n'));
  console.log(chalk.dim(`Archivo: ${configPath}\n`));

  console.log(chalk.bold('📖 Próximos pasos:\n'));
  console.log(
    `  1. Ejecuta ${chalk.cyan('package-health-analyzer')} para analizar tus dependencias`
  );
  console.log(
    `  2. Revisa el archivo ${chalk.cyan('.packagehealthanalyzerrc.json')} generado`
  );
  console.log(
    `  3. Consulta la documentación completa en ${chalk.dim('https://github.com/686f6c61/package-health-analyzer')}\n`
  );

  console.log(chalk.bold('💡 Ejemplos de configuración:\n'));
  console.log(
    chalk.dim(
      '  - Para proyectos comerciales: ver README.md sección "Commercial Projects"'
    )
  );
  console.log(
    chalk.dim('  - Para proyectos SaaS: ver README.md sección "SaaS Projects"')
  );
  console.log(
    chalk.dim(
      '  - Para open source: ver README.md sección "Open Source Projects"'
    )
  );
  console.log(
    chalk.dim(
      `  - Archivo de ejemplo: ${chalk.cyan('.packagehealthanalyzerrc.example.json')}\n`
    )
  );
}

/**
 * Create a configuration file
 */
export async function initConfig(
  directory: string = process.cwd()
): Promise<void> {
  // Validate directory parameter
  if (!directory || typeof directory !== 'string') {
    throw new Error('Invalid directory parameter');
  }

  // Prevent path traversal
  const cwd = process.cwd();
  const resolvedDir = resolve(directory);

  // Check for obvious path traversal attempts
  if (directory.includes('\0') || resolvedDir.includes('..')) {
    throw new Error('Invalid directory: contains forbidden characters');
  }

  const configPath = resolve(resolvedDir, '.packagehealthanalyzerrc.json');

  // Validate the final path is within a reasonable scope
  await validatePathSafety(configPath, cwd);

  // Check if config already exists
  const configExists = await checkConfigExists(configPath);
  if (configExists) {
    const shouldOverwrite = await confirmOverwrite();
    if (!shouldOverwrite) {
      console.log(
        chalk.yellow(
          '✖ Configuración cancelada. Archivo existente no modificado.'
        )
      );
      return;
    }
  }

  // Show welcome
  console.log(
    chalk.bold.cyan('\n📦 Package Health Analyzer - Configuración Inicial\n')
  );

  try {
    // Ask for configuration mode
    const mode = await askInitMode();

    let config;

    if (mode === 'default') {
      // Default mode (current behavior)
      console.log(chalk.dim('\nUsando valores por defecto...\n'));
      config = formatConfigForFile(defaultConfig);
    } else {
      // Guided mode (new)
      console.log(
        chalk.dim(
          '\nResponde las siguientes preguntas para personalizar tu configuración:\n'
        )
      );
      const answers = await askGuidedQuestions();
      const builtConfig = buildConfigFromAnswers(answers);

      // Validate with Zod before saving
      const validated = configSchema.parse(builtConfig);
      config = formatConfigForFile(validated);
    }

    // Write file
    const content = JSON.stringify(config, null, 2);
    await writeFile(configPath, content, 'utf-8');

    // Success message with references to documentation
    printNextSteps(configPath);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('cancelada')
    ) {
      console.log(chalk.yellow('\n✖ Configuración cancelada por el usuario'));
      process.exit(0);
    }
    throw error;
  }
}
