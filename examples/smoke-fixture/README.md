# Smoke fixture

A disposable repo can test Build Skill with two independent utilities. First run `npm install` in this fixture so `typescript` is available:

```text
/skill:simple-build Build two independent utility Beads:
1. src/math.ts with clampScore(value, min, max) and tests/math.test.mjs.
2. src/slug.ts with slugifyLabel(input) and tests/slug.test.mjs.
Use separate worktrees, review each Bead with Codex Review when available or x-hi fallback when unavailable, merge into main, run npm run test/typecheck/build, and do not push.
```

This mirrors the smoke test used before publishing the package.
