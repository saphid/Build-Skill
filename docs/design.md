# Design notes

Build Skill is deliberately small. It packages a workflow, not an autonomous build system.

## Skill-shaped decisions

- The main `SKILL.md` contains only operating rules and templates.
- Historical evidence lives in `references/evidence.md` and is loaded only if the user asks why the workflow is shaped this way.
- The `/build` prompt simply routes the request into `/skill:simple-build` with a concise checklist.
- There are no executable orchestration scripts because the fragile part is judgment: choosing Beads, deciding safe parallelism, and applying blocker-only review.

## Invariant

```text
plan Beads → run independent coder lanes in sandbox/worktrees → review each Bead → fix blockers → merge gate validates and integrates → evidence report
```

Coders never merge. Reviewers do not broaden scope. The merge reviewer owns final validation and integration.

## When to use one Bead

Use one Bead when the change has one vertical slice, touches the same files, or would create conflict-prone horizontal splits.

## When to parallelize

Parallelize only when each lane has clear ownership and likely clean merge boundaries, such as independent modules, independent UI surfaces, or separate test/proof work that does not need to merge multiple implementation branches.
