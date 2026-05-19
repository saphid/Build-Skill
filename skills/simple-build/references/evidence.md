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

## Codex Review bakeoff notes

A small review bakeoff compared the original acceptance-aware blocker review with raw `codex review --uncommitted` on disposable fixtures. The implementation intentionally had passing tests but missed Bead acceptance requirements:

- `clampScore` did not throw required `RangeError`/`TypeError` cases and lacked proof for low values/invalid inputs.
- `slugifyLabel` handled only whitespace, not punctuation, edge hyphens, blank input, or all-punctuation input.

Special proof for why raw/slash review is weaker:

1. **Prompt injection is unavailable for the dirty-diff review target.** Running `codex review --uncommitted - < prompt` exits with: `error: the argument '--uncommitted' cannot be used with '[PROMPT]'`. So the review wrapper cannot directly receive the Bead acceptance criteria for the common uncommitted-worktree case.
2. **External-only acceptance criteria produce incomplete findings.** With the contract only in the orchestrator/reviewer prompt, raw `codex review --uncommitted` inspected the files and passing tests, but found only the generic slug punctuation issue. It missed the explicit clamp `RangeError`/`TypeError` requirements, blank/all-punctuation slug fallback, and proof insufficiency.
3. **Making the contract review-visible fixes Codex Review.** With the same acceptance criteria in `BEAD_ACCEPTANCE.md` as either a baseline tracked file or an untracked diff file, raw Codex Review caught the invalid clamp range, NaN handling, punctuation normalization, and `untitled` fallback blockers.
4. **The model can catch the issues when prompted outside review mode.** `codex exec` with the same acceptance prompt caught all blockers, proving the weakness is the review wrapper/context path rather than the underlying model's reasoning ability.

Conclusion: Codex Review is useful as an advisory second-model closeout and generic diff scan, and it becomes strong when the Bead contract is visible in repo context. It is worse as a replacement for the original acceptance-aware blocker review when acceptance criteria live only in orchestration prompts. Keep the old review as the gate; use Codex Review to augment it.
