# Build Skill for Pi

Build Skill is a small Pi package that adds a `/build` prompt and the `simple-build` skill.

It captures a lightweight feature-delivery workflow that works well with coding agents:

```text
plan Beads → run independent coder lanes in sandbox/worktrees → review each Bead → fix blockers → merge gate validates and integrates → evidence report
```

It is intentionally **not** a heavy orchestration framework. It is a compact protocol for agents and operators who want parallel worktree coding, RGR/TDD, blocker-only review, and a separate merge gate without a fragile status machine.

## Install

Install globally in Pi from GitHub:

```bash
pi install git:github.com/saphid/Build-Skill
```

Equivalent HTTPS form:

```bash
pi install https://github.com/saphid/Build-Skill
```

For a single trial run without adding it to settings:

```bash
pi -e git:github.com/saphid/Build-Skill
```

## Use

In interactive Pi, type:

```text
/build Build the thing you want
```

You can also invoke the skill directly:

```text
/skill:simple-build Build the thing you want
```

> Note: Pi prompt templates are designed for interactive `/` expansion. In non-interactive `pi -p` runs, invoke `/skill:simple-build ...` directly or pass the prompt text explicitly.

## What the skill enforces

- Small Beads with clear acceptance criteria.
- Parallel lanes only when file ownership is disjoint.
- One sandbox/worktree branch per coder lane.
- RGR/TDD for behavior, API, data, persistence, and correctness-sensitive logic.
- Fresh blocker-only review per Bead.
- Same-coder fix loop for blockers.
- Separate merge reviewer for final validation and integration.
- Evidence report with Beads, lanes, review verdicts, validation, proof, merge status, and risks.

## What it avoids

The skill deliberately avoids the failure modes of heavier automation:

- no branch-local orchestration logs unless they are deliverables;
- no committed session transcripts, review feedback JSON, `.xbuild/run`, `node_modules`, `.env`, or local state;
- no fake parallelism across overlapping files;
- no separate proof branch that must merge multiple implementation branches unless an integration branch already exists;
- no treating a working app as done when review, proof, or merge gates failed.

## Package layout

```text
.
├── package.json
├── prompts/
│   └── build.md
├── skills/
│   └── simple-build/
│       ├── SKILL.md
│       └── references/
│           └── evidence.md
├── examples/
│   └── smoke-fixture/
├── docs/
│   └── design.md
└── scripts/
    └── check-package.mjs
```

## Verify the package

```bash
npm run check
```

This validates the package manifest, skill frontmatter, prompt frontmatter, and expected files without installing dependencies.

## Smoke-test idea

Use the fixture in `examples/smoke-fixture` or any disposable repo and ask:

```text
/skill:simple-build Build two independent utilities in separate worktrees, test them, review them, then merge them into main without pushing.
```

## Security

Skills are instructions that can guide agents to run tools and edit files. Review `skills/simple-build/SKILL.md` before installing, especially if you use it in repositories with secrets or production deployment access.
