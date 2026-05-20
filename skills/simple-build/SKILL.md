---
name: simple-build
description: Runs a lightweight feature-build workflow with small Beads, independent sandbox/worktree coding lanes, RGR/TDD, acceptance-aware blocker review with Codex Review closeout, and a separate merge gate. Use when the user invokes /build, asks to build a feature end-to-end, or wants orchestrator/coder/reviewer/merge-agent discipline without heavyweight automation.
---

# Simple Build

## Operating invariant

`/build` ships through a small gated pipeline:

```text
plan Beads → run independent coder lanes in sandbox/worktrees → acceptance-aware blocker review + Codex Review closeout → fix blockers → merge gate validates, reviews, and integrates → evidence report
```

Coders never merge. The original acceptance-aware blocker review remains the source of truth. Reviewers use Codex Review as an extra second-model closeout, verify findings against the real code, accept only scoped blockers, and reject noise. A clean Codex result alone is never enough to PASS a Bead. The merge reviewer owns final validation, review closeout, and integration.

## Decision rules

- Use **one Bead** if the change touches the same files or has one obvious vertical slice.
- Use **parallel Beads** only when ownership is disjoint enough that branches should merge cleanly.
- Keep most builds to **1-4 Beads** and **2-3 parallel lanes**.
- Use RGR/TDD for behavior, API, data, persistence, and correctness-sensitive logic.
- Use targeted route/Playwright/visual proof for browser-visible changes.
- Keep a running `implementation-notes.md` or `implementation-notes.html` when the work requires decisions outside the spec, non-obvious tradeoffs, deviations from the plan, changed assumptions, or context the user should know. Prefer an existing project notes file if one exists; otherwise create one at the project root.
- Stop and ask the user if review blockers imply a larger design change.

## Review closeout contract

