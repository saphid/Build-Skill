---
description: Create a persistent bottom-up implementation slice plan for /build or /goal
argument-hint: "<feature details>"
---
Use `/skill:planning-slices` for this request.

Planning request:

$ARGUMENTS

Create a persistent implementation plan:

1. Preserve the user's details, constraints, examples, edge cases, and non-goals.
2. Inspect the repo only enough to identify likely contracts, types, validators, boundaries, tests, and proof commands.
3. Write the plan to an existing project plan directory when available, usually `docs/plans/<yyyy-mm-dd>-<slug>.md`.
4. Include a two-minute review header: goal, non-goals, risky assumptions, slice order, high-risk files, validation strategy, and reasons the plan might be wrong.
5. Split the work into the fewest useful implementation slices, ordered bottom-up from contracts/types/validators toward concrete implementation, integration/UI, proof, and gardening.
6. For each slice include expected files, context needed, acceptance, validation, dependencies, and a `Critical findings for next slice` field.
7. Include escape-hatch guidance for ambiguous or risky slices, including when `no fix` is valid.
8. Do not implement the feature. Final response: plan path, slice count/titles, top review risks, and `Execute with: /build <path>`.
