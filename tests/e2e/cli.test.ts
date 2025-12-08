/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, unlink } from 'node:fs/promises';

const execAsync = promisify(exec);

describe('CLI E2E tests', () => {
  const CLI_PATH = './dist/index.js';

  it('should show version', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --version`);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should show help', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
    expect(stdout).toContain('package-health-analyzer');
    expect(stdout).toContain('scan');
    expect(stdout).toContain('check');
    expect(stdout).toContain('init');
  });

  it('should scan with JSON output', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} scan --json`);

    // Extract JSON from output (may have console.log before it)
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    expect(jsonMatch).toBeTruthy();

    const result = JSON.parse(jsonMatch![0]);

    expect(result.meta).toBeDefined();
    expect(result.project).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.packages).toBeDefined();
    expect(Array.isArray(result.packages)).toBe(true);
  }, 10000);

  it('should scan with CSV output', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} scan --csv`);

    expect(stdout).toContain('package,version');
    expect(stdout).toContain('age_days');
    expect(stdout).toContain('license');
  }, 10000);

  it('should check single package', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} check chalk`);

    expect(stdout).toContain('Package: chalk');
    expect(stdout).toContain('AGE:');
    expect(stdout).toContain('LICENSE:');
    expect(stdout).toContain('HEALTH SCORE:');
  }, 10000);

  it('should create configuration file', async () => {
    const configPath = './.packagehealthanalyzerrc-test.json';

    try {
      // Use echo to simulate selecting default mode (first option)
      // In the interactive prompt, pressing Enter selects the first option
      await execAsync(`echo "" | node ${CLI_PATH} init`);

      const content = await readFile('./.packagehealthanalyzerrc.json', 'utf-8');
      const config = JSON.parse(content);

      expect(config.projectType).toBe('commercial');
      expect(config.age).toBeDefined();
      expect(config.license).toBeDefined();
    } finally {
      // Cleanup
      try {
        await unlink('./.packagehealthanalyzerrc.json');
      } catch {
        // Ignore cleanup errors
      }
    }
  }, 10000);

  it('should respect ignore options', async () => {
    const { stdout } = await execAsync(
      `node ${CLI_PATH} scan --json --ignore chalk`
    );

    // Extract JSON from output (may have console.log before it)
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    expect(jsonMatch).toBeTruthy();

    const result = JSON.parse(jsonMatch![0]);

    const hasChalk = result.packages.some(
      (pkg: { package: string }) => pkg.package === 'chalk'
    );
    expect(hasChalk).toBe(false);
  }, 10000);

  it('should exit with code 0 on success', async () => {
    try {
      await execAsync(`node ${CLI_PATH} scan --fail-on=none`);
    } catch (error: any) {
      // Should not throw
      expect(error).toBeUndefined();
    }
  }, 10000);
});
