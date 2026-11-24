# Exercise outline: Deliver an Approved Behavior with Copilot

## Logistics

- **Exercise title:** Deliver an Approved Behavior with Copilot
- **Repository name candidates:** `spec-driven-deliver-a-behavior`, `spec-driven-test-first-delivery`, `deliver-approved-behavior`
- **Recommended repository name:** `spec-driven-deliver-a-behavior` — keeps the series prefix and names the
  outcome the learner reaches.
- **Learner copy name:** `skills-spec-driven-deliver-a-behavior`
- **Experience level:** Intermediate (beginner in code; Copilot writes most of it)
- **Target owner:** samueltauil
- **Copyright holder:** acworkma
- **Series:** Spec-Driven Delivery workshop, exercise 3 of 4. Previous: Find the Missing Rules Before You Build.
  Next: Draft Your First Spec.
- **Environment:** GitHub Codespaces (Node.js 22, Cucumber.js and the OpenSpec CLI preinstalled), Copilot Chat in
  Ask and Agent modes, the GitHub web UI for the pull request
- **exercise-toolkit version:** v0.9.3

## Learner

- **Persona:** The mixed-role delivery team member from exercises 1 and 2 (product owner, analyst, tester,
  developer or architect) at Contoso Health Plan.
- **Can already:** Branch, commit, push and open a pull request; trace a requirement and scenario to evidence and
  say what the evidence does not prove (exercise 1); read and validate an OpenSpec change (exercise 2).
- **New to:** Test-first delivery with an AI agent; human gates around Copilot's plan and diff; CI as shared
  evidence; archiving a delivered change into the living spec.
- **Likely misconceptions:** "If Copilot's tests pass, the behavior is right." "Copilot may fix a failing test to
  make it pass." "Archiving is housekeeping." "Merging my own pull request is an approval."
- **Motivation:** Their team wants Copilot to speed up delivery without losing control of what ships.
- **Constraints:** About 75 minutes; only this exercise in the workshop changes code, and Copilot does most of it.
- **Access needs to design for:** Keyboard-only use, screen readers, non-native English readers.

## Objective and evidence

**Exercise objective:** Deliver one approved OpenSpec change with Copilot through human gates, traceable
evidence, CI and archive.

| Step | Objective (observable) | Activity that performs it | Evidence afterwards | Automated check (what it proves) | Not proven by the check | Feedback if it fails |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Review an AI-drafted delivery plan against the spec and write failing tests named with scenario IDs | Open the codespace and branch; Copilot drafts `delivery/plan.md`; the learner reviews it and records the decision; Copilot writes unit tests; the learner confirms they fail | `delivery/plan.md`, `tests/*.test.js` on `implement-dependent-privacy` | The plan and the tests mention all six scenario IDs; the plan has a `Reviewed by:` line; a test file exists | That the review was careful; that the tests assert the right thing | Lists the missing IDs; add the review line; save tests as `tests/<name>.test.js` |
| 2 | Let Copilot implement the policy until all evidence is green, without touching tests, specs or features | Agent mode implements `src/claim-visibility.js`; the learner reviews the diff and reruns the tests | Passing unit and BDD tests | Unit and BDD tests pass; feature, step definitions, OpenSpec files (except `tasks.md`) and `src/claim-status.js` match `main`; tests still name every scenario ID | That the tests were not weakened in other ways; production readiness | Rerun the failing command; restore protected files with `git restore --source main` |
| 3 | Open a pull request whose body traces IDs to evidence and states its limits, and get CI green | Write the body from memory (retrieval from exercise 1); open the pull request; read the CI result | Pull request with a passing `CI` run | Body mentions all six scenario IDs and says what the evidence does not prove; the `CI` run for the head commit succeeded | That the body is accurate; that a person reviewed the code | Edit the body; open the CI log and fix the first failure |
| 4 | Archive the delivered change so the living spec holds the new rules | Tick the tasks that happened; run `npx openspec archive implement-dependent-privacy` and answer its prompt; push | `openspec/specs/member-claim-privacy/spec.md`; `openspec/changes/archive/YYYY-MM-DD-implement-dependent-privacy/` | Living spec has `001-FR-011` to `001-FR-013`; active change folder gone; exactly one dated archive folder; strict validation passes | That the prompts were read | Run the archive command; delete a duplicate archive folder |
| 5 | Merge only after CI passes, and know why self-merge is not independent approval | Wait for CI; review the files changed; merge | Merged pull request | Ungraded (the merge event itself is the evidence) | That anyone else approved | n/a |