Use Codex Review for Bead reviews and merge closeout **when the `codex` CLI is installed and authenticated**. Prefer the `codex-review` skill/helper when it is available (reference: https://github.com/steipete/agent-scripts/blob/main/skills/codex-review/SKILL.md); otherwise run plain `codex review` commands directly.

If Codex is not installed, not authenticated, rate-limited, or otherwise unavailable, run the same second-opinion closeout through a fresh **x-hi / high-reasoning reviewer agent** instead. The fallback reviewer must be independent of the coder lane, receive the Bead contract and diff target, perform the same blocker-only review, and return accepted findings, rejected/noise findings, exact files inspected, and tests/proof to rerun. Document the Codex failure and the x-hi fallback command/agent used.

Codex/x-hi Review augments the old reviewer process; it does not replace it. A clean raw Codex result or clean x-hi pass is never enough to PASS a Bead unless the original acceptance-aware blocker review is also clean. Codex can be strong when the Bead contract is visible in tracked or changed files, but it is weaker when acceptance criteria live only in the orchestrator prompt. The reviewer must still apply the Bead acceptance criteria, proof requirements, and scope checks manually.

When Codex is available, follow this contract:

- Treat Codex output as advisory. Never blindly apply it.
- Verify every accepted finding by reading the real code path and adjacent files.
- Read dependency docs/source/types when the finding depends on external behavior.
- Reject speculative risks, unrealistic edge cases, broad rewrites, and fixes that over-complicate the codebase.
- Accept blockers only for the Bead's acceptance criteria, scope discipline, tests/proof gaps, validation freshness, security/privacy/secrets, or obvious integration breakage.
- Prefer small fixes at the right ownership boundary; no refactor unless it clearly fixes the blocker class.
- If a review-triggered fix changes code, rerun focused tests, rerun the acceptance-aware blocker review, and rerun Codex Review on the same target until there are no accepted/actionable findings.
- Do not push just to review.

Target selection for this workflow:

- Dirty local Bead patch: `codex review --uncommitted`.
- Committed Bead branch: `git fetch origin` then `codex review --base <base-ref>` where `<base-ref>` is the integration base, usually `origin/main` or the PR's actual base.
- Already-integrated single change: `codex review --commit HEAD`.
- Helper, if installed: prefer `~/.codex/skills/codex-review/scripts/codex-review` in auto/branch mode for branch work and `--mode commit --commit HEAD` for already-committed closeout.

For context efficiency, default to a fresh subagent/filter when available. Ask it to run Codex Review if `codex` is available; otherwise ask it to run the x-hi/high-reasoning fallback review. It must then perform the original acceptance/scope/proof review and return only accepted actionable findings, rejected findings with one-line reasons, exact files inspected, and tests/proof to rerun. If the Bead contract is not already review-visible, include it in the reviewer prompt; do not rely on raw `codex review` or a generic fallback prompt to infer it.

A Bead can pass review only when the acceptance-aware review has no blockers and the final Codex/x-hi closeout has no accepted/actionable findings, or every remaining finding is explicitly rejected with a scoped reason.

## Orchestrator checklist

1. State the invariant in one sentence.
2. Create a tiny Bead plan:
   - id/title;
   - allowed paths or owner area;
   - acceptance criteria;
   - proof required;
   - validation commands;
   - dependencies.
3. Choose the implementation notes location (`implementation-notes.md`, `implementation-notes.html`, or an existing equivalent) and include it in allowed paths when notes are needed.
4. Mark which Beads can run in parallel. Do not fake parallelism for overlapping files.
5. Create one sandbox/worktree branch per coder lane.
6. Assign coders with the template below.
7. Send finished Beads to fresh acceptance-aware blocker-only review with Codex Review closeout.
8. Send blockers back to the original coder for one tight fix loop, then rerun focused validation, acceptance-aware review, and Codex Review.
9. Send only PASS branches to a separate merge reviewer for final validation, Codex Review closeout, and integration.
10. Final response reports Beads, parallel lanes, review commands/verdicts, validation/proof, implementation notes location/summary, merge status, and risks.

## Coder assignment template

```text
Implement Bead <id> only.
Worktree/branch: <path and branch>
Allowed paths: <paths or owner area>
Acceptance: <bullets>
Proof required: <test/smoke/visual proof>
Validation: <commands>
Implementation notes: <path or "not needed">
Rules:
- use RGR/TDD where behavior is testable;
- run focused checks after meaningful code turns;
- update the implementation notes when you make a decision that was not in the spec, change an assumption, choose a tradeoff, deviate from the plan, or learn something the user should know;
- commit this Bead branch after validation passes;
- do not merge, push, or touch unrelated files;
- do not commit orchestration logs, sessions, review feedback, node_modules, `.env`, temp files, or local state.
Final report: changed files, implementation notes added/updated, proof artifacts, validation results, commit hash, risks.
```

## Reviewer assignment template

```text
Fresh acceptance-aware blocker-only review with Codex/x-hi closeout for Bead <id> on <branch/path>.
First run the original blocker review against the Bead acceptance criteria and proof requirements. If `codex` is installed and authenticated, use the codex-review skill/helper when available or run the matching plain command:
- dirty patch: codex review --uncommitted
- committed branch: git fetch origin && codex review --base <base-ref>
If Codex is unavailable, run the same closeout through a fresh x-hi/high-reasoning reviewer agent and document the Codex failure plus fallback agent/command used.
If Codex cannot receive the Bead instructions and the Bead contract is not visible in the repo/diff, treat it as a generic advisory scan only; do not let a clean Codex result override acceptance/proof blockers.
Check only:
- acceptance criteria;
- allowed-path/scope discipline;
- tests/proof would fail if behavior were missing;
- validation ran after the final code change;
- security/privacy/secrets;
- obvious integration risks;
- required implementation notes exist and are useful when the Bead made non-spec decisions, tradeoffs, changed assumptions, or plan deviations.
Verify every accepted Codex finding by reading the real code path. Reject noise, speculative risks, broad rewrites, and out-of-scope polish with a one-line reason.
Return PASS or BLOCKED with: old-review verdict, Codex Review command/result or x-hi fallback command/result, accepted blockers, rejected findings, exact required fixes, files inspected, and tests/proof to rerun. Do not broaden scope. Do not merge.
```

## Merge reviewer assignment template

```text
Merge only Beads with PASS review.
Main/integration checkout must be clean.
Integrate in dependency order.
Run final validation: focused proof, typecheck, build/check, and visual/e2e proof when relevant.
Run Codex Review closeout when `codex` is installed/authenticated, using the codex-review skill/helper when available or the correct target directly:
- branch/integration diff before merge: codex review --base <base-ref>
- already-integrated commit: codex review --commit HEAD
If Codex is unavailable, run an x-hi/high-reasoning reviewer-agent closeout over the same integration diff/commit and document the fallback. Formatting should happen before review. Tests and Codex/x-hi Review may run in parallel only when formatting is already stable.
If review or validation finds a blocker, stop and return it to the owning coder/Bead for a tight fix loop.
After a clean merge: verify main, cleanup worktrees/branches, push only if repo rules require it.
Final report: merged branches, validation output, Codex Review command/result or x-hi fallback command/result, implementation notes location/summary, proof artifacts, cleanup/push status, risks.
```

## Guardrails learned from evaluation

- Keep orchestration artifacts **outside** worker branch diffs unless explicitly part of the deliverable.
- Do not commit `.xbuild/run`, `.xbuild/sessions`, review feedback JSON, `node_modules`, `.env`, temp files, or local state.
- Prefer vertical Beads that own complete behavior over horizontal splits that cause merge conflicts.
- Do not create a separate proof branch that must merge multiple implementation branches unless an integration branch already exists.
- Codex/x-hi Review findings are inputs to judgment, not automatic work items; verify, filter, and keep fixes small.
- Codex Review is weaker than the original process for acceptance-specific requirements when the CLI cannot receive Bead instructions; x-hi fallback can also miss contract-specific requirements when under-prompted. Keep the old acceptance/proof review as the gate.
- A working app is not enough: failed validation, accepted review blockers, failed proof, or failed merge gate means the build is not done.

If the user asks why these rules exist, read `references/evidence.md`.
