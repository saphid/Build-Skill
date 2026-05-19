# Design notes

Build Skill is deliberately small. It packages a workflow, not an autonomous build system.

## Skill-shaped decisions

- The main `SKILL.md` contains only operating rules and templates.
- Historical evidence lives in `references/evidence.md` and is loaded only if the user asks why the workflow is shaped this way.
- The `/build` prompt simply routes the request into `/skill:simple-build` with a concise checklist.
- Implementation notes are a lightweight project artifact, not orchestration state: agents should keep `implementation-notes.md` or `implementation-notes.html` updated when they make decisions not in the spec, change assumptions, choose tradeoffs, deviate from the plan, or learn context the user should know.
- Review keeps the original acceptance-aware blocker gate and adds Codex Review as a second-model closeout; the reviewing agent still owns judgment: verify findings, accept only scoped blockers, reject noise, and rerun review after fixes.
- There are no executable orchestration scripts because the fragile part is judgment: choosing Beads, deciding safe parallelism, and applying blocker-only review.

## Invariant

```text
plan Beads → run independent coder lanes in sandbox/worktrees → acceptance-aware blocker review + Codex Review closeout → fix blockers → merge gate validates, reviews, and integrates → evidence report
```

Coders never merge. Reviewers do not broaden scope. Reviewers use the `codex-review` skill when available, treat Codex output as advisory, and return PASS only after the original acceptance/proof review has no blockers and no Codex finding remains accepted/actionable. The merge reviewer owns final validation, Codex Review closeout, and integration.

## When to use one Bead

Use one Bead when the change has one vertical slice, touches the same files, or would create conflict-prone horizontal splits.

## When to parallelize

Parallelize only when each lane has clear ownership and likely clean merge boundaries, such as independent modules, independent UI surfaces, or separate test/proof work that does not need to merge multiple implementation branches.
