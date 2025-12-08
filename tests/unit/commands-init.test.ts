/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initConfig } from '../../src/commands/init.js';
import { writeFile, realpath, access } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(),
  realpath: vi.fn(),
  access: vi.fn(),
}));

vi.mock('../../src/commands/init/prompts.js', () => ({
  askInitMode: vi.fn(),
  askGuidedQuestions: vi.fn(),
}));

import { askInitMode, askGuidedQuestions } from '../../src/commands/init/prompts.js';

describe('Init Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock realpath to return the path as-is for testing
    vi.mocked(realpath).mockImplementation(async (path) => path.toString());
    // Mock access to simulate file not exists
    vi.mocked(access).mockRejectedValue(new Error('File not found'));
  });

  describe('Default Mode', () => {
    beforeEach(() => {
      vi.mocked(askInitMode).mockResolvedValue('default');
    });

    it('should create config file with default values', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      expect(askInitMode).toHaveBeenCalled();
      expect(askGuidedQuestions).not.toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();
    });

    it('should create config file in current directory', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      expect(writeFile).toHaveBeenCalled();
      const calls = vi.mocked(writeFile).mock.calls;
      expect(calls[0][0]).toContain('.packagehealthanalyzerrc.json');
    });

    it('should create config file in specified directory', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig('./custom/path');

      expect(writeFile).toHaveBeenCalled();
      const calls = vi.mocked(writeFile).mock.calls;
      expect(calls[0][0]).toContain('custom/path');
    });

    it('should write valid JSON with schema', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      const calls = vi.mocked(writeFile).mock.calls;
      const content = JSON.parse(calls[0][1] as string);

      expect(content.$schema).toBeDefined();
      expect(content.projectType).toBe('commercial');
    });

    it('should include all config sections', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      const calls = vi.mocked(writeFile).mock.calls;
      const content = JSON.parse(calls[0][1] as string);

      expect(content.projectType).toBeDefined();
      expect(content.age).toBeDefined();
      expect(content.license).toBeDefined();
      expect(content.scoring).toBeDefined();
      expect(content.ignore).toBeDefined();
      expect(content.output).toBeDefined();
    });

    it('should write formatted JSON', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      const calls = vi.mocked(writeFile).mock.calls;
      const content = calls[0][1] as string;

      expect(content).toContain('\n');
      expect(content).toContain('  ');
    });
  });

  describe('Guided Mode', () => {
    beforeEach(() => {
      vi.mocked(askInitMode).mockResolvedValue('guided');
    });

    it('should create config from guided answers', async () => {
      vi.mocked(askGuidedQuestions).mockResolvedValue({
        mode: 'guided',
        projectType: 'saas',
        includeDevDependencies: true,
        ageWarn: '1y',
        ageCritical: '3y',
        licenseDeny: ['GPL-*', 'AGPL-*'],
        licenseWarn: ['LGPL-*'],
        minimumScore: 70,
        failOn: 'warning',
        output: 'json',
        enableSecurity: true,
        ignoreScopesChoice: '@types/*',
        ignorePrefixesChoice: 'none',
      });
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      expect(askGuidedQuestions).toHaveBeenCalled();
      const calls = vi.mocked(writeFile).mock.calls;
      const content = JSON.parse(calls[0][1] as string);

      expect(content.projectType).toBe('saas');
      expect(content.age.warn).toBe('1y');
      expect(content.scoring.minimumScore).toBe(70);
      expect(content.output).toBe('json');
    });

    it('should handle license deny options', async () => {
      vi.mocked(askGuidedQuestions).mockResolvedValue({
        mode: 'guided',
        licenseDeny: ['GPL-*', 'AGPL-*', 'SSPL-*'],
      });
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      const calls = vi.mocked(writeFile).mock.calls;
      const content = JSON.parse(calls[0][1] as string);

      expect(content.license.deny).toEqual(['GPL-*', 'AGPL-*', 'SSPL-*']);
    });

    it('should handle ignore scopes custom', async () => {
      vi.mocked(askGuidedQuestions).mockResolvedValue({
        mode: 'guided',
        ignoreScopesChoice: 'custom',
        ignoreScopes: ['@mycompany/*', '@internal/*'],
      });
      vi.mocked(writeFile).mockResolvedValue(undefined);

      await initConfig();

      const calls = vi.mocked(writeFile).mock.calls;
      const content = JSON.parse(calls[0][1] as string);

      expect(content.ignore.scopes).toEqual(['@mycompany/*', '@internal/*']);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      vi.mocked(askInitMode).mockResolvedValue('default');
    });

    it('should handle write errors', async () => {
      vi.mocked(writeFile).mockRejectedValue(new Error('Permission denied'));

      await expect(initConfig()).rejects.toThrow('Permission denied');
    });

    it('should handle user cancellation', async () => {
      vi.mocked(askInitMode).mockRejectedValue(
        new Error('Configuración cancelada por el usuario')
      );

      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      // The function will catch the error and call process.exit, not throw
      try {
        await initConfig();
      } catch (error) {
        // Should not throw, should exit instead
      }

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(writeFile).not.toHaveBeenCalled();

      exitSpy.mockRestore();
    });
  });

  describe('Overwrite Protection', () => {
    beforeEach(() => {
      vi.mocked(askInitMode).mockResolvedValue('default');
      // Mock access to simulate file exists
      vi.mocked(access).mockResolvedValue(undefined);
    });

    it('should ask before overwriting existing config', async () => {
      vi.mocked(writeFile).mockResolvedValue(undefined);

      // Mock prompts for overwrite confirmation
      const promptsMock = vi.fn().mockResolvedValue({ overwrite: true });
      vi.doMock('prompts', () => ({ default: promptsMock }));

      await initConfig();

      // Should still write if user confirms
      expect(writeFile).toHaveBeenCalled();
    });
  });
});
