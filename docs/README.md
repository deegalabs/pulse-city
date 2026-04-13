# docs/ — Project Documentation

Internal documentation for **pulse.city** development.

## Structure

```
docs/
  architecture.md         # System architecture and data flow
  stack.md                # Stack choices and rationale
  roadmap.md              # Phases, milestones, target dates
  sprints/                # Sprint-by-sprint execution tracking
  specs/                  # Feature specifications
  decisions/              # Architecture Decision Records (ADRs)
```

## Commit convention

```
feat: add autopilot mode with 30s evolve cycle
fix: spectrum analyzer not receiving data
docs: update architecture diagram
spec: define chat autonomy model
arch: document StrudelMirror decision
plan: sprint-02 tasks and acceptance criteria
refactor: extract AI backend module
style: adjust spectrum gradient colors
chore: update dependencies
```

## Workflow

1. Spec goes in `specs/` before implementation
2. Sprint tasks reference specs
3. Decisions are logged in `decisions/` when non-obvious choices are made
4. Each sprint file is updated as tasks complete
