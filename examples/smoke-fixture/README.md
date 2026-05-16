# Smoke fixture

A disposable repo can test Build Skill with two independent utilities:

```text
/skill:simple-build Build two independent utility Beads:
1. src/math.ts with clampScore(value, min, max) and tests/math.test.mjs.
2. src/slug.ts with slugifyLabel(input) and tests/slug.test.mjs.
Use separate worktrees, review each Bead, merge into main, run npm run test/typecheck/build, and do not push.
```

This mirrors the smoke test used before publishing the package.
