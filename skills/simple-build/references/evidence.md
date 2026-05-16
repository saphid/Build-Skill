# Simple Build evidence notes

Use this only when the user asks why the Simple Build workflow is shaped this way.

## Historical sessions that worked well

The most reliable Life Agent sessions used small explicit prompts:

- one Bead per coder;
- one sandbox/worktree per Bead;
- explicit allowed paths, acceptance criteria, proof, and validation;
- coder reports a merge-ready branch and never merges;
- fresh reviewer checks blockers only;
- merge reviewer reruns validation, fast-forwards, verifies main, cleans up, and pushes.

Observed historical pattern, approximately:

- focused Bead coder: about 5-7 minutes and ~0.8M-1.2M tokens;
- merge gate: about 3 minutes and ~150k-250k tokens.

## Benchmark lessons

The heavier orchestrated benchmark did not beat the historical prompt pattern. It failed mainly from avoidable mechanics:

- orchestration logs/session files got committed into worker branches;
- `node_modules` symlinks leaked into branch indexes;
- proof lanes had to merge overlapping implementation branches and hit conflicts;
- concurrent status JSON writes corrupted state;
- some variants created extra ceremony without improving quality.

Therefore the skill keeps the workflow as a small protocol instead of a status-machine framework.
