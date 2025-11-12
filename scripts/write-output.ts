#!/usr/bin/env node
/**
 * Safely writes generated content to the correct output.md file.
 * - Resolves prompt files to their corresponding outputs via scripts/output-map.json
 * - Creates a hidden timestamped backup before overwriting
 * - Writes atomically to avoid partial updates
 *
 * Usage examples:
 *   node scripts/write-output.ts --prompt dev-resources/implementation/prompt.md --source tmp/plan.md
 *   cat tmp/architecture.md | node scripts/write-output.ts --prompt dev-resources/architecture/prompt.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const outputMap = require('./output-map.json');

const repoRoot = path.resolve(__dirname, '..');

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--prompt':
        options.prompt = argv[++i];
        break;
      case '--source':
        options.source = argv[++i];
        break;
      case '--text':
        options.text = argv[++i];
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default: {
        if (arg.startsWith('--')) {
          throw new Error(`Unknown option "${arg}". Use --help for usage.`);
        }
        // Allow passing prompt path as positional argument for convenience.
        if (!options.prompt) {
          options.prompt = arg;
        } else if (!options.source) {
          options.source = arg;
        } else {
          throw new Error(`Unexpected positional argument "${arg}".`);
        }
      }
    }
  }
  return options;
}

function printHelp() {
  const helpText = `
Usage:
  node scripts/write-output.ts --prompt <prompt-path> [--source <file> | --text "<content>"]
  cat file.md | node scripts/write-output.ts --prompt <prompt-path>

Options:
  --prompt   Path to the prompt or instruction file whose output should be updated.
  --source   Optional path to a file containing the content to write.
  --text     Optional literal text content. Use quotes to preserve spacing.
  --help     Show this help message.

If neither --source nor --text is provided, the script reads from stdin.
`;
  console.log(helpText.trim());
}

async function readContent(options) {
  if (options.text) {
    return options.text;
  }

  if (options.source) {
    const absoluteSource = path.resolve(repoRoot, options.source);
    return fs.promises.readFile(absoluteSource, 'utf8');
  }

  if (!process.stdin.isTTY) {
    return new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });
      process.stdin.on('end', () => resolve(data));
      process.stdin.on('error', reject);
    });
  }

  throw new Error(
    'No content provided. Use --source, --text, or pipe input via stdin.',
  );
}

function resolvePrompt(promptInput) {
  if (!promptInput) {
    throw new Error('Missing required --prompt argument.');
  }
  const absolutePrompt = path.resolve(repoRoot, promptInput);
  const relativePrompt = path.relative(repoRoot, absolutePrompt);
  const normalizedPrompt = normalizePath(relativePrompt);
  return normalizedPrompt;
}

function getOutputPath(promptKey) {
  const outputRelative = outputMap[promptKey];
  if (!outputRelative) {
    const availableKeys = Object.keys(outputMap)
      .map((key) => `  - ${key}`)
      .join('\n');
    throw new Error(
      `No output mapping found for "${promptKey}".\nAvailable prompt keys:\n${availableKeys}`,
    );
  }
  const outputAbsolute = path.resolve(repoRoot, outputRelative);
  return { outputRelative, outputAbsolute };
}

function backupIfNeeded(outputAbsolute) {
  if (!fs.existsSync(outputAbsolute)) {
    return null;
  }
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  const outputDir = path.dirname(outputAbsolute);
  const baseName = path.basename(outputAbsolute);
  const backupName = `.${baseName}.${timestamp}.bak`;
  const backupPath = path.join(outputDir, backupName);
  fs.copyFileSync(outputAbsolute, backupPath);
  return normalizePath(path.relative(repoRoot, backupPath));
}

function writeAtomically(outputAbsolute, content) {
  const outputDir = path.dirname(outputAbsolute);
  fs.mkdirSync(outputDir, { recursive: true });
  const tempName = `.${path.basename(outputAbsolute)}.${process.pid}.${Date.now()}.tmp`;
  const tempPath = path.join(outputDir, tempName);
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, outputAbsolute);
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printHelp();
      return;
    }

    const promptKey = resolvePrompt(options.prompt);
    const { outputRelative, outputAbsolute } = getOutputPath(promptKey);
    const content = await readContent(options);

    const backupPath = backupIfNeeded(outputAbsolute);
    writeAtomically(outputAbsolute, content);

    const bytes = Buffer.byteLength(content, 'utf8');
    const messageParts = [
      `Updated ${outputRelative} (${bytes} bytes)`,
      backupPath
        ? `backup saved to ${backupPath}`
        : 'no previous file to back up',
    ];
    console.log(`[write-output] ${messageParts.join('; ')}`);
  } catch (error) {
    console.error(`[write-output] ${error.message}`);
    process.exitCode = 1;
  }
}

main();
