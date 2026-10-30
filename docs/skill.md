# Agent Skills (OpenCode)

This project uses skills installed under `.agents/skills/` (or a compatible path).

## Project Context

- Read `docs/PRD.md`, `docs/SRS.md`, and `docs/Technical_Requirements.md` before planning or implementing any feature.
- Design files are in `docs/design/`.
- Keep implementation consistent with these documents. Ask before deviating from them.

## Core Rules

- If a task matches a skill, invoke it with the `skill` tool before acting.
- Follow the skill workflow strictly; do not partially apply it.
- Never skip required steps such as spec, plan, or test when a skill demands them.

## Intent → Skill Mapping

- Feature / new functionality → `spec-driven-development`, then `incremental-implementation` and `test-driven-development`
- Planning / breakdown → `planning-and-task-breakdown`
- Bug / failure / unexpected behavior → `debugging-and-error-recovery`
- Code review → `code-review-and-quality`
- Refactoring / simplification → `code-simplification`
- API or interface design → `api-and-interface-design`
- UI work → `frontend-ui-engineering`

## Execution Model

1. Determine if any skill applies (even a small chance).
2. Load the skill with `skill({ name: "<skill-name>" })`.
3. Follow the skill workflow exactly.
4. Only proceed to implementation once required steps are complete.