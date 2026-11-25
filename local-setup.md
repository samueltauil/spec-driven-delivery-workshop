# Work in VS Code on your computer

Each exercise in this workshop opens in a ready-made [GitHub Codespaces](https://docs.github.com/en/codespaces/overview)
environment, and that is the quickest way to take part. If you can't use Codespaces, for example because your
organization's policy blocks it, your monthly allowance has run out or your connection is too slow for a browser
editor, you can do every exercise in [Visual Studio Code](https://code.visualstudio.com/) on your own computer
instead. Mona checks your work the same way in both cases: on GitHub, from what you push.

Set up your computer once with this page. Then, in step 1 of each exercise, open
**Can't use Codespaces? Work in VS Code on your computer instead** and follow those instructions rather than opening a
codespace.

## What you need

| Tool | Version | What it's for |
| --- | --- | --- |
| [Visual Studio Code](https://code.visualstudio.com/download) | 1.116 or later | The editor. GitHub Copilot is built in from version 1.116. |
| [Git](https://git-scm.com/downloads) | Any recent version | Branches, commits and pushes. On Windows, Git for Windows also installs Git Bash and Git Credential Manager. |
| [Node.js](https://nodejs.org/en/download) | The latest LTS release of 22, 24 or 26, and at least 22.12 | Runs npm, which installs each exercise's own tools: the OpenSpec command-line tool and, in exercises 1 and 3, Cucumber.js. |
| [GitHub Copilot](https://github.com/features/copilot) | Copilot Free or a paid plan | Copilot Chat in VS Code. Exercise 3 uses **Agent** mode. |

You also need:

- A network connection that reaches `github.com` and the public npm registry, `registry.npmjs.org`.
- Permission to install software. Installing Git and Node.js usually needs administrator rights; on a managed
  computer, ask your IT team, or use the versions your organization provides.

You don't need to install OpenSpec or Cucumber.js yourself. Each exercise pins their versions in `package.json`, and
`npm ci` installs them into the exercise folder. You don't need Docker either: the dev container configuration in
each exercise is only for Codespaces.

## Set up your computer once

1. Install VS Code, Git and Node.js from the links in the table. On Windows, keep the default options in the Git
   installer.

1. Open VS Code, then open a terminal with **Terminal** > **New Terminal**. Check each tool.

   ```bash
   git --version
   node --version
   npm --version
   ```

   Each command prints a version number, and `node --version` prints `v22.12.0` or later. If a command isn't found,
   close VS Code and open it again, so it picks up the newly installed tools. On Windows, if it still isn't found,
   sign out of Windows and back in.

1. If you haven't used Git on this computer before, tell it who you are. Git records this name and email address in
   every commit you push. To keep your email address private, use your
   [GitHub-provided `noreply` address](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address).

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

1. Sign in to GitHub Copilot. Hover over the Copilot icon in the Status Bar at the bottom of VS Code, select
   **Use AI Features**, and sign in with the GitHub account you use for this workshop, the one with your Copilot plan.
   For other sign-in options, see [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/setup/copilot).

1. Open Copilot Chat with `Ctrl+Alt+I` (`Ctrl+Cmd+I` on Mac). Check that the mode picker in the chat box offers
   **Agent**.

## Start an exercise on your computer

Step 1 of each exercise walks you through these steps, with the address of your copy filled in:

1. Copy the exercise with the **Copy Exercise** button in its README, and wait for Mona to post step 1 in an issue,
   as usual.

1. In VS Code, press `Ctrl+Shift+P` (`Cmd+Shift+P` on Mac) and run **Git: Clone**. Paste the address of your copy,
   `https://github.com/<your-account>/<repository>.git`, and choose a folder to hold it. Pick a folder outside OneDrive
   and other synced folders, such as `C:\dev` or `~/dev`, because syncing `node_modules` slows `npm ci` down and can
   make it fail. When VS Code asks whether to open the cloned repository, select **Open**.

1. VS Code may ask whether you trust the authors of the files in the folder: select **Yes, I trust the authors**. If it
   opens the folder in Restricted Mode instead, select **Manage** in the banner at the top, then **Trust**. It's your
   own copy, and VS Code keeps the terminal and Copilot's Agent mode off until you trust the folder.

1. If VS Code offers to install the recommended extensions for the repository, select **Install**. If it offers to
   **Reopen in Container**, close that notification: that option needs Docker, and you don't need it on your computer.

1. Open a terminal and run `npm ci`. You are ready when `npx openspec --version` prints `2.0.0`.

Clone each exercise into its own folder, and keep the exercise's issue open in your browser next to VS Code.

## What's different from a codespace

| | In a codespace | In VS Code on your computer |
| --- | --- | --- |
| Tools | `npm ci` runs while the codespace starts. | You run `npm ci` once, after you clone. |
| Files | The exercise's first file opens for you. | You open files yourself with `Ctrl+P` (`Cmd+P` on Mac). Every step names the file. |
| Terminal | Bash on Linux. | Your default shell: PowerShell on Windows, zsh on Mac, usually bash on Linux. Every command in the exercises works in PowerShell, Git Bash, zsh and bash. |
| Pushing | The codespace is already signed in to GitHub. | The first `git push` may ask you to sign in to GitHub, in your browser or in VS Code. |
| Settings | The dev container applies them. | `.vscode/settings.json` and `.vscode/extensions.json` in each exercise apply the same search, line-ending and privacy settings. Leave them as they are. |

## Troubleshooting

- **PowerShell says `running scripts is disabled on this system` when you run `npm` or `npx`:** The PowerShell
  [execution policy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
  blocks the script that starts npm. Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, type `Y` if
  PowerShell asks you to confirm, then open a new terminal. If your organization doesn't allow that, make Git Bash
  your default terminal: press `Ctrl+Shift+P`, run **Terminal: Select Default Profile**, choose **Git Bash**, then
  open a new terminal. If Copilot's Agent mode still can't run `npm`, run the command yourself in your terminal and
  tell Copilot the result.

- **`npm ci` prints `npm warn EBADENGINE Unsupported engine`:** It's only a warning: a few of the tools' dependencies
  ask for a newer minor release of Node.js than yours. If `npm ci` ends with `added … packages`, everything works. To
  remove the warning, install the latest LTS release of Node.js.

- **`npm ci` stops with an error on an older Node.js:** Check that `node --version` prints `v22.12.0` or later. If it
  doesn't, install the latest LTS release of Node.js, close VS Code, open it again, and run `npm ci` again.

- **`npm ci` fails with `ETIMEDOUT`, `ECONNRESET` or a certificate error:** Your network can't reach the public npm
  registry directly. Ask your IT team for the proxy or registry settings, and set them with
  [npm config](https://docs.npmjs.com/cli/v11/using-npm/config#proxy).

- **`npx openspec` asks `Need to install the following packages`:** The terminal isn't in the exercise folder, or
  `npm ci` hasn't run there. Type `n`, `cd` to the folder that holds `package.json`, run `npm ci`, then try again.

- **The terminal won't open, Agent mode doesn't work, or VS Code mentions Restricted Mode:** Select **Manage** in the
  Restricted Mode banner at the top of the window, then **Trust**.

- **`git commit` says `Author identity unknown`:** Run the two `git config` commands from
  [Set up your computer once](#set-up-your-computer-once), then commit again.

- **`git push` asks for a username and password in the terminal:** Don't type your GitHub password: GitHub doesn't
  accept it for Git. Press `Ctrl+C`, then push from a terminal inside VS Code, which signs you in through your
  browser. You can also set up
  [Git Credential Manager](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git).

- **`git push` fails with `403` or `Permission denied`:** The clone points at a repository you can't write to, or you
  signed in with another account. Run `git remote -v` and check that it shows your copy of the exercise.

- **`git push` fails with `GH007: Your push would publish a private email address`:** Set your `noreply` address with
  `git config --global user.email`, run `git commit --amend --reset-author --no-edit`, then push again.

- **Git warns that `CRLF will be replaced by LF`:** It's harmless. The repository stores files with LF line endings,
  and Git converts the file when you commit it.

- **Copilot Chat or Agent mode is missing:** If VS Code shows Restricted Mode, trust the folder first. Otherwise,
  update VS Code to the latest version and sign in to Copilot as described above. If an organization manages your
  Copilot plan, ask its administrator whether its policies allow Copilot Chat and Agent mode in VS Code.

When you finish an exercise, your work is on GitHub, so you can delete its local folder.
