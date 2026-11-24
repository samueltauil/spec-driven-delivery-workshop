# Facilitator guide: Spec-Driven Delivery with OpenSpec, Gherkin and GitHub Copilot

This guide supports the full-day agenda in [workshop-plan.md](workshop-plan.md). The exercise outlines in
[outlines/](outlines/) contain the expected answers and every check Mona runs. Share them with helpers, not with
learners.

## Before the session

- [ ] [Preflight checklist](preflight-checklist.md) complete, including a walkthrough of every exercise from an
      account configured like a participant's.
- [ ] Help channel created in the event chat, with a pinned message that links the four exercises.
- [ ] Links ready to share: the [workshop README](README.md), the pre-work
      ([Introduction to GitHub](https://github.com/skills/introduction-to-github)) and the survey.
- [ ] Backup plan if Codespaces is unavailable: learners pair with a neighbor whose codespace works. Learners with
      Node.js 22 can also clone their copy and run `npm ci` locally; every command in the exercises works there.
- [ ] Backup plan if Copilot runs out for a learner: pair them with a neighbor. Exercises 1, 2 and 4 explain how to
      continue without Copilot; exercise 3 needs Copilot's Agent mode for steps 1 and 2.

## Opening (20 minutes)

Present the [toolkit slides](docs/slides/README.md) (about 15 minutes). Their speaker notes are the opening script:
they cover the loop, the five tools, the four human gates, fictional data and how Mona guides each exercise.
Rehearse once with the timer in the speaker view so you know your own pace. Then spend the last few minutes getting
everyone into exercise 1 and checking access.

If you cannot show slides, use this short script instead (2 to 3 minutes):

> Today you'll take business rules through the whole delivery loop: intent, requirement, scenario, code and
> evidence. You'll question a thin epic, deliver an approved change with Copilot, and draft a spec of your own.
> Copilot drafts; you decide. Every organization, person and record you'll see is fictional, so never paste real
> member data or real work items into a prompt.
>
> Each exercise works the same way. You copy it, Mona opens an issue with the instructions, checks your work after
> each step and gives you feedback in the issue. Keep the issue tab open next to your codespace.

## Per exercise

### Exercise 1: Trace the Loop from Intent to Evidence

- **Objective:** Trace an approved behavior from intent to requirement, scenario, code and passing evidence, and
  name what the evidence does not prove.
- **Timing:** Start 0:20, expected median 35 minutes, cut-off 1:00.
- **Intro (1 minute):** "A green test is evidence for something. Today's question is: for what, exactly?"
- **Watch for:** The first codespace start (2 to 4 minutes; reassure learners). In step 2, learners who write
  that the weekend appeal is fully proven: the scenario checks the clock and the priority, not the on-call
  notification. In step 3, learners who search only one place: an ID is a gap only when no feature and no unit
  test mentions it.
- **Checkpoint:** Thumbs up when Mona posts step 2 (the trace is pushed).
- **Debrief question:** "Your weekend appeal scenario is green. What would you tell your lead it does not prove,
  and who should confirm the gap?"

### Exercise 2: Find the Missing Rules Before You Build

- **Objective:** Turn a thin epic into a strictly valid OpenSpec change whose requirements close real delivery
  gaps.
- **Timing:** Start 1:10, expected median 45 minutes, cut-off 2:00.
- **Intro (1 minute):** "In 2025, eight rules surfaced late. Which questions would have found them before build?"
- **Watch for:** Learners who ask Copilot first: remind them to write their own questions before the prompt.
  In step 2, strict validation errors: every requirement needs `SHALL` or `MUST` and at least one
  `#### Scenario:` heading with exactly four `#` characters. The change folder must be named `add-vision-rider`.
- **Checkpoint:** Strict validation passes (`npm run validate:spec`).
- **Debrief question (Debrief 2, after the break):** "Which of the eight gaps did your spec catch, and which move
  would have caught the ones you missed?"

### Exercise 3: Deliver an Approved Behavior with Copilot

- **Objective:** Deliver one approved OpenSpec change with Copilot through human gates, traceable evidence, CI
  and archive.
- **Timing:** Steps 1 and 2 from 2:30 to 3:30; steps 3 to 5 from 4:30 to 5:25. Expected median 60 to 75 minutes.
- **Intro (1 minute):** "Copilot will write the code. Your job is to make sure it can't move the target."
- **Watch for:**
  - Agent mode missing from the chat box (plan or policy). Pair the learner with a neighbor.
  - Copilot asking to run commands: learners should read each command and allow only test runs.
  - Copilot editing tests, the feature or the spec to get a pass. Ask the learner what the green result would
    prove after that edit.
  - In step 3, Mona waits for CI before grading, so the check can take a few minutes.
  - In step 4, `npx openspec archive` asks questions. It must run in the terminal, not through Copilot Chat, and
    without `--yes`.
- **Checkpoint:** "Step 2 checks pass" before lunch; Mona posts the review after the merge.
- **Debrief question:** "You merged your own pull request after CI passed. Was the change approved? What would
  have to be true on your team?"

### Exercise 4: Draft Your First Spec (capstone)

- **Objective:** Independently draft a candidate OpenSpec change with three or more scenarios and make a reasoned
  Ready to build decision.
- **Timing:** Start 5:50, expected median 60 minutes, cut-off 7:00. At minute 50, swap pairs to pressure-test
  each other's Ready to build decision.
- **Intro (1 minute):** "Nobody has framed this problem yet. You decide whether it is ready to build, and
  'not ready' is a valid answer."
- **Watch for:** Learners who can't choose between the two option briefs (either works; pick the one closest to
  their daily work). Happy-path-only scenarios: ask "what happens with no match, a duplicate, or missing
  identifiers?" Learners who mark the spec ready while a capability is still `unconfirmed`, or who invent a
  baseline instead of writing `unknown — owner to provide`.
- **Checkpoint:** Pull request opened.
- **Debrief question (readouts):** "What is your gate decision, what blocks it, and how will you measure the
  result?"

## Troubleshooting

| Symptom | Check | Fix |
| --- | --- | --- |
| No exercise issue after copying | Actions tab of the learner's copy: did **Step 0** run? | If Actions is off, enable it. If **Step 0** failed, select it in the Actions tab, select **Enable workflow**, then **Run workflow**. Or delete the copy and copy the exercise again |
| The codespace opened the original exercise, not the copy | Repository name on the codespace page | Use the codespace button in the learner's issue, which points to their copy |
| The codespace won't start | Codespaces quota, policy, or an Enterprise Managed User account | Pair with a neighbor, or copy into an organization with Codespaces enabled |
| A command says a package is missing | Did the codespace finish its setup? | Run `npm ci` in the terminal, then run the command again |
| No chat icon, or Copilot asks to sign in | Copilot icon in the Status Bar | Sign in with the GitHub account that has Copilot |
| Copilot stops answering or says the limit is reached | Learner's Copilot plan | Follow the step's hint; pair with a neighbor for exercise 3 |
| Mona does not respond | Did the action match the step's trigger (branch, file path, event)? | Repeat the action exactly as instructed; see the step's **Mona did not respond** hint |
| Failed results table | Read the failed rows and tips | Fix and repeat the triggering action |
| Exercise 3, step 3 takes several minutes | The **CI** check on the pull request | Wait for CI; Mona grades after it finishes |
| Exercise 3, step 3: CI is green, but Mona's CI row is ❌ | Did CI take longer than 5 minutes? | Edit the pull request description and select **Update comment**; Mona checks again |
| Exercise 3, step 4 archive didn't wait for an answer | Where the command ran | Run it in the codespace terminal, not through Copilot Chat |
| "Action not allowed" in a run | Organization Actions allowlist | Ask the admin to allow the actions listed in the [preflight checklist](preflight-checklist.md) |
| Repository name taken | Shared organization | Add a suffix, such as initials, to the repository name |

## Stuck-learner protocol

1. Ask what they see and what they expected. Don't take over the keyboard.
2. Look at Mona's last comment together: is it a failed results table, a "checking" message, or nothing?
3. Apply the troubleshooting table and the step's **Having trouble? 🤷** block.
4. After five minutes, move them on (pair them, or start the next exercise) and follow up asynchronously. Every
   exercise keeps working after the session.

## Resets

- **Start over:** Delete or archive the learner's copy, then copy the exercise again.
- **Run a check again:** Repeat the triggering action. Some steps also offer **Run workflow** in the Actions tab,
  as their **Mona did not respond** hint explains.

## Closing

- Recap capabilities, not completion counts: tracing, questioning, delivering against evidence and the gate
  decision.
- Share the survey and the follow-up: each pair brings its exercise 4 pull request to its team.
- Remind learners that the exercises stay available to finish on their own.

## After the session

- Collect feedback into one tracking issue per exercise.
- Record the median time per exercise and update the planned times in the [workshop plan](workshop-plan.md).
- Turn recurring confusion into content fixes, then run the walkthrough test again.
