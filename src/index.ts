import type { BunPlugin, PluginBuilder } from 'bun'; // Combined imports
import ts from 'typescript';
import path from 'path'; // Import path module

// console.log("bun-plugin-dts loaded"); // Keep commented for potential future debugging

const dtsPlugin: BunPlugin = {
  name: 'bun-plugin-dts',
  async setup(build: PluginBuilder) {
    // console.log("bun-plugin-dts setup running");

    const entrypoints = build.config?.entrypoints ?? [];
    const outdir = build.config?.outdir ?? './dist'; // Default if not specified? Bun likely requires it.
    const root = build.config?.root ?? process.cwd();

    // console.log("Entrypoints:", entrypoints);
    // console.log("Output directory:", outdir);
    // console.log("Project root:", root);

    if (!outdir) {
      console.error("bun-plugin-dts: Error - Output directory ('outdir') is not defined in build config.");
      // Consider throwing an error or handling this case more robustly
      return;
    }

    // --- Find and parse tsconfig.json ---
    const tsConfigPath = ts.findConfigFile(
      root,
      ts.sys.fileExists,
      "tsconfig.json"
    );

    if (!tsConfigPath) {
      console.error(`bun-plugin-dts: Error - Could not find tsconfig.json in project root: ${root}`);
      // Decide if this is a fatal error or if we should proceed with defaults
      return;
    }

    // console.log(`Found tsconfig.json at: ${tsConfigPath}`);

    const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);

    if (configFile.error) {
      console.error("bun-plugin-dts: Error reading tsconfig.json:", ts.flattenDiagnosticMessageText(configFile.error.messageText, "\n"));
      return;
    }

    // Parse the tsconfig.json content
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config, // The JSON object from tsconfig.json
      ts.sys,            // System interface for file operations
      path.dirname(tsConfigPath), // Base path for resolving relative paths in tsconfig
      {},                // Existing options (can be used to override)
      tsConfigPath       // Path to the config file itself
    );

    if (parsedConfig.errors.length > 0) {
      console.error("bun-plugin-dts: Error parsing tsconfig.json:");
      parsedConfig.errors.forEach(diag => {
        // Keep TS diagnostics unprefixed for clarity, as they often include file/line info
        console.error("-", ts.flattenDiagnosticMessageText(diag.messageText, "\n"));
      });
      return;
    }

    // console.log("Successfully parsed tsconfig.json");

    // --- Prepare Compiler Options for Declaration Emit ---
    const compilerOptions: ts.CompilerOptions = {
      ...parsedConfig.options, // Start with options from user's tsconfig
      declaration: true,       // Enable .d.ts generation
      emitDeclarationOnly: true,// Only emit .d.ts files, no JS
      noEmit: false,           // Ensure emit is not disabled
      outDir: outdir,          // Use the output directory from Bun's build config
      // declarationDir: outdir, // Alternative: Specify separate dir for declarations
      // Ensure entry points are resolved correctly relative to root
      // ts.parseJsonConfigFileContent usually handles this based on its basePath argument
    };

    // --- Create and Emit TypeScript Program ---
    // console.log(`Generating .d.ts files for entry points: ${entrypoints.join(', ')}`);
    // console.log(`Output directory for .d.ts files: ${compilerOptions.outDir}`);

    // Resolve entry point paths relative to the project root
    const absoluteEntrypoints = entrypoints.map(ep => path.resolve(root, ep));

    // Create the TS program
    const program = ts.createProgram(absoluteEntrypoints, compilerOptions);

    // Emit the declaration files
    const emitResult = program.emit();

    // --- Report Diagnostics ---
    const allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        // Log warnings/errors clearly
        const level = diagnostic.category === ts.DiagnosticCategory.Error ? 'Error' : 'Warning';
        console.error(`${level} ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.error("Diagnostic:", ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      }
    });

    if (emitResult.emitSkipped) {
      console.error("bun-plugin-dts: Error - TypeScript .d.ts emit skipped due to errors."); // Add plugin name to error
      // Potentially throw an error here to fail the build if desired
    } else {
      console.log("bun-plugin-dts: Successfully generated .d.ts files."); // Add plugin name to success message
    }

    // TODO: Consider plugin options for overriding tsconfig path, output dir etc.
    // TODO: Add more robust error handling and reporting.
    // TODO: Investigate performance implications and potential optimizations.
    // Redundant TODO removed.
    // TODO: Figure out the correct hook or timing to run the d.ts generation.
    // It likely needs to happen after Bun identifies files but before the build fully completes,
    // or potentially as a separate step triggered by the plugin.
    // Placeholder log removed.

  }
};

export default dtsPlugin;