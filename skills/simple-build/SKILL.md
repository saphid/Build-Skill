---
name: simple-build
description: Runs a lightweight feature-build workflow with persistent planning-slice docs, small Beads, independent sandbox/worktree coding lanes, RGR/TDD, acceptance-aware blocker review with Codex Review or x-hi fallback closeout, optional gardening, and a separate merge gate.
---

# Simple Build

## Operating invariant

`/build` ships through a small gated pipeline:

```text
plan/reuse a persistent slice document → review the slice table → execute the smallest safe Beads in sandbox/worktrees → update plan findings → acceptance-aware blocker review + Codex/x-hi closeout → fix or use the escape hatch → optional gardening → merge gate validates, reviews, and integrates → evidence report
```

Coders never merge. The plan document, when present, is the source of truth for slice order and accumulated findings. The original acceptance-aware blocker review remains the source of truth for quality. Reviewers use Codex Review when Codex is available, otherwise a fresh x-hi/high-reasoning reviewer agent, as an extra second-model closeout. They verify findings against the real code, accept only scoped blockers, and reject noise. A clean Codex or x-hi result alone is never enough to PASS a Bead. The merge reviewer owns final validation, review closeout, and integration.

## Decision rules

- Use **one Bead** if the change touches the same files or has one obvious vertical slice.
- Use **parallel Beads** only when ownership is disjoint enough that branches should merge cleanly.
- Keep most builds to **1-4 Beads** and **2-3 parallel lanes**.
- Prefer a persistent plan document for multi-slice work, long-running autonomous work, or any request that already references a plan path.
- Use RGR/TDD for behavior, API, data, persistence, and correctness-sensitive logic.
- Use targeted route/Playwright/visual proof for browser-visible changes.
- Keep a running `implementation-notes.md` or `implementation-notes.html` when the work requires decisions outside the spec, non-obvious tradeoffs, deviations from the plan, changed assumptions, or context the user should know. Prefer an existing project notes file if one exists; otherwise create one at the project root.
- Stop and ask the user if review blockers imply a larger design change.

## Persistent plan document contract

When `/build` receives a path such as `docs/plans/foo.md`, first read the whole plan and any linked slice files. Treat the next pending slice as the Bead source of truth unless the plan is obviously stale or unsafe. If no plan exists but the work is larger than one obvious vertical slice, create or ask for a plan using the `planning-slices` skill before coding.

A useful plan document has:

```md
# <Feature> implementation plan

## Review in 2 minutes
Goal:
Non-goals:
Risky assumptions:
Slice order:
Expected high-risk files:
Validation strategy:
Reasons this plan might be wrong:

## Slice table
| Slice | Status | Depends on | Expected files | Validation |

## Global acceptance criteria
## Assumptions to verify
## Rejected / not doing

## Slice S1: <title>
Status: pending | in-progress | blocked | done
Purpose:
Expected files:
Context needed:
Steps:
Acceptance:
Validation:
Critical findings for next slice:
Blockers / escape-hatch notes:
```

Plan location rules:

- Prefer an existing project plan directory (`docs/plans/`, `.agents/plans/`, etc.) when the user expects the plan to be part of the repo.
- Otherwise keep orchestration-only plans outside worker branch diffs.
- If the plan is in the repo and is part of the requested deliverable, include it in the allowed paths and update only the relevant slice status/findings.
- If the plan is outside the repo or not part of a coder Bead, the orchestrator updates it between Beads.

## Slice ordering rules

Plan slices so the end goal is feasible, not merely decomposed:

1. Contracts, public API shapes, schemas, types, fixtures, and validators.
2. Core behavior and persistence/data logic.
3. Adapters, routes, services, and integration seams.
4. UI/UX or browser-visible surfaces.
5. Proof, migration/backfill, cleanup, and gardening.

Prefer vertical slices when horizontal bottom-up splits would create conflicts or leave the app untestable. In that case, each vertical slice should still start by locking its local contracts/types/validators before concrete implementation.

Each slice must list expected files, acceptance criteria, validation commands, dependencies, and proof. Do not fake parallelism across overlapping expected files.

## Critical findings and plan-update contract

After every slice or Bead, update the plan before starting the next slice:

