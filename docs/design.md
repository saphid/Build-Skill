# Design notes

Build Skill is deliberately small. It packages a workflow, not an autonomous build system. The package now has two halves: `planning-slices` writes a durable implementation plan, and `simple-build` executes the smallest safe Beads from that plan or from a direct user request.

## Skill-shaped decisions

- `planning-slices/SKILL.md` creates persistent bottom-up plan documents for `/build` or `/goal` to execute later.
- The main `simple-build/SKILL.md` contains operating rules and templates for execution, review, gardening, and merge.
- Historical evidence lives in `references/evidence.md` and is loaded only if the user asks why the workflow is shaped this way.
- The `/build` prompt simply routes the request into `/skill:simple-build` with a concise checklist.
- Persistent plan docs are execution artifacts: they keep the slice table, status, expected files, validation, and critical findings for the next slice. They may live in `docs/plans/` when the user wants repo-visible plans, or outside worker diffs when they are orchestration-only.
- Implementation notes are a lightweight project artifact, not orchestration state: agents should keep `implementation-notes.md` or `implementation-notes.html` updated when they make decisions not in the spec, change assumptions, choose tradeoffs, deviate from the plan, or learn context the user should know.
- Review keeps the original acceptance-aware blocker gate and adds Codex Review as a second-model closeout when Codex is available, otherwise an x-hi/high-reasoning fallback closeout; the reviewing agent still owns judgment: verify findings, accept only scoped blockers, reject noise, and rerun review after fixes.
- Escape hatches are explicit: blocked agents explain how/why, make only the smallest safe autonomous judgment, and can report `no fix` when fixing would be speculative, harmful, out of scope, or impossible.
- Long-running runs are gated so they cannot quietly move backwards: no new focused failures, no targeted regressions, validation after final edits, and e2e/visual proof when relevant.
- Non-trivial multi-slice builds can add a final gardening pass for cleanup, simplification, diff-path/e2e proof, and plan/notes summary updates.
- There are no executable orchestration scripts because the fragile part is judgment: choosing Beads, deciding safe parallelism, and applying blocker-only review.

## Invariant

```text
create/reuse a persistent slice plan → run independent coder lanes in sandbox/worktrees → update plan findings → acceptance-aware blocker review + Codex/x-hi closeout → fix or escape → optional gardening → merge gate validates, reviews, and integrates → evidence report
```

Coders never merge. The plan document, when present, is the source of truth for slice order and accumulated findings. Reviewers do not broaden scope. Reviewers use Codex Review when `codex` is installed/authenticated, otherwise a fresh x-hi/high-reasoning reviewer agent, treat second-model output as advisory, and return PASS only after the original acceptance/proof review has no blockers and no Codex/x-hi finding remains accepted/actionable. The merge reviewer owns final validation, Codex/x-hi closeout, gardening verification, and integration.

## Plan document shape

Plans start with a two-minute review header, then a slice table and per-slice sections. Each slice lists expected files, context needed, steps, acceptance, validation, dependencies, critical findings for the next slice, and blockers/escape-hatch notes. This makes the plan auditable by humans and reloadable by agents without relying on hidden chat context.

## When to use one Bead

Use one Bead when the change has one vertical slice, touches the same files, or would create conflict-prone horizontal splits.

## When to parallelize

Parallelize only when each lane has clear ownership and likely clean merge boundaries, such as independent modules, independent UI surfaces, or separate test/proof work that does not need to merge multiple implementation branches. If plan slices list overlapping expected files, execute them serially even when they look conceptually separate.
