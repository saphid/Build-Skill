---
name: simple-build
description: Runs a lightweight feature-build workflow with small Beads, independent sandbox/worktree coding lanes, RGR/TDD, blocker-only review, and a separate merge gate. Use when the user invokes /build, asks to build a feature end-to-end, or wants orchestrator/coder/reviewer/merge-agent discipline without heavyweight automation.
---

# Simple Build

## Operating invariant

`/build` ships through a small gated pipeline:

```text
plan Beads → run independent coder lanes in sandbox/worktrees → review each Bead → fix blockers → merge gate validates and integrates → evidence report
```

Coders never merge. Reviewers do not broaden scope. The merge reviewer owns final validation and integration.

## Decision rules

- Use **one Bead** if the change touches the same files or has one obvious vertical slice.
- Use **parallel Beads** only when ownership is disjoint enough that branches should merge cleanly.
- Keep most builds to **1-4 Beads** and **2-3 parallel lanes**.
- Use RGR/TDD for behavior, API, data, persistence, and correctness-sensitive logic.
- Use targeted route/Playwright/visual proof for browser-visible changes.
- Stop and ask the user if review blockers imply a larger design change.

## Orchestrator checklist

1. State the invariant in one sentence.
2. Create a tiny Bead plan:
   - id/title;
   - allowed paths or owner area;
   - acceptance criteria;
   - proof required;
   - validation commands;
   - dependencies.
3. Mark which Beads can run in parallel. Do not fake parallelism for overlapping files.
4. Create one sandbox/worktree branch per coder lane.
5. Assign coders with the template below.
6. Send finished Beads to fresh blocker-only review.
7. Send blockers back to the original coder for one tight fix loop.
8. Send only PASS branches to a separate merge reviewer.
9. Final response reports Beads, parallel lanes, review verdicts, validation/proof, merge status, and risks.

## Coder assignment template

```text
Implement Bead <id> only.
Worktree/branch: <path and branch>
Allowed paths: <paths or owner area>
Acceptance: <bullets>
Proof required: <test/smoke/visual proof>
Validation: <commands>
Rules:
- use RGR/TDD where behavior is testable;
- run focused checks after meaningful code turns;
- commit this Bead branch after validation passes;
- do not merge, push, or touch unrelated files;
- do not commit orchestration logs, sessions, review feedback, node_modules, or local state.
Final report: changed files, proof artifacts, validation results, commit hash, risks.
```

## Reviewer assignment template

```text
Fresh blocker-only review for Bead <id> on <branch/path>.
Check only:
- acceptance criteria;
- allowed-path/scope discipline;
- tests/proof would fail if behavior were missing;
- validation ran after the final code change;
- security/privacy/secrets;
- obvious integration risks.
Return PASS or BLOCKED with exact required fixes. Do not broaden scope. Do not merge.
```

## Merge reviewer assignment template

```text
Merge only Beads with PASS review.
Main/integration checkout must be clean.
Integrate in dependency order.
Run final validation: focused proof, typecheck, build/check, and visual/e2e proof when relevant.
Stop on first blocker.
After a clean merge: verify main, cleanup worktrees/branches, push only if repo rules require it.
Final report: merged branches, validation output, proof artifacts, cleanup/push status, risks.
```

## Guardrails learned from evaluation

- Keep orchestration artifacts **outside** worker branch diffs unless explicitly part of the deliverable.
- Do not commit `.xbuild/run`, `.xbuild/sessions`, review feedback JSON, `node_modules`, `.env`, temp files, or local state.
- Prefer vertical Beads that own complete behavior over horizontal splits that cause merge conflicts.
- Do not create a separate proof branch that must merge multiple implementation branches unless an integration branch already exists.
- A working app is not enough: failed review, failed proof, or failed merge gate means the build is not done.

If the user asks why these rules exist, read `references/evidence.md`.
