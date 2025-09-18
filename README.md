# Next.js 15.4.1 SWC Minification Bug Reproduction

This minimal reproduction demonstrates a SWC minification bug introduced in Next.js 15.4.1.

## Bug Description

When a closure references a parent function's parameter AND is called 3 or more times, the SWC minifier fails to properly rename the parameter in the closure body during minification, causing a "ReferenceError: range is not defined" error.

**Critical finding**: The bug only occurs when the closure is called 3+ times. With 2 calls, the build succeeds!

## Repository Structure

- `app/page.tsx` - Demonstrates the bug (3 closure calls → build fails)
- `app/working-example.tsx` - Shows it works with only 2 calls (build succeeds)
- `app/layout.tsx` - Basic layout component
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with ES5 target

## Steps to Reproduce

1. Install dependencies:
```bash
pnpm install
```

2. Run the build:
```bash
pnpm build
```

3. Observe the error:
```
Error occurred prerendering page "/". 
ReferenceError: range is not defined
```

## Expected Behavior

The build should complete successfully, and the parameter `range` should be properly renamed throughout the minified code.

## Actual Behavior

The minifier renames the parameter in the function signature but fails to rename it in the closure body, resulting in a reference error.

## Code Pattern That Triggers the Bug

```typescript
const decideZoomByAccuracy = (range: number): number => {
  const isUnder = (accuracy: number): boolean => {
    return range <= accuracy;  // BUG: 'range' is not transformed during minification
  };
  
  if (isUnder(0)) return 15;
  if (isUnder(50)) return 15;
  if (isUnder(100)) return 15;  // Adding this 3rd call triggers the bug!
  return 11;
};
```

## Affected Versions

- ✅ Next.js 15.4.0 and earlier: Works correctly
- ❌ Next.js 15.4.1: Bug introduced (SWC updated to v1.11.24)
- ❌ Next.js 15.4.3, 15.5.3: Bug persists

## Important Note

**`serverMinification: false` does NOT fix this issue.** The bug persists even with server minification disabled.

## Workaround

The only current workarounds are:
1. Refactor code to avoid closures that reference parent parameters
2. Ensure closures are called less than 3 times
3. Downgrade to Next.js 15.4.0 or earlier

## Environment Information

```
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin 24.3.0
Binaries:
  Node: 20.15.1
  pnpm: 9.5.0
Relevant Packages:
  next: 15.4.1
  react: 18.2.0
  react-dom: 18.2.0
  typescript: 5.0.0
```

## Related Issues

- Next.js Issue #70938: SWC minify bugs with closures
- Introduced by SWC update to v1.11.24 in Next.js 15.4.1

## Note

This issue occurs regardless of the package manager used (pnpm, npm, yarn).