---
description: Lightweight orchestrated build from a direct request or persistent slice plan, with Beads, worktree coders, plan updates, acceptance review, Codex Review or x-hi fallback closeout, optional gardening, and merge gate
argument-hint: "<what to build>"
---
Use `/skill:simple-build` for this request.

Build request:

$ARGUMENTS

Run the Simple Build workflow:

1. State the invariant.
2. If the request is a plan path, read the whole plan and identify the next pending slice. If the request is multi-slice and has no plan, create or ask for a planning-slices plan first.
3. When a plan exists, review its two-minute header, assumptions, non-goals, slice order, validation strategy, and reasons it might be wrong.
4. Split the current work into the fewest useful Beads, ordered from contracts/types/validators toward concrete implementation, integration/UI, proof, and gardening.
5. Pick an implementation notes location when useful: keep a running `implementation-notes.md` or `implementation-notes.html` for decisions not in the spec, changes, tradeoffs, plan deviations, and context the user should know.
6. Parallelize only independent/disjoint Beads.
7. Give each coder one worktree branch, allowed paths, acceptance, proof, validation, implementation-notes path, plan-update responsibility, RGR/TDD, escape-hatch rules, and `do not merge`.
8. When a plan exists, update it after each slice/Bead with status, validation surprises, changed assumptions, blockers, and critical findings for the next slice.
9. Use fresh acceptance-aware blocker-only review per Bead, plus Codex Review closeout when Codex is available, otherwise x-hi/high-reasoning fallback closeout, including notes/plan coverage when non-spec decisions were made.
10. Send blockers back to the original coder for one tight fix loop, then rerun focused validation, acceptance review, and the same Codex/x-hi closeout. Use the escape hatch instead of reward-hacking when blocked or repeating failures.
11. Run an optional gardening pass for non-trivial multi-slice work: cleanup, simplification, e2e/diff-path proof, and plan/notes summary updates.
12. Use a separate merge reviewer for final validation, Codex/x-hi closeout, and integration.
13. Report plan path/status, Beads, parallel lanes, old-review verdicts, Codex Review or x-hi fallback commands/results, checks/proof, implementation notes location/summary, merge status, and risks.
