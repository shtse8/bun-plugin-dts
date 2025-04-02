# bun-plugin-dts

[![npm version](https://badge.fury.io/js/bun-plugin-dts.svg)](https://badge.fury.io/js/bun-plugin-dts)
[![CI](https://github.com/shtse8/bun-plugin-dts/actions/workflows/publish.yml/badge.svg)](https://github.com/shtse8/bun-plugin-dts/actions/workflows/publish.yml)

A plugin for [Bun](https://bun.sh) that generates TypeScript declaration files
(`.d.ts`) during the `bun build` process.

## Problem

Bun's built-in bundler (`bun build`) is incredibly fast, but it currently does
not generate `.d.ts` files automatically. This makes it difficult to publish
TypeScript libraries built with Bun, as consumers rely on these files for type
checking and autocompletion.

`bun-plugin-dts` solves this by hooking into the build process and using the
TypeScript Compiler API to generate the necessary declaration files alongside
your JavaScript output.

## Installation

```bash
bun add --dev bun-plugin-dts
```

You also need `typescript` installed, which is likely already in your project:

```bash
bun add --dev typescript
```

## Usage

Import the plugin and add it to the `plugins` array in your `Bun.build`
configuration.

**Example `build.ts`:**

```typescript
import Bun from "bun";
import dts from "bun-plugin-dts"; // Import the plugin

await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "bun", // Or your desired target
    plugins: [
        dts(), // Add the plugin here
    ],
    // ... other build options
});

console.log("Build complete!");
```

The plugin will automatically:

1. Find your `tsconfig.json` in the project `root`.
2. Read the entry points and output directory (`outdir`) from the `Bun.build`
   config.
3. Generate `.d.ts` files corresponding to your entry points within the
   specified `outdir`.

## Configuration (Optional)

Currently, the plugin automatically detects settings from your `tsconfig.json`
and `Bun.build` configuration. Explicit plugin options may be added in the
future if needed.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull
request on the [GitHub repository](https://github.com/shtse8/bun-plugin-dts).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details (Note: LICENSE file not yet created).
