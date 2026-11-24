# Spec-Driven Delivery with OpenSpec, Gherkin and GitHub Copilot

_A one-day workshop of four GitHub Skills exercises. Teams take a business intent through the spec-driven loop:
question it, write it as an OpenSpec change with Given/When/Then scenarios, deliver it with GitHub Copilot against
automated evidence, and decide honestly whether their next problem is ready to build._

**AI drafts; humans decide.** Every exercise uses fictional organizations and synthetic data only.

## The exercises

Take them in order. Each one runs in its own repository, with a ready-to-use [GitHub Codespaces](https://docs.github.com/en/codespaces/overview)
environment and step-by-step guidance from Mona in an issue.

| # | Exercise | You will | Time |
| --- | --- | --- | --- |
| 1 | [Trace the Loop from Intent to Evidence](https://github.com/samueltauil/spec-driven-trace-the-loop) | Follow one business rule from intent to passing evidence, and find what green tests do not prove | About 35 minutes |
| 2 | [Find the Missing Rules Before You Build](https://github.com/samueltauil/spec-driven-find-missing-rules) | Question a thin epic, then write the missing rules as a valid OpenSpec change | About 45 minutes |
| 3 | [Deliver an Approved Behavior with Copilot](https://github.com/samueltauil/spec-driven-deliver-a-behavior) | Go from failing tests to a merged, archived change, with a person at every gate | About 75 minutes |
| 4 | [Draft Your First Spec](https://github.com/samueltauil/spec-driven-first-spec) | Frame an unfamiliar problem as a validated change, and decide whether it is ready to build | About 60 minutes |

## Who it is for

Mixed-role delivery teams: product owners, business analysts, testers, developers and architects who use GitHub
for everyday work. Only exercise 3 changes code, and Copilot does most of that work.

You need:

- A GitHub account that can create public repositories and use GitHub Codespaces. Personal accounts include monthly free usage.
- [GitHub Copilot](https://github.com/features/copilot) with Copilot Chat. Copilot Free works, but its monthly allowance is limited, and the full
  workshop uses many prompts. A paid plan avoids running out partway through.
- Comfort with branches, commits and pull requests. If they are new to you, start with
  [Introduction to GitHub](https://github.com/skills/introduction-to-github).

## For facilitators

- [Workshop plan](workshop-plan.md): objectives, agenda, spacing, evaluation and risks.
- [Facilitator guide](facilitator-guide.md): key messages, what good looks like and how to help stuck learners.
- [Toolkit slides](docs/slides/README.md): a 15-minute introduction to OpenSpec, Gherkin, Cucumber, GitHub
  Codespaces and GitHub Copilot to open the day, with speaker notes.
- [Preflight checklist](preflight-checklist.md): what to check in accounts, organizations and Codespaces before the day.
- [Exercise outlines](outlines/): the design of each exercise, including what each check proves. They contain the
  answers, so keep them out of learner repositories.
- [Diagram tool](tools/diagrams/README.md): rebuilds the illustrations used in the exercises.

## License

[MIT](LICENSE). Diagrams use [Primer Octicons](https://primer.style/octicons/), © GitHub, Inc., MIT License. The
toolkit slides include [reveal.js](https://revealjs.com/) (MIT License) and the Mona Sans fonts (SIL Open Font
License 1.1); see the [slides README](docs/slides/README.md#credits).
