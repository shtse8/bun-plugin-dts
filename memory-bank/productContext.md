# Product Context: bun-plugin-dts

## 1. Problem Solved

Bun is a fast JavaScript runtime and bundler. However, its `bun build` command
currently lacks the built-in capability to generate TypeScript declaration files
(`.d.ts`). This is a significant gap for developers building libraries or
applications with TypeScript using Bun, as `.d.ts` files are crucial for
providing type safety and autocompletion to consumers of the code. Without them,
the usability and adoption of libraries built with Bun are hindered.

## 2. How It Should Work

The `bun-plugin-dts` plugin should integrate into the Bun build lifecycle. When
a user runs `bun build`, the plugin should:

1. Hook into the build process using Bun's plugin API.
2. Analyze the project's TypeScript source files specified in the build
   configuration.
3. Leverage the TypeScript compiler API (or a similar mechanism) to generate the
   corresponding `.d.ts` files.
4. Place the generated `.d.ts` files in the appropriate output directory,
   mirroring the structure of the compiled JavaScript output.
5. Provide clear feedback or error messages if generation fails.

## 3. User Experience Goals

- **Seamless Integration:** Users should be able to add the plugin to their
  `build` configuration with minimal setup.
- **"It Just Works":** For standard project setups, the plugin should generate
  correct `.d.ts` files without requiring extensive configuration.
- **Configurability:** Offer options for users with more complex needs (e.g.,
  specifying different entry points, controlling output location).
- **Performance:** The plugin should not add significant overhead to the build
  time. Bun's main appeal is speed, and the plugin should respect that.
- **Reliability:** Generate accurate type definitions consistent with the source
  code.
