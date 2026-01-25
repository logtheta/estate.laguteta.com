# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Worktree & PR Rules

**CRITICAL: Never work directly on main.**

1. **Always use worktrees** - All task/epic work MUST happen in a dedicated worktree:
   ```bash
   bd worktree <task-id>
   ```
2. **Always create PRs** - Never commit directly to main. Create a branch, push, and open a PR.
3. **Stay in your worktree** - Never leave or switch worktrees unless explicitly asked or switching to another task's existing worktree.
4. **Label tasks with PR URL** - After creating a PR, add the URL as a label:
   ```bash
   bd update <task-id> --label "https://github.com/..."
   ```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session
8. **Delete worktree** (after PR merged and task closed) - Remove the worktree:
   ```bash
   bd worktree remove <task-id>  # or: git worktree remove <path>
   ```

## GitHub CLI

**IMPORTANT:** Before using `gh` commands, unset the GITHUB_TOKEN environment variable:
```bash
unset GITHUB_TOKEN && gh pr create ...
unset GITHUB_TOKEN && gh pr merge ...
```
This avoids conflicts with invalid tokens and lets gh use keyring credentials.

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

