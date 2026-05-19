# Demo run

This package was tested from GitHub with Pi using a disposable fixture repository.

## Command shape

```bash
pi -e git:github.com/saphid/build-skill \
  --session-dir /tmp/build-skill-demo-20260516-153422/sessions \
  --thinking minimal \
  -p '/skill:simple-build Demo run from the GitHub package. Build two independent utility Beads using separate git worktrees...'
```

The full prompt asked the agent to build two independent Beads:

1. `src/math.ts` with `clampScore(value, min, max)` and `tests/math.test.mjs`.
2. `src/slug.ts` with `slugifyLabel(input)` and `tests/slug.test.mjs`.

The requested workflow was: plan Beads, use separate worktrees, run focused test-first/RGR where practical, review each Bead, then act as separate merge reviewer and merge PASS branches into `main` without pushing.

## Result

- Exit code: `0`
- Wall clock: `130s`
- Assistant token usage: `258,041` total tokens
- Cost reported by Pi usage metadata: `$0.4511`
- Final validation:
  - `npm run test`: `10/10` tests passing
  - `npm run typecheck`: passed
  - `npm run build`: passed
- Worktrees removed after merge.
- Local Bead branches deleted after merge.
- No push performed.

## Beads and commits

| Bead | Branch | Commit | Result |
|---|---|---|---|
| B1 math utility | `build/b1-math` | `82848c3 Add clampScore utility` | PASS |
| B2 slug utility | `build/b2-slug` | `1c7e60c Add slugifyLabel utility` | PASS |

Merge commits on disposable `main`:

- `e34697e Merge build/b1-math`
- `4b8a34e Merge build/b2-slug`

## Comparison to historical Life Agent sessions

Historical successful prompted workflows were usually shaped like:

```text
small Bead coder → sandbox/worktree → focused validation → report merge-ready branch
then merge reviewer → rerun validation → fast-forward/verify/cleanup
```

Approximate historical observations:

- focused Bead coder: ~5-7 minutes and ~0.8M-1.2M tokens;
- merge gate: ~3 minutes and ~150k-250k tokens.

This demo is smaller than those production Beads, so the numbers are not a direct benchmark. It does show the package can reproduce the same workflow shape with clean worktrees, review, merge validation, and cleanup at very low overhead on a simple task.