- mark status (`done`, `blocked`, or still `pending` with reason);
- record critical findings for the next slice;
- record changed assumptions, discovered files, validation surprises, and rejected paths;
- add blocker/escape-hatch notes when the coder hit a dead end;
- keep the top-level review header accurate enough for a two-minute human scan.

This is separate from implementation notes: plan findings guide the next slice; implementation notes explain durable decisions and user-facing context.

## Escape hatch / anti-reward-hacking contract

Agents tend to reward-hack when they hit a dead end. Give them safe exits:

- If blocked, ambiguous, or failing the same validation repeatedly, stop and explain **how and why**.
- Make the smallest safe autonomous judgment when the path is clear.
- `No fix` is a valid fix when the requested change would be speculative, harmful, out of scope, or impossible under current constraints.
- Record the blocker, attempted paths, and proposed next action in the plan or implementation notes.
- Never fake validation, hide failing tests, broaden scope to look productive, or paper over a gate failure.
- Ask the user when the escape hatch implies a product/design decision or larger architecture change.

Reviewers should look for suspicious "looks good on paper" work: missing proof after final edits, ignored failures, broad rewrites for narrow blockers, unrecorded dead ends, or plan status that claims done without acceptance evidence.

## Gates and gardening

Long-running or autonomous `/goal`-style work needs hard gates so it cannot quietly move the project backwards:

- no new focused test failures;
- no known regression in targeted behavior;
- no perf drop when the task is performance-sensitive;
- validation must run after the final code change;
- browser-visible work needs route, e2e, or visual proof;
- repeated gate failure triggers the escape hatch instead of more blind fixing.

For non-trivial multi-slice builds, add a final **gardening** pass before merge when useful:

- remove dead code, junk artifacts, and over-complex scaffolding;
- simplify names and boundaries after the solution is known;
- ensure docs/tests/proof match the final design;
- run e2e/diff-path proof for the main user flows;
- update the plan summary and implementation notes.

Gardening is cleanup and verification, not a license to broaden scope.

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
- If a review-triggered fix changes code, rerun focused tests, rerun the acceptance-aware blocker review, and rerun Codex Review on the same target (or x-hi fallback if Codex becomes unavailable) until there are no accepted/actionable findings.
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
2. If a plan path is provided, read it and identify the next pending slice. If no plan exists and the work is multi-slice, create one with `planning-slices` or ask the user.
3. When a plan exists, review its two-minute header, assumptions, non-goals, and slice table. Remove or challenge speculative assumptions before coding.
4. Create a tiny Bead plan from the current slice or obvious vertical unit:
   - id/title;
   - source plan/slice, if any;
   - allowed paths or owner area;
   - acceptance criteria;
   - proof required;
   - validation commands;
   - dependencies;
   - plan-update responsibility.
5. Choose the implementation notes location (`implementation-notes.md`, `implementation-notes.html`, or an existing equivalent) and include it in allowed paths when notes are needed.
6. Mark which Beads can run in parallel. Do not fake parallelism for overlapping files.
7. Create one sandbox/worktree branch per coder lane.
8. Assign coders with the template below.
9. Send finished Beads to fresh acceptance-aware blocker-only review with Codex Review closeout when Codex is available, otherwise x-hi/high-reasoning fallback closeout.
10. Send blockers back to the original coder for one tight fix loop, then rerun focused validation, acceptance-aware review, and the same Codex/x-hi closeout.
11. When a plan exists, update it with status, critical findings, blockers, changed assumptions, and validation surprises before starting the next slice.
12. Run a gardening pass for non-trivial multi-slice work when useful.
13. Send only PASS branches to a separate merge reviewer for final validation, Codex/x-hi closeout, and integration.
14. Final response reports plan path/status, Beads, parallel lanes, review commands/verdicts, validation/proof, implementation notes location/summary, merge status, and risks.

## Coder assignment template