## Story

Contoso Health Plan's member portal lets a subscriber (a parent or guardian) see the claims of the dependents on
their plan. The product owner and the privacy lead have approved one change, `implement-dependent-privacy`: some
claims must stay hidden, and a hidden claim must leave no trace in lists, totals, messages or direct lookups. The
policy function is still a stub. Your team delivers the change with Copilot, and a person decides at every gate.

## README

- **One-line description:** Turn an approved OpenSpec change into failing tests, working code, a pull request
  with evidence and an updated living spec, with Copilot doing most of the coding and a person at every gate.
- **Who is this for:** Product owners, analysts, testers, developers and architects who finished exercises 1 and 2
  or can read an OpenSpec change and a Gherkin feature.
- **What you'll learn:** How to keep Copilot inside approved scope with a reviewed plan, red-then-green tests named
  with scenario IDs, CI, an archive and a human merge.
- **What you'll build:** A working dependent claim privacy policy, delivered through a pull request and archived
  into the living spec.
- **Prerequisites:** Exercises 1 and 2 (recommended); branches, commits and pull requests; GitHub Codespaces;
  Copilot Chat with Agent mode (Copilot Free is enough).
- **How long:** Less than 80 minutes.
- **In this exercise, you will:** (1) review Copilot's plan and write failing tests, (2) let Copilot implement the
  behavior until the tests pass, (3) open a pull request with evidence and pass CI, (4) archive the change into the
  living spec, (5) merge after CI passes.

## Support curve and learning moves

| Step | Support level | Retrieval or generation moment | Prediction or reflection prompt |
| --- | --- | --- | --- |
| 1 | Worked example: exact prompts, a review checklist, the expected red output | The learner writes the human review decision | "How many tests will fail against the stub, and why?" |
| 2 | Guided: one prompt; the learner judges the diff with a checklist | Check the code against the rule at ages 12, 13, 17 and 18 | "Which file should Copilot not have touched?" |
| 3 | Faded: required parts listed, no template; example only in the hint | Recall from exercise 1: what the evidence does not prove | "What would a reviewer need to trust this change?" |
| 4 | Guided command; the learner reads and answers the real prompt | Decide which tasks actually happened before ticking them | "Where will the rules live after archiving?" |
| 5 | Independent | Recall: who approves on a real team | "What did your own merge not prove?" |

## Steps

### Step 1 - Plan the delivery and write failing tests (human check)

- **Question this step answers:** Before anyone writes code, which test proves each approved scenario?
- **Estimated learner time:** 22 minutes (including codespace start).

**📖 Theory:** Test-first delivery starts from approved scenarios. A delivery plan maps each scenario ID to the code
that changes and the test that proves it; a person reviews that plan against the spec before coding starts (AI
drafts, humans decide). Tests written first must fail against the stub (red); that failure shows they really call
the code. Copilot Chat Agent mode can edit files and run commands, so the prompt states scope and limits.
Image: `delivery-flow-1.png`.

**⌨️ Activity 1:** Open the codespace; create the `implement-dependent-privacy` branch.

**⌨️ Activity 2:** Agent mode drafts `delivery/plan.md` (one row per scenario ID: requirement, code, unit test,
Gherkin scenario). The learner checks it against the spec delta with a checklist and adds a `## Human review`
section with `Reviewed by:` and `Decision:`.

**⌨️ Activity 3:** Agent mode writes `tests/claim-visibility.test.js`, one test per scenario ID with the ID at the
start of the test name. The learner runs `npm run test:unit` and `npm run test:bdd` and sees them fail with
`Not implemented`; commit and push both files.

**Transition**

- **Actions trigger:** `push` to `implement-dependent-privacy` with `paths: delivery/**, tests/**`.
- **Copy-time safety:** the branch does not exist in the template.
- **Grading checks:** the plan mentions all six scenario IDs; the last `Reviewed by:` line in the plan has a
  value of at least two characters that is not a placeholder; at least one `tests/*.test.js` exists; the tests
  mention all six scenario IDs. Red is not required (the stub throws).
