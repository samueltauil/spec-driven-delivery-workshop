# Preflight checklist: Spec-Driven Delivery with OpenSpec, Gherkin and GitHub Copilot

Complete at least two working days before the session. Use an account configured like a participant's.

## Accounts and access

- [ ] Every participant has a GitHub account and knows which owner to copy exercises into (their personal account
      or the learning organization).
- [ ] Every participant can use GitHub Copilot Chat in VS Code, including **Agent** mode, which exercise 3 needs.
      Copilot Free works, but its monthly allowance is limited and the full day uses many prompts. If an
      organization manages Copilot, confirm that its policies allow Copilot Chat and Agent mode in VS Code.
- [ ] Participants can see the four template repositories. Public templates work for everyone; private or internal
      templates need read access for every participant.
- [ ] Participants can create repositories in the target owner (member repository creation, for an organization).

## Codespaces

- [ ] Codespaces is available to every participant. Personal accounts include a monthly free allowance; in an
      organization, Codespaces must be enabled for members, with a spending limit set.
- [ ] Enterprise Managed User accounts can't use Codespaces in personal accounts: use a learning organization with
      Codespaces enabled.
- [ ] From a participant-like network, a codespace for each exercise starts in under 5 minutes and its setup
      (`npm ci` from the public npm registry) completes. Proxies and firewalls must allow `registry.npmjs.org`.
- [ ] In each codespace: `node --version` prints v22, `npx openspec --version` prints `2.0.0`, and
      `npm run validate:spec` passes. In exercises 1 and 3, `npm run test:bdd` runs Cucumber.

## Local computers (for anyone who can't use Codespaces)

- [ ] Participants who can't use Codespaces received [Work in VS Code on your computer](local-setup.md) with the
      pre-work, and finished its one-time setup before the day.
- [ ] On a participant-like computer and network: VS Code 1.116 or later with Copilot signed in, Git, and Node.js
      22.12 or later. Cloning a copy, `npm ci` and `npx openspec --version` (`2.0.0`) work, and the first
      `git push` signs in to GitHub.
- [ ] On Windows, `npm --version` works in the VS Code PowerShell terminal. If PowerShell blocks scripts, follow the
      first entry in the guide's [Troubleshooting](local-setup.md#troubleshooting).

## Organization settings (if not using personal accounts)

- [ ] Dedicated learning organization (recommended for Enterprise Managed Users).
- [ ] Actions policy allows all actions, or the allowlist includes the
      [GitHub Skills allowlist](https://github.com/skills/skills-for-emu/tree/main/actions-allowlist) plus every
      action these exercises use:
  - `skills/exercise-toolkit/.github/workflows/start-exercise.yml@v0.9.3`
  - `skills/exercise-toolkit/.github/workflows/find-exercise-issue.yml@v0.9.3`
  - `skills/exercise-toolkit/.github/workflows/finish-exercise.yml@v0.9.3`
  - `skills/exercise-toolkit/actions/wait-for-workflow@v0.9.3` (exercise 3 only)
  - `actions/checkout@v6` and `actions/setup-node@v6`. Exercise 3's `CI` workflow pins them by commit SHA, so also
    allow `actions/checkout@*` and `actions/setup-node@*`, or select **Allow actions created by GitHub**.
  - `GrantBirki/comment@v2.1.1`
  - `peter-evans/find-comment@v4`
- [ ] Default workflow permissions don't block exercises. Every workflow declares its own permissions.

## Exercises

- [ ] Each exercise passes `validate_exercise.py` with no blocking findings.
- [ ] Each exercise passes a walkthrough test end to end, including at least one failed check and its recovery.
- [ ] The template repositories are marked as templates, with every step workflow disabled.
- [ ] Each README's **Copy Exercise** button opens "Create a new repository" with the right template selected.
- [ ] Tested time per exercise recorded in the [workshop plan](workshop-plan.md).

## Logistics

- [ ] Agenda shared; pre-work sent with links, including
      [Introduction to GitHub](https://github.com/skills/introduction-to-github) for anyone new to branches and
      pull requests.
- [ ] Help channel ready; helpers briefed with the [facilitator guide](facilitator-guide.md) and given the
      [exercise outlines](outlines/), which contain the answers.
- [ ] [Toolkit slides](docs/slides/README.md) tested on the presentation setup: the speaker view with <kbd>S</kbd>
      first (allow pop-ups), then full screen with <kbd>F</kbd> in the slides window. Rehearse once with the speaker
      view timer.
- [ ] Accessibility: materials shared in advance; participants told that they'll use a browser, VS Code (in
      Codespaces or on their computer) and a terminal, so they can prepare assistive technology.
- [ ] Backup plan documented: VS Code on the participant's computer, set up with [local-setup.md](local-setup.md),
      for anyone who can't use Codespaces, and pairing for anyone whose computer or Copilot isn't ready.
- [ ] Survey and evaluation instruments ready.