```text
Implement Bead <id> only.
Worktree/branch: <path and branch>
Plan/slice: <plan path + slice id, or "none">
Allowed paths: <paths or owner area>
Acceptance: <bullets>
Proof required: <test/smoke/visual proof>
Validation: <commands>
Implementation notes: <path or "not needed">
Plan update: <update relevant slice status/findings, or "orchestrator updates">
Rules:
- use RGR/TDD where behavior is testable;
- start with contracts/types/validators for this slice before concrete implementation when applicable;
- run focused checks after meaningful code turns;
- if blocked, ambiguous, or repeating failures, use the escape hatch: explain how/why, make only the smallest safe autonomous judgment, and record the blocker; "no fix" is valid when appropriate;
- update the implementation notes when you make a decision that was not in the spec, change an assumption, choose a tradeoff, deviate from the plan, or learn something the user should know;
- update the plan slice only if it is in allowed paths and plan updates are assigned to you; record critical findings for the next slice;
- commit this Bead branch after validation passes;
- do not merge, push, or touch unrelated files;
- do not commit orchestration logs, sessions, review feedback, node_modules, `.env`, temp files, or local state.
Final report: changed files, plan updates/findings, implementation notes added/updated, proof artifacts, validation results, commit hash, risks or escape-hatch notes.
```

## Reviewer assignment template

```text
Fresh acceptance-aware blocker-only review with Codex/x-hi closeout for Bead <id> on <branch/path>.
Plan/slice: <plan path + slice id, or "none">.
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
- plan status/findings were updated when assigned, including critical findings for the next slice;
- escape-hatch notes exist when the coder hit a dead end, repeated failures, or used "no fix";
- required implementation notes exist and are useful when the Bead made non-spec decisions, tradeoffs, changed assumptions, or plan deviations.
Verify every accepted Codex or x-hi finding by reading the real code path. Reject noise, speculative risks, broad rewrites, and out-of-scope polish with a one-line reason.
Return PASS or BLOCKED with: old-review verdict, Codex Review command/result or x-hi fallback command/result, accepted blockers, rejected findings, exact required fixes, files inspected, plan/escape-hatch assessment, and tests/proof to rerun. Do not broaden scope. Do not merge.
```

## Merge reviewer assignment template

```text
Merge only Beads with PASS review.
Main/integration checkout must be clean.
Integrate in dependency order from the plan/slice table when present.
For non-trivial multi-slice work, run or verify the gardening pass before final merge: cleanup, simplification, e2e/diff-path proof, and plan/notes summary updates.
Run final validation: focused proof, typecheck, build/check, and visual/e2e proof when relevant.
Run Codex Review closeout when `codex` is installed/authenticated, using the codex-review skill/helper when available or the correct target directly:
- branch/integration diff before merge: codex review --base <base-ref>
- already-integrated commit: codex review --commit HEAD
If Codex is unavailable, run an x-hi/high-reasoning reviewer-agent closeout over the same integration diff/commit and document the fallback. Formatting should happen before review. Tests and Codex/x-hi Review may run in parallel only when formatting is already stable.
If review or validation finds a blocker, stop and return it to the owning coder/Bead for a tight fix loop, or use the escape hatch if the blocker implies a larger decision.
After a clean merge: verify main, cleanup worktrees/branches, push only if repo rules require it.
Final report: merged branches, plan path/status summary, validation output, Codex Review command/result or x-hi fallback command/result, implementation notes location/summary, proof artifacts, cleanup/push status, risks.
```

## Guardrails learned from evaluation

- Keep orchestration artifacts **outside** worker branch diffs unless explicitly part of the deliverable.
- Do not commit `.xbuild/run`, `.xbuild/sessions`, review feedback JSON, `node_modules`, `.env`, temp files, or local state.
- Prefer vertical Beads that own complete behavior over horizontal splits that cause merge conflicts.
- Do not create a separate proof branch that must merge multiple implementation branches unless an integration branch already exists.
- Keep persistent plan docs concise, reviewable, and updated; stale or over-detailed plans are worse than no plan.
- Critical findings for the next slice belong in the plan before the next slice starts.
- Reward-hacking is a blocker: fake validation, hidden failures, and broad rewrites require review/fix or an escape-hatch stop.
- Codex/x-hi Review findings are inputs to judgment, not automatic work items; verify, filter, and keep fixes small.
- Codex Review is weaker than the original process for acceptance-specific requirements when the CLI cannot receive Bead instructions; x-hi fallback can also miss contract-specific requirements when under-prompted. Keep the old acceptance/proof review as the gate.
- A working app is not enough: failed validation, accepted review blockers, failed proof, stale plan status, or failed merge gate means the build is not done.

If the user asks why these rules exist, read `references/evidence.md`.