- **Failure feedback:** rows per check; the log lists missing IDs; tips: add a row per missing ID, write your role
  after `Reviewed by:`, save tests under `tests/` with a `.test.js` name.
- **Learner artifact:** `delivery/plan.md`, `tests/claim-visibility.test.js`.

### Step 2 - Implement with Copilot until the evidence is green

- **Question this step answers:** Can Copilot make the tests pass without changing what "pass" means?
- **Estimated learner time:** 15 minutes.

**📖 Theory:** In Agent mode, Copilot edits files, runs tests and iterates. The approved spec, the feature and the
tests are the target, so the agent changes only the code. Copilot output varies from run to run; the learner
reviews the diff and reruns the tests, and Mona grades files and test results, never wording.
Image: `delivery-flow-2.png`.

**⌨️ Activity 1:** Agent mode implements `src/claim-visibility.js` until `npm test` passes, with explicit limits.

**⌨️ Activity 2:** The learner reviews `git status` and the diff (only `src/claim-visibility.js` should change),
walks the code through ages 12, 13, 17 and 18, reruns `npm test`, then commits and pushes.

**Transition**

- **Actions trigger:** `push` to `implement-dependent-privacy` with `paths: src/**, tests/**`.
- **Copy-time safety:** branch filter.
- **Grading checks:** tests still mention all six scenario IDs; `npm run test:unit` passes; `npm run test:bdd`
  passes; `features/**`, `openspec/**` (except `tasks.md`) and the supplied `src/claim-status.js` match `main`.
- **Failure feedback:** rows per check; tips: run the failing command in the terminal; restore protected files with
  `git restore --source main -- <path>`; push again.
- **Learner artifact:** working `src/claim-visibility.js`.

### Step 3 - Open a pull request with evidence and pass CI

- **Question this step answers:** What does a reviewer need to trust this change?
- **Estimated learner time:** 15 minutes (including the CI run).

**📖 Theory:** Continuous integration (CI) reruns the same evidence on a clean machine for every pull request. This
repository's `CI` workflow runs unit tests, BDD tests and strict OpenSpec validation. The pull request body links
requirement and scenario IDs to evidence and says what the evidence does not prove (retrieval from exercise 1).
Image: `delivery-flow-3.png`.

**⌨️ Activity 1:** Open a pull request from `implement-dependent-privacy` to `main` with a body written from memory:
requirement and scenario IDs, the evidence, what it does not prove. Do not merge yet.

**⌨️ Activity 2:** Watch the `CI` check on the pull request; read the result; fix and push if it fails.

**Transition**

- **Actions trigger:** `pull_request` to `main`, types `opened`, `edited`, `synchronize`, `reopened`.
- **Copy-time safety:** not a push event.
- **Grading checks:** body mentions all six scenario IDs; body says what the evidence does not prove (`not prove`);
  the `CI` run for the head commit concluded `success` (via `skills/exercise-toolkit/actions/wait-for-workflow`).
- **Failure feedback:** rows per check; tips: edit the description (Mona rechecks on edit); open the CI log, fix the
  first failure and push.
- **Learner artifact:** pull request with a green `CI` check.

### Step 4 - Archive the change into the living spec

- **Question this step answers:** Where do the new rules live once the change is delivered?
- **Estimated learner time:** 12 minutes.

**📖 Theory:** An active change describes rules that are on their way. Archiving merges the change's requirements
into the living spec (`openspec/specs/member-claim-privacy/spec.md`) and moves the change folder to
`openspec/changes/archive/YYYY-MM-DD-implement-dependent-privacy/`, a dated record. The command asks before it
writes, and it warns about unticked tasks: both are human decisions. Image: `delivery-flow-4.png` and
`archive-flow.png`.

**⌨️ Activity 1:** Tick the six tasks in `tasks.md` that actually happened; run
`npx openspec archive implement-dependent-privacy` without `--yes`; read the summary; answer `y` to
`Proceed with spec updates?`.

**⌨️ Activity 2:** Inspect the living spec and the archive folder; run `npm run check`; commit and push.

**Transition**

