# CONTRIBUTING.md

# Welcome
Thank you for contributing. This project is small and fast-moving—clear, small changes help us move quickly.

## What we want
- Small, focused changes: bug fixes, tiny features, docs, or setup clarifications.
- Edits via GitHub web UI are fine.
- Clear steps to test or verify changes in the PR description.

## What we do NOT want
- Large refactors or long-lived branches — open an Issue first to discuss.
- Support questions in Issues — ask a teammate directly or use chat.
- Committing secrets or sensitive files.

## Ground rules
- Target branch: develop (if absent, use main).
- Branch name format (create via branch selector in GitHub): feature/<short>, fix/<short>, docs/<short>, hotfix/<short>.
- Commit message prefixes: feat:, fix:, docs:, chore:, test:.

## How to contribute (web UI)
1. Create a branch via the branch selector: feature/your-short-name.
2. Edit or add files using the pencil icon or “Add file” → “Create new file.”
3. Commit to your branch with a short message using the prefix (e.g., feat: add X).
4. Click “Compare & pull request.”
5. Fill the PR using the template, include clear test/verification steps, and link any related Issue with “Closes #X”.
6. Add one reviewer and request review.
7. Address review comments by committing further changes to the same branch.
8. Merge when approved and checks (if any) pass. Prefer Squash merge for tidy history. Delete the branch after merge.

## Issues
- Use Issues for reproducible bugs or feature requests.
- Issue template (brief): Steps to reproduce, Expected result, Actual result, Environment (browser/OS/Node if relevant), Priority.
- Label Issues: bug, feature, docs, urgent, help-wanted.
- Assign the issue or tag a maintainer if urgent.

## PR expectations
- Title: short summary (use prefix).
- Description: one-line summary, how to test (numbered steps), linked issue.
- Checklist to include in PR body:
  - [ ] Targets develop (or main for hotfix)
  - [ ] Follows commit prefix convention
  - [ ] Tests or manual verification steps provided
  - [ ] README/docs updated if needed
  - [ ] No secrets included

## Reviews
- Keep PRs small and focused.
- Reviewers should run the provided test steps and leave concise feedback.
- Contributors should respond to comments by editing the same branch and replying in the PR.

## Hotfixes and releases
- Hotfix: branch from main named hotfix/<short>, open PR into main.
- After merging hotfix to main, open PR main → develop to sync.
- Create releases via the GitHub Releases UI if needed.

## Security
- Do NOT open public Issues for security vulnerabilities — email security@your-project.example instead.

## Quick role guide
- Contributor (web-only): create branch, edit files, open PRs, respond to reviews.
- Developer: implement changes, provide verification steps, run tests locally if needed.
- Reviewer: verify PR steps, comment, approve.
- Maintainer: merge approved PRs, tag releases, protect main.

## Contact & response times
- Triage/acknowledge within 24 hours where possible.
- Aim to review PRs within 48 hours.

-- end --
