#!/usr/bin/env bash

######################
## Deployment script #
######################
## arg 1: git tag   ##
## arg 2: repo-name ##
######################

# Exit on error and show executed
set -ex

# Check if correct arguments have been set.
if [ -z "$1" ]; then
    echo 'The first argument should be the version you want to deploy to dist.'
    exit 1
fi

if [ -z "$2" ]; then
    echo 'The second argument should be the repo name.'
    exit 1
fi

# Repo to deploy to:
USER="Yoast-dist"
REPO=$2
REPO_URL="git@github.com:$USER/$REPO.git"

# Get the latest tag.
lastTag=$1
branch="trunk"
mainDir=$(pwd)

if [[ $lastTag =~ ^feature/* || $lastTag =~ ^release/* || $lastTag =~ ^hotfix/* || $lastTag == "trunk" ]]; then
  branch=$lastTag
fi

# Clone the dist repo.
git clone "${REPO_URL}" dist-repo --no-checkout
cd dist-repo
git checkout "$branch" 2>/dev/null || git checkout -b "$branch"
cd ..

# Copy the git folder with the entire history.
cp -r ./dist-repo/.git ./artifact
cp composer.json ./artifact

# Navigate to the to be committed folder.
cd ./artifact

# Commit the files.
git add -A

# If it's a feature, release or trunk branch.
if [[ $lastTag =~ ^feature/* || $lastTag =~ ^release/* || $lastTag =~ ^hotfix/* || $lastTag == "trunk" ]]; then
  git commit --allow-empty -m "${TRAVIS_COMMIT_MESSAGE}"
else
  git commit -m "commit version tag ${lastTag}"
   # Tag the commit.
  git tag "${lastTag}" "$(git rev-parse HEAD)"
fi

# Push to remote.
git push -u origin $branch --tags
