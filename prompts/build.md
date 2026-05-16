---
description: Lightweight orchestrated build with Beads, worktree coders, review, and merge gate
argument-hint: "<what to build>"
---
Use `/skill:simple-build` for this request.

Build request:

$ARGUMENTS

Run the Simple Build workflow:

1. State the invariant.
2. Split into the fewest useful Beads.
3. Parallelize only independent/disjoint Beads.
4. Give each coder one worktree branch, allowed paths, acceptance, proof, validation, RGR/TDD, and `do not merge`.
5. Use fresh blocker-only review per Bead.
6. Send blockers back to the original coder for one tight fix loop.
7. Use a separate merge reviewer for final validation/integration.
8. Report Beads, parallel lanes, review verdicts, checks/proof, merge status, and risks.
