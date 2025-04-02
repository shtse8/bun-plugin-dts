# Active Context: bun-plugin-dts (Refinement & Options)

## 1. Current Focus

The core `.d.ts` generation logic is implemented and verified with a basic test.
The focus now shifts to refining the plugin and adding configurability:

- Implementing plugin options (e.g., overriding `tsconfig.json` path, specifying
  different output directory).
- Enhancing error handling and reporting for edge cases.
- Adding more comprehensive tests covering different scenarios (e.g., multiple
  entry points, complex types, errors in source files).
- Improving performance (if necessary, after further testing).
- Updating documentation (`README.md`) and `package.json` details.

## 2. Recent Changes

- Ran initial test (`bun test`) which successfully verified `.d.ts` generation
  for the test fixture.
- Cleaned up temporary `console.log` statements in `src/index.ts`.
- Prefixed plugin-specific error messages for better clarity.
- Corrected `package.json` to remove invalid comments and duplicate keys.
- Created test infrastructure:
  - `test/fixture/src/index.ts`
  - `test/fixture/tsconfig.json`
  - `test/build.ts` (script to run Bun build on fixture)
  - `test/plugin.test.ts` (using `bun:test`)
- Configured main `tsconfig.json` with `include`/`exclude` to avoid conflicts
  with test files.

## 3. Next Steps

1. **Implement Plugin Options:** Define an options interface and modify
   `src/index.ts` to accept and use options passed during plugin registration in
   `Bun.build`.
2. **Add More Tests:** Create tests for:
   - Using plugin options.
   - Projects without a `tsconfig.json`.
   - Projects with TS errors.
   - Multiple entry points.
3. **Refine Error Handling:** Ensure clear and actionable error messages for all
   anticipated failure modes.
4. **Update README.md:** Add usage instructions and configuration details.
5. **Update `package.json`:** Fill in author, repository, homepage details.

## 4. Active Decisions & Considerations

- **Options Interface:** Design a clear and intuitive interface for plugin
  options.
- **Error Strategy:** Decide whether specific errors (like missing tsconfig)
  should halt the build or just log a warning.
