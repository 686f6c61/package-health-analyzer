/**
 * package-health-analyzer - Application Version Retrieval
 *
 * Provides runtime version information by reading the package.json file at execution time. This module enables
 * the CLI and monitoring systems to report the current analyzer version for debugging, support, and compatibility
 * tracking. It uses ESM-compatible path resolution to locate package.json from the compiled output directory,
 * gracefully handling errors by falling back to a default version string to ensure the application never crashes
 * due to missing or corrupted version metadata.
 *
 * Key responsibilities:
 * - Dynamically read version from package.json at runtime
 * - Resolve correct package.json path in ESM module context
 * - Provide fallback version if file reading fails
 * - Support version reporting in CLI help and monitoring output
 * - Handle both development and production build scenarios
 *
 * @module utils/version
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function getVersion(): Promise<string> {
  try {
    const pkgPath = join(__dirname, '../../package.json');
    const content = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.version || '2.0.0';
  } catch {
    return '2.0.0';
  }
}
