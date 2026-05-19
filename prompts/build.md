---
description: Lightweight orchestrated build with Beads, worktree coders, acceptance review, Codex Review closeout, and merge gate
argument-hint: "<what to build>"
---
Use `/skill:simple-build` for this request.

Build request:

$ARGUMENTS

Run the Simple Build workflow:

1. State the invariant.
2. Split into the fewest useful Beads.
3. Pick an implementation notes location when useful: keep a running `implementation-notes.md` or `implementation-notes.html` for decisions not in the spec, changes, tradeoffs, plan deviations, and context the user should know.
4. Parallelize only independent/disjoint Beads.
5. Give each coder one worktree branch, allowed paths, acceptance, proof, validation, implementation-notes path, RGR/TDD, and `do not merge`.
6. Use fresh acceptance-aware blocker-only review per Bead, plus Codex Review closeout, including notes coverage when non-spec decisions were made.
7. Send blockers back to the original coder for one tight fix loop, then rerun focused validation, acceptance review, and Codex Review.
8. Use a separate merge reviewer for final validation, Codex Review closeout, and integration.
9. Report Beads, parallel lanes, old-review verdicts, Codex Review commands/results, checks/proof, implementation notes location/summary, merge status, and risks.
