# Next.js 15.4.1 SWC Minification Bug Reproduction

This minimal reproduction demonstrates a SWC minification bug introduced in Next.js 15.4.1.

## Bug Description

When a closure references a parent function's parameter AND is called 3 or more times, the SWC minifier fails to properly rename the parameter in the closure body during minification, causing a "ReferenceError: range is not defined" error.

**Critical finding**: The bug only occurs when the closure is called 3+ times. With 2 calls, the build succeeds!

## Steps to Reproduce

1. Install dependencies:
```bash
npm install
```

2. Run the build:
```bash
npm run build
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

## Affected Versions

- ✅ Next.js 15.4.0 and earlier: Works correctly
- ❌ Next.js 15.4.1 and later: Bug present

## Workaround

Add `serverMinification: false` to `next.config.js`:

```javascript
const nextConfig = {
  serverMinification: false,
}
```

Or avoid using closures that reference parent function parameters.

## Related Issues

- Next.js Issue #70938: SWC minify bugs with closures
- Introduced by SWC update to v1.11.24 in Next.js 15.4.1