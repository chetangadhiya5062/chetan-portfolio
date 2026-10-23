#!/bin/bash
# Double-click to commit everything and push the agent-v1 branch.
# The commit is made with the git name and email already configured on this computer.
cd "$(dirname "$0")" || exit 1
BRANCH=agent-v1

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This folder is not a git repository."; read -r -p "Press Enter to close"; exit 1
fi

CURRENT=$(git branch --show-current)
if [ "$CURRENT" = "master" ] || [ "$CURRENT" = "main" ]; then
  echo "You are on \"$CURRENT\". This script never commits there. Run: git switch $BRANCH"
  read -r -p "Press Enter to close"; exit 1
fi
if [ "$CURRENT" != "$BRANCH" ]; then
  echo "You are on \"$CURRENT\". Switching to $BRANCH..."
  git switch "$BRANCH" || { read -r -p "Press Enter to close"; exit 1; }
fi

echo; echo "Committing as: $(git config user.name) <$(git config user.email)>"; echo
git status --short; echo
read -r -p 'Commit message (Enter for "update portfolio"): ' MSG
[ -z "$MSG" ] && MSG="update portfolio"

git add -A
if git diff --cached --quiet; then
  echo "Nothing new to commit."
else
  git commit -m "$MSG" || { read -r -p "Commit failed. Press Enter to close"; exit 1; }
fi

echo; echo "Pushing $BRANCH to GitHub..."
git push -u origin "$BRANCH" || { read -r -p "Push failed. Press Enter to close"; exit 1; }
echo; echo "Done. Branch $BRANCH is on GitHub."
read -r -p "Press Enter to close"
