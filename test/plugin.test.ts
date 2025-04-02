import { describe, test, expect, beforeAll } from 'bun:test';
import { $ } from 'bun'; // For running shell commands like our build script
import path from 'path';
import fs from 'fs/promises';

const fixtureDir = path.resolve(__dirname, 'fixture');
const outDir = path.join(fixtureDir, 'dist');
const buildScriptName = 'build.ts'; // Name of the build script in the test directory
const buildScriptPath = path.resolve(__dirname, buildScriptName);
const expectedDtsFile = path.join(outDir, 'index.d.ts');

describe('bun-plugin-dts', () => {
  // Clean up before running tests
  beforeAll(async () => {
    await fs.rm(outDir, { recursive: true, force: true });
  });

  test('should generate .d.ts file for a simple fixture', async () => {
    console.log(`Test Runner: Executing build script: ${buildScriptPath}`);

    // Execute the build script using Bun's shell ($)
    const { exitCode, stdout, stderr } = await $`bun ${buildScriptPath}`.nothrow(); // nothrow() prevents exit on failure

    console.log("--- Build Script STDOUT ---");
    console.log(stdout.toString());
    console.log("--- Build Script STDERR ---");
    console.log(stderr.toString());
    console.log("--------------------------");

    // 1. Check if the build script itself succeeded
    expect(exitCode).toBe(0);
    expect(stderr.toString()).not.toContain('Build failed'); // Check stderr for failure messages
    expect(stderr.toString()).not.toContain('Error:'); // Check stderr for generic errors

    // 2. Check if the expected .d.ts file exists
    let dtsFileExists = false;
    try {
      await fs.access(expectedDtsFile, fs.constants.F_OK);
      dtsFileExists = true;
    } catch (e) {
      // File does not exist
    }
    expect(dtsFileExists).toBe(true);

    // 3. (Optional but recommended) Check the content of the .d.ts file
    if (dtsFileExists) {
      const dtsContent = await fs.readFile(expectedDtsFile, 'utf-8');
      expect(dtsContent).toContain('export interface User');
      expect(dtsContent).toContain('export declare function getUser(id: number): User;');
      // Avoid checking for implementation details like the console.log
      expect(dtsContent).not.toContain('console.log');
    }
  });

  // Add more tests here for edge cases, errors, options etc.
});