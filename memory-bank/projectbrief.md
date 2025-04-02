# Project Brief: bun-plugin-dts

## 1. Project Goal

Create a Bun plugin that automatically generates TypeScript declaration files
(`.d.ts`) during the `bun build` process. This addresses the current limitation
where `bun build` does not natively support `.d.ts` file generation.

## 2. Core Requirements

- Integrate seamlessly with the `bun build` command.
- Use Bun's plugin API.
- Generate accurate `.d.ts` files for the project being built.
- Allow configuration options (e.g., entry points, output directory).
- Be performant and not significantly slow down the build process.

## 3. Scope

- **In Scope:**
  - Basic `.d.ts` generation for typical TypeScript projects built with Bun.
  - Configuration via plugin options.
  - Handling common TypeScript features.
- **Out of Scope (Initially):**
  - Advanced `.d.ts` features (e.g., complex module augmentation, path mapping
    intricacies).
  - Watch mode integration (focus on single build runs first).
  - Integration with bundlers other than Bun.

## 4. Target Audience

TypeScript developers using Bun who need to distribute libraries or applications
with corresponding type definitions.
