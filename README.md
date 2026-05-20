# Build Skill for Pi

Build Skill is a small Pi package that adds a `/build` prompt and the `simple-build` skill.

It captures a lightweight feature-delivery workflow that works well with coding agents:

```text
plan Beads → run independent coder lanes in sandbox/worktrees → acceptance-aware blocker review + Codex/x-hi closeout → fix blockers → merge gate validates, reviews, and integrates → evidence report
```

It is intentionally **not** a heavy orchestration framework. It is a compact protocol for agents and operators who want parallel worktree coding, RGR/TDD, acceptance-aware blocker-only review augmented by Codex Review or x-hi fallback closeout, and a separate merge gate without a fragile status machine.

## Install

Install globally in Pi from GitHub:

```bash
pi install git:github.com/saphid/build-skill
```

Equivalent HTTPS form:

```bash
pi install https://github.com/saphid/build-skill
```

For a single trial run without adding it to settings:

```bash
pi -e git:github.com/saphid/build-skill
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
- Fresh acceptance-aware blocker-only review per Bead, with Codex Review as a second-model closeout when Codex is available, otherwise x-hi/high-reasoning fallback closeout.
- Same-coder fix loop for blockers, followed by focused validation, acceptance review, and Codex/x-hi closeout reruns.
- Separate merge reviewer for final validation, Codex/x-hi closeout, and integration.
- A running `implementation-notes.md` or `implementation-notes.html` when the build involves decisions outside the spec, changed assumptions, tradeoffs, plan deviations, or other context the user should know.
- Evidence report with Beads, lanes, old-review verdicts, Codex Review or x-hi fallback commands/results, validation, proof, implementation notes summary, merge status, and risks.

## What it avoids

The skill deliberately avoids the failure modes of heavier automation:

- no branch-local orchestration logs unless they are deliverables;
- no committed session transcripts, review feedback JSON, `.xbuild/run`, `node_modules`, `.env`, or local state;
- no fake parallelism across overlapping files;
- no separate proof branch that must merge multiple implementation branches unless an integration branch already exists;
- no blindly applying Codex/x-hi findings without reading the code and filtering for scoped blockers;
- no treating a clean raw Codex/x-hi review result as a substitute for acceptance/proof review;
- no treating a working app as done when validation, accepted review blockers, proof, or merge gates failed.

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

## Demo evidence

A real package-loaded demo run is summarized in [`docs/demo.md`](docs/demo.md).

## Smoke-test idea

Use the fixture in `examples/smoke-fixture` or any disposable repo. First install fixture dependencies:

```bash
cd examples/smoke-fixture
npm install
```

Then ask:

```text
/skill:simple-build Build two independent utilities in separate worktrees, test them, run acceptance-aware blocker review plus Codex Review or x-hi fallback closeout, then merge them into main without pushing.
```

## Security

Skills are instructions that can guide agents to run tools and edit files. Review `skills/simple-build/SKILL.md` before installing, especially if you use it in repositories with secrets or production deployment access.
