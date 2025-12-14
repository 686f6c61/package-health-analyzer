#!/usr/bin/env node

/**
 * package-health-analyzer - Main Entry Point
 *
 * This file serves as the primary entry point for the package-health-analyzer CLI tool.
 * It imports the Commander.js program instance from the CLI module and initiates the
 * command parsing process, delegating all command-line argument processing and routing
 * to the appropriate command handlers.
 *
 * Key responsibilities:
 * - Bootstrap the CLI application by importing and executing the Commander program
 * - Parse command-line arguments and route to appropriate command handlers
 * - Provide the executable entry point for npm/npx invocations
 *
 * @module index
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { program } from './cli.js';

program.parse();
