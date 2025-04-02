# Tech Context: bun-plugin-dts

## 1. Core Technologies

- **Runtime/Bundler:** Bun (v1.x or latest stable) - The plugin is specifically
  designed for the Bun ecosystem.
- **Language:** TypeScript - The plugin itself will be written in TypeScript,
  and it processes TypeScript codebases.
- **Key Dependency:** TypeScript Compiler API (`typescript` package) - This will
  be used for the actual `.d.ts` file generation. The specific version should be
  chosen carefully for compatibility.

## 2. Development Setup

- **Package Manager:** Bun (`bun install`, `bun run`, etc.)
- **Build System:** Bun (`bun build`) - The plugin integrates into this process.
- **Source Control:** Git (Assumed standard practice).
- **Development Environment:** Node.js environment (for `tsc` API compatibility,
  although Bun aims for Node.js compatibility). A standard code editor like VS
  Code.
- **Testing:** A testing framework compatible with Bun/TypeScript (e.g.,
  `bun:test`).

## 3. Technical Constraints & Considerations

- **Bun Plugin API:** The plugin's functionality is constrained by the
  capabilities and lifecycle hooks provided by the Bun Plugin API. Understanding
  its limitations is crucial.
- **TypeScript API Version:** Compatibility between the installed TypeScript
  version (used by the plugin) and the version potentially used by the target
  project needs consideration. Ideally, the plugin uses its own bundled
  `typescript` dependency.
- **Performance:** Leveraging the `tsc` API can be resource-intensive. The
  implementation needs to be mindful of performance to avoid significantly
  slowing down `bun build`. Caching or incremental generation could be future
  optimizations but are out of scope initially.
- **Error Handling:** Robust error handling is needed to report issues during
  declaration generation (e.g., TypeScript compilation errors, configuration
  problems).
- **Filesystem Access:** The plugin will need appropriate permissions to read
  source files (`tsconfig.json`, `.ts` files) and write `.d.ts` files to the
  output directory.

## 4. Dependencies

- **Direct:**
  - `typescript`: For using the Compiler API.
- **Development:**
  - `@types/bun`: For Bun-specific types.
  - Potentially linting/formatting tools (e.g., ESLint, Prettier).
