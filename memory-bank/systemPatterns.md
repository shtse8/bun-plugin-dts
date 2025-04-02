# System Patterns: bun-plugin-dts

## 1. Core Architecture

The plugin will leverage Bun's Plugin API to hook into the build process. The
primary mechanism will likely involve the `setup` function provided by the API.

```typescript
import type { BunPlugin } from "bun";

const dtsPlugin: BunPlugin = {
    name: "bun-plugin-dts",
    async setup(build) {
        // Plugin logic goes here
    },
};

export default dtsPlugin;
```

## 2. Declaration Generation Strategy

The core task is generating `.d.ts` files. The most robust way to achieve this
is by utilizing the **TypeScript Compiler API (tsc API)**.

- **Approach:**
  1. Identify the entry points from the `build.config.entrypoints`.
  2. Gather necessary TypeScript compiler options. These might be inferred from
     the project's `tsconfig.json` or provided via plugin options. Key options
     include `declaration: true`, `emitDeclarationOnly: true`, `outDir`
     (potentially adjusted based on build output).
  3. Use the `tsc API` (`ts.createProgram` or similar) to compile the project
     and emit only declaration files.
  4. This process will likely run _after_ Bun's main bundling/transpilation
     step, possibly using an `onBuild` hook if available and suitable, or
     triggered independently within the `setup` but logically sequenced after
     the main build artifacts are known.

- **Alternative (Less Likely):** Manually parsing and generating declarations.
  This is significantly more complex and error-prone than using the official
  `tsc API`.

## 3. Integration with Bun Build

- The plugin will be registered in the `Bun.build` configuration.
- It needs to determine the output directory (`outdir`) specified in the Bun
  build configuration to place the `.d.ts` files correctly relative to the
  JavaScript output.
- The generation process should ideally run once per build, likely triggered
  towards the end of the build process.

## 4. Configuration

- Plugin options will be passed during registration.
- Potential options:
  - `tsConfigPath`: Path to the `tsconfig.json` file.
  - `outputDir`: Override the output directory for `.d.ts` files (defaults to
    aligning with Bun's `outdir`).
  - `entry`: Override entry points specifically for declaration generation (if
    needed).

## 5. Key Technical Decisions (Initial)

- **Use TypeScript Compiler API:** This is the standard and most reliable way to
  generate `.d.ts` files.
- **Run Post-Build (Logical):** Declaration generation depends on the final
  structure and files involved in the build, making a post-build or end-of-build
  step the most logical place for it. The exact hook (`onBuild`, etc.) needs
  investigation within the Bun Plugin API.
- **Infer Configuration:** Prioritize inferring settings from `tsconfig.json`
  and Bun's build config, allowing overrides via plugin options.