- **Actions trigger:** `push` to `implement-dependent-privacy` with `paths: openspec/**`.
- **Copy-time safety:** branch filter.
- **Grading checks:** living spec exists with `001-FR-011`, `001-FR-012`, `001-FR-013`; active change folder is
  gone; exactly one dated archive folder with a proposal; `openspec validate --all --strict` passes.
- **Failure feedback:** rows per check; tips: run the archive command from the repository root; keep one archive
  folder; push with `git add openspec`.
- **Learner artifact:** living spec and dated archive.

### Step 5 - Merge after CI passes (human check)

- **Question this step answers:** Who decides that the change ships?
- **Estimated learner time:** 8 minutes.

**📖 Theory:** Merging is the last human gate. On a real team, branch protection requires passing checks and an
approval from someone other than the author. A solo learner who merges their own pull request is not independent
approval; the exercise lets it happen so the loop can close. Image: `delivery-flow-5.png`.

**⌨️ Activity:** Wait for `CI` to pass on the archive commit; review **Files changed**; merge the pull request.

**Transition**

- **Actions trigger:** `pull_request` `closed` on `main` with job guard `github.event.pull_request.merged == true`.
- **Copy-time safety:** not a push event; closing without merging does nothing.
- **Grading checks:** ungraded; the merge event is the evidence and a failed check would strand the learner after
  the pull request is closed.
- **Learner artifact:** merged pull request; `main` holds the code and the living spec.

## Review

- **Recap:** You reviewed Copilot's plan, saw tests fail first, let Copilot make them pass within limits, opened a
  pull request with evidence and green CI, archived the change into the living spec and merged.
- **Recall questions:** Why must new tests fail first? What should happen when Copilot wants to change a test or a
  feature file? What does archiving change? Why is your own merge not an approval?
- **Transfer prompt:** Pick one approved story in your backlog; list its scenario IDs and the failing test you would
  write first for each.
- **What's next:** Exercise 4, Draft Your First Spec.

## File map

| File | Purpose |
| --- | --- |
| `.github/exercise-outline.md` | This outline |
| `README.md`, `LICENSE` | Landing page; MIT |
| `.github/steps/1-step.md` … `5-step.md`, `x-review.md` | Content |
| `.github/workflows/0-start-exercise.yml`, `1-step.yml` … `5-step.yml` | Exercise automation |
| `.github/workflows/ci.yml` | The repository's own CI (not a step workflow) |
| `.github/copilot-instructions.md`, `.github/instructions/gherkin.instructions.md` | Spec-driven rules for Copilot |
| `.devcontainer/devcontainer.json` | Node.js 22, `npm ci`, Copilot Chat, Cucumber extension |
| `openspec/changes/implement-dependent-privacy/` | The approved change: proposal, design, tasks, spec delta |
| `openspec/specs/member-eligibility/spec.md` | An existing living spec |
| `features/claim-privacy.feature`, `features/step-definitions/claim-privacy.steps.js` | Acceptance examples |
| `src/claim-visibility.js` | The stub the learner and Copilot implement |
| `src/claim-status.js` | Supplied list and lookup code that calls the policy |
| `package.json`, `package-lock.json` | Pinned Cucumber.js and OpenSpec CLI; `test`, `test:bdd`, `check` scripts |

## Test plan

- **Walkthrough personas:** product owner with little terminal experience; developer who skims.
- **Negative tests:** plan or tests missing an ID; no `Reviewed by:` value; no test file; stub left in place;
  feature or step definitions edited; spec delta edited; test IDs removed; change not archived; archived twice;
  CRLF line endings; PR body without IDs or limits; CI failing.
- **Environments to test:** personal account, Codespaces, Copilot Free (Agent mode available).

## Risks and open questions

- Copilot output varies; the agent may edit tests or specs. The prompts set limits and step 2 grades protected files.
- The CI wait adds up to five minutes to step 3; the checking-work comment stays visible meanwhile.
- `skills/exercise-toolkit/actions/wait-for-workflow` is not on some enterprise allowlists; an EMU variant would
  poll with `actions/github-script` instead.
- The archive date uses the codespace clock (UTC); the check accepts any date.
- Live Copilot UI labels and the CI timing are unverified until a walkthrough test.

## Future considerations

- A team variant where a second person approves the pull request with a required review.
- A variant with a change that also modifies an existing living spec (`MODIFIED` requirements).
