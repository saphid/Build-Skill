---
name: planning-slices
description: Writes persistent bottom-up implementation slice plans for coding agents. Use when the user asks to plan a feature, create planning slices, prepare a docs/plans implementation plan, or make a feasible plan for /build or /goal to execute later.
---

# Planning Slices

Use this skill to create a durable implementation plan that another agent can execute one slice at a time. Do not implement code unless the user explicitly asks you to; the output is a plan document plus a concise summary.

## Core idea

A good planning-slices run optimizes for a feasible end goal, not a pretty task list:

```text
lots of user detail + repo facts → concise review header → ordered implementation slices → expected files + validation per slice → critical-findings slots for the next slice
```

The plan should be explicit enough that `/build docs/plans/<plan>.md` or `/goal implement docs/plans/<plan>.md` can continue from it without re-inventing the work.

## Planning workflow

1. Read the user's feature request carefully. Preserve constraints, examples, edge cases, and non-goals.
2. Inspect the repo just enough to identify likely contracts, types, validators, boundaries, tests, and proof commands. Do not scan the whole repo blindly.
3. Choose the plan path:
   - prefer an existing project plan directory such as `docs/plans/` or `.agents/plans/`;
   - otherwise create `docs/plans/<yyyy-mm-dd>-<slug>.md` when the user wants a repo-visible plan;
   - use an external/non-committed path only when the user or project conventions require orchestration artifacts outside the repo.
4. Write a plan with a two-minute review header, a slice table, global acceptance criteria, assumptions, rejected ideas, and one section per slice.
5. Order slices bottom-up: contracts/types/schemas/validators first, then core behavior, then adapters/routes/services, then UI/integration, then proof/gardening.
6. Prefer the fewest useful slices. Most plans should have 2-6 slices. Use one slice for one obvious vertical change.
7. Add expected files, context needs, acceptance criteria, validation commands, dependencies, and proof to every slice.
8. Add a blank or seeded **Critical findings for next slice** field to every slice so executors can carry discoveries forward.
9. Add escape-hatch guidance for risky or ambiguous slices: how to stop, what to report, and when `no fix` is valid.
10. Final response should state the plan path, slice count, review risks, and the exact command to execute it, usually `/build <plan-path>`.

## Slice design rules

- Make the proper path visible. Agents reward-hack when the real path is hidden or impossible.
- Each slice should be independently understandable when loaded alone.
- Each slice should have clear ownership and expected files. If expected files overlap, do not mark slices parallel.
- Each slice should include validation that would fail if the slice's behavior is missing.
- Put durable decisions and assumptions in the plan before execution starts.
- Put speculative ideas in **Rejected / not doing** unless they are required.
- Keep the top of the plan short enough for a quick human review.
- Do not bury critical risks in long prose.

## Required plan template

```md
# <Feature> implementation plan

## Review in 2 minutes

**Goal:** <one paragraph>
**Non-goals:** <bullets>
**Risky assumptions:** <bullets>
**Slice order:** S1 → S2 → ...
**Expected high-risk files:** <bullets>
**Validation strategy:** <commands/proof summary>
**Reasons this plan might be wrong:** <bullets>

## Slice table

| Slice | Status | Depends on | Parallel? | Expected files | Validation |
|---|---|---|---|---|---|
| S1 <title> | pending | none | no | `<paths>` | `<commands>` |

## Global acceptance criteria

- <observable end-state requirement>

## Assumptions to verify

- <assumption and where it should be verified>

## Rejected / not doing

- <explicitly out-of-scope idea and why>

## Slice S1: <title>

**Status:** pending
**Purpose:** <why this slice exists>
**Depends on:** none
**Can run in parallel with:** none
**Expected files:**
- `<path>` — <expected change>

**Context needed:**
- <types/call sites/docs/tests the executor should read>

**Steps:**
- [ ] <small step>

**Acceptance:**
- <slice-specific requirement>

**Validation:**
- `<command>` — <what it proves>

**Critical findings for next slice:**
- <leave blank or seed known handoff details>

**Blockers / escape-hatch notes:**
- If <risk> happens, stop and report <needed decision>; `no fix` is valid if <condition>.
```

## Final response format

```text
Created plan: <path>
Slices: <count and titles>
Review risks: <top 1-3>
Execute with: /build <path>
```
