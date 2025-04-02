import Bun from 'bun';
import dtsPlugin from '../src/index'; // Import our plugin
import path from 'path';
import fs from 'fs/promises'; // To clean up dist before build

const fixtureDir = path.resolve(__dirname, 'fixture');
const entrypoint = path.join(fixtureDir, 'src', 'index.ts');
const outDir = path.join(fixtureDir, 'dist');
const tsConfigPath = path.join(fixtureDir, 'tsconfig.json');

console.log(`Test Build: Building fixture in ${fixtureDir}`);
console.log(`Test Build: Entrypoint: ${entrypoint}`);
console.log(`Test Build: Output directory: ${outDir}`);
console.log(`Test Build: Tsconfig: ${tsConfigPath}`);

async function runBuild() {
  try {
    // Clean the output directory before build
    await fs.rm(outDir, { recursive: true, force: true });
    console.log(`Test Build: Cleaned output directory: ${outDir}`);

    const result = await Bun.build({
      entrypoints: [entrypoint],
      outdir: outDir,
      root: fixtureDir, // Set the root for the build context
      // tsconfig: tsConfigPath, // Invalid option - plugin finds it based on root
      plugins: [
        dtsPlugin // Use our d.ts plugin
      ],
      target: 'bun', // Specify target
      // sourcemap: 'external', // Optional: include sourcemaps for JS
    });

    if (result.success) {
      console.log("Test Build: Build successful!");
      // console.log("Outputs:", result.outputs); // Log output details if needed
    } else {
      console.error("Test Build: Build failed.");
      console.error(result.logs); // Log errors from Bun build
      process.exit(1); // Exit with error code if build fails
    }

  } catch (error) {
    console.error("Test Build: An unexpected error occurred during build:");
    console.error(error);
    process.exit(1);
  }
}

runBuild();